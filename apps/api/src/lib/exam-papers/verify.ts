import type {
  AiVerdict,
  AnswerKey,
  BankQuestion,
  GeneratedPaper,
  PaperVerificationResult,
  QuestionVerificationResult,
} from './types.js';

export type GeminiConfig = {
  apiKey: string | null;
  model: string;
  requestTimeoutMs: number;
};

export function getGeminiConfig(env: NodeJS.ProcessEnv = process.env): GeminiConfig {
  return {
    apiKey: env.GEMINI_API_KEY ?? null,
    model: env.GEMINI_MODEL ?? 'gemini-2.5-flash',
    requestTimeoutMs: 60_000,
  };
}

export type VerifierOptions = {
  config?: GeminiConfig;
  fetchImpl?: typeof fetch;
  maxAttempts?: number;
};

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not configured.');
    this.name = 'GeminiNotConfiguredError';
  }
}

export class GeminiApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
};

const VALID_VERDICTS: AiVerdict[] = ['pass', 'flag', 'fail'];

function normalizeVerdict(value: unknown, fallback: AiVerdict): AiVerdict {
  return VALID_VERDICTS.includes(value as AiVerdict) ? (value as AiVerdict) : fallback;
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Calls the Gemini REST generateContent endpoint with JSON output mode.
 * Plain fetch keeps the API dependency-free; `fetchImpl` is injectable so
 * tests never hit the network.
 */
export async function callGemini(
  prompt: string,
  options: VerifierOptions,
): Promise<string> {
  const config = options.config ?? getGeminiConfig();
  if (!config.apiKey) {
    throw new GeminiNotConfiguredError();
  }

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    `${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new GeminiApiError(
        `The verification service responded with HTTP ${response.status}.`,
      );
    }

    const data = (await response.json()) as GeminiGenerateResponse;
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('') ?? '';

    if (!text.trim()) {
      throw new GeminiApiError('The verification service returned an empty response.');
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

function buildPaperPrompt(paper: GeneratedPaper): string {
  const paperPayload = {
    title: paper.title,
    seed: paper.seed,
    totalMarks: paper.totalMarks,
    durationMinutes: paper.durationMinutes,
    readingTimeMinutes: paper.readingTimeMinutes,
    sections: paper.sections.map((section) => ({
      id: section.id,
      questionCount: section.questionCount,
      marksPerQuestion: section.marksPerQuestion,
    })),
    questions: paper.questions.map((question) => ({
      questionNumber: question.questionNumber,
      sectionId: question.sectionId,
      questionType: question.questionType,
      marks: question.marks,
      statement: question.statement,
      answerKey: question.answerKey,
    })),
  };

  return [
    'You are a CBSE Class 10 Mathematics examiner. A sample test paper has been generated for the official CBSE Mathematics (041) blueprint (80 marks, 3 hours, 15 minutes reading; sections A: 20×1 MCQ, B: 5×2, C: 6×3, D: 4×5, E: 3×4 case study).',
    'Verify the paper and respond with STRICT JSON matching this schema:',
    '{',
    '  "paperVerdict": "pass" | "flag" | "fail",',
    '  "paperReasons": ["..."],',
    '  "blueprintCompliance": { "totalMarksMatch": boolean, "sectionMarksMatch": boolean, "coverageNotes": ["..."] },',
    '  "questions": [ { "questionNumber": 1, "verdict": "pass" | "flag" | "fail", "reasons": ["..."] } ]',
    '}',
    'Rules:',
    '- Mark "pass" only when the answer key is fully correct, the question is well-posed, and the marks match the section.',
    '- Mark "flag" when the question is correct but wording/units/structure need review, or the answer key is incomplete.',
    '- Mark "fail" when the answer key is wrong, the question is unanswerable, or it is out of the Class 10 NCERT scope.',
    '- Recompute every numeric/constructed answer yourself before deciding.',
    '- Include one "questions" entry for EVERY question number 1..' + String(paper.questions.length) + '.',
    '- Do not invent content; NCERT is the source of truth.',
    '',
    'PAPER:',
    JSON.stringify(paperPayload, null, 2),
  ].join('\n');
}

export function parsePaperVerificationResult(
  raw: string,
  questionCount: number,
): PaperVerificationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new GeminiApiError('The verification service returned invalid JSON that could not be parsed.');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new GeminiApiError('The verification service response is not a JSON object.');
  }

  const record = parsed as Record<string, unknown>;
  const rawQuestions = Array.isArray(record.questions) ? record.questions : [];
  const byNumber = new Map<number, QuestionVerificationResult>();

  for (const item of rawQuestions) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const question = item as Record<string, unknown>;
    const questionNumber = Number(question.questionNumber);
    if (!Number.isInteger(questionNumber) || questionNumber < 1) {
      continue;
    }
    byNumber.set(questionNumber, {
      questionNumber,
      verdict: normalizeVerdict(question.verdict, 'flag'),
      reasons: normalizeStringList(question.reasons),
    });
  }

  const questions: QuestionVerificationResult[] = Array.from(
    { length: questionCount },
    (_, index) => {
      const questionNumber = index + 1;
      return (
        byNumber.get(questionNumber) ?? {
          questionNumber,
          verdict: 'pass',
          reasons: [],
        }
      );
    },
  );

  const complianceRaw =
    typeof record.blueprintCompliance === 'object' && record.blueprintCompliance !== null
      ? (record.blueprintCompliance as Record<string, unknown>)
      : {};

  return {
    model: 'gemini',
    paperVerdict: normalizeVerdict(record.paperVerdict, 'flag'),
    paperReasons: normalizeStringList(record.paperReasons),
    blueprintCompliance: {
      totalMarksMatch: complianceRaw.totalMarksMatch !== false,
      sectionMarksMatch: complianceRaw.sectionMarksMatch !== false,
      coverageNotes: normalizeStringList(complianceRaw.coverageNotes),
    },
    questions,
  };
}

export type PaperVerificationOutcome = {
  status: 'verified' | 'review' | 'unverified';
  result: PaperVerificationResult | null;
  note: string;
};

/**
 * Verifies a generated paper with Gemini. Without GEMINI_API_KEY it returns
 * `unverified` (manual review path) instead of failing; AI verdicts are
 * advisory — anything that is not a clean `pass` goes to the review queue.
 */
export async function verifyPaper(
  paper: GeneratedPaper,
  options: VerifierOptions = {},
): Promise<PaperVerificationOutcome> {
  const config = options.config ?? getGeminiConfig();
  if (!config.apiKey) {
    return {
      status: 'unverified',
      result: null,
      note: 'Automated verification is not configured; manual review required.',
    };
  }

  const maxAttempts = options.maxAttempts ?? 2;
  let lastError: unknown = null;
  let result: PaperVerificationResult | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const raw = await callGemini(buildPaperPrompt(paper), options);
      result = parsePaperVerificationResult(raw, paper.questions.length);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!result) {
    return {
      status: 'review',
      result: null,
      note: `Verification failed after ${maxAttempts} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    };
  }

  const verdict = result.paperVerdict;
  if (verdict === 'pass') {
    return { status: 'verified', result, note: 'Verification passed.' };
  }
  return {
    status: 'review',
    result,
    note:
      verdict === 'fail'
        ? 'Verification flagged failing questions; review required.'
        : 'Verification flagged questions for review.',
  };
}

export type BankQuestionVerificationOutcome = {
  status: 'verified' | 'review' | 'unverified';
  verdict: AiVerdict;
  reasons: string[];
  note: string;
};

function buildBankPrompt(question: BankQuestion): string {
  return [
    'You are a CBSE Class 10 Mathematics examiner. Verify this question bank entry against the NCERT Class 10 scope.',
    'Recompute every answer and check each variant. Respond with STRICT JSON:',
    '{ "verdict": "pass" | "flag" | "fail", "reasons": ["..."], "variants": [ { "variantKey": "...", "verdict": "pass" | "flag" | "fail", "reasons": ["..."] } ] }',
    '',
    'QUESTION:',
    JSON.stringify(
      {
        bankKey: question.bankKey,
        questionType: question.questionType,
        marks: question.marks,
        topicId: question.topicId,
        variants: question.variants.map((variant) => ({
          variantKey: variant.variantKey,
          statement: variant.statement,
          answerKey: variant.answerKey,
        })),
      },
      null,
      2,
    ),
  ].join('\n');
}

export async function verifyBankQuestion(
  question: BankQuestion,
  options: VerifierOptions = {},
): Promise<BankQuestionVerificationOutcome> {
  const config = options.config ?? getGeminiConfig();
  if (!config.apiKey) {
    return {
      status: 'unverified',
      verdict: 'flag',
      reasons: [],
      note: 'Automated verification is not configured; manual review required.',
    };
  }

  const maxAttempts = options.maxAttempts ?? 2;
  let lastError: unknown = null;
  let verdict: AiVerdict = 'flag';
  let reasons: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const raw = await callGemini(buildBankPrompt(question), options);
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      verdict = normalizeVerdict(parsed.verdict, 'flag');
      reasons = normalizeStringList(parsed.reasons);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError && reasons.length === 0) {
    return {
      status: 'review',
      verdict: 'flag',
      reasons: [],
      note: `Verification failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    };
  }

  return {
    status: verdict === 'pass' ? 'verified' : 'review',
    verdict,
    reasons,
    note: verdict === 'pass' ? 'Verification passed.' : 'Verification flagged for review.',
  };
}

export type { AnswerKey };

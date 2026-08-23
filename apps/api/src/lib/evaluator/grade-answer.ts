import { getGeminiConfig, GeminiNotConfiguredError, GeminiApiError } from '../exam-papers/verify.js';

export type StepEvaluation = {
  stepIndex: number;
  pointDescription: string;
  allocatedMarks: number;
  marksEarned: number;
  feedback: string;
  matchedKeywords: string[];
  missingKeywords: string[];
};

export type DeductionItem = {
  reason: string;
  penaltyMarks: number;
};

export type EvaluateAnswerRequest = {
  questionId?: string;
  questionStem: string;
  maxMarks: number;
  studentAnswerText?: string;
  studentAnswerImageBase64?: string; // base64 string without data URL header or with
  imageMimeType?: string; // 'image/jpeg' | 'image/png' | 'image/webp'
  officialValuePoints: string[];
  modelAnswer?: string;
  subjectSlug?: string;
};

export type EvaluateAnswerResponse = {
  marksAwarded: number;
  maxMarks: number;
  percentageScore: number;
  stepEvaluations: StepEvaluation[];
  deductions: DeductionItem[];
  topperWritingTips: string[];
  overallFeedback: string;
  examinerSummary: string;
  isAiGrounded: boolean;
};

/**
 * Builds the strict CBSE Examiner prompt grounded in official marking scheme value points.
 */
export function buildEvaluationPrompt(input: EvaluateAnswerRequest): string {
  const valuePointsText = input.officialValuePoints.map((vp, i) => `${i + 1}. ${vp}`).join('\n');
  const modelAnswerText = input.modelAnswer ? `\nOFFICIAL MODEL ANSWER:\n${input.modelAnswer}` : '';

  return `You are a strict, fair, and encouraging senior CBSE Class 10 Board Examiner evaluating a student's answer.
You MUST grade strictly according to the Official CBSE Marking Scheme step marks and value points below.

QUESTION (${input.maxMarks} MARKS):
"${input.questionStem}"
${modelAnswerText}

OFFICIAL CBSE MARKING SCHEME VALUE POINTS:
${valuePointsText}

${input.studentAnswerText ? `STUDENT'S SUBMITTED ANSWER:\n"${input.studentAnswerText}"` : 'STUDENT SUBMITTED A HANDWRITTEN ANSWER (SEE ATTACHED IMAGE). Transcribe and grade it.'}

EVALUATION INSTRUCTIONS:
1. Examine the student's answer step-by-step against every official value point.
2. For each value point:
   - Determine how many marks the student earned (from 0 up to allocatedMarks).
   - Identify specific scientific / technical keywords the student included.
   - Identify critical keywords or conceptual steps the student missed.
   - Give 1 sentence of specific feedback explaining why marks were awarded or deducted.
3. Check for penalties: missing SI units, missing balanced chemical equation, missing diagram labels, or incorrect notation (0.5 mark deduction each).
4. Calculate total marksAwarded as sum of step marks minus deductions (clamped between 0 and ${input.maxMarks}).
5. Provide 2-3 actionable "Topper Writing Tips" showing how a 100/100 student structures this specific answer in the CBSE board exam.
6. Provide an encouraging 2-sentence overall feedback summary.

OUTPUT FORMAT: Return ONLY a valid JSON object matching this schema:
{
  "marksAwarded": number,
  "maxMarks": ${input.maxMarks},
  "stepEvaluations": [
    {
      "stepIndex": number,
      "pointDescription": string,
      "allocatedMarks": number,
      "marksEarned": number,
      "feedback": string,
      "matchedKeywords": string[],
      "missingKeywords": string[]
    }
  ],
  "deductions": [
    {
      "reason": string,
      "penaltyMarks": number
    }
  ],
  "topperWritingTips": string[],
  "overallFeedback": string,
  "examinerSummary": string
}`;
}

/**
 * Fallback heuristic evaluator when Gemini API key is not configured or in offline mode.
 */
export function evaluateAnswerHeuristically(input: EvaluateAnswerRequest): EvaluateAnswerResponse {
  const studentText = (input.studentAnswerText || '').toLowerCase();
  const stepEvals: StepEvaluation[] = [];
  let totalMarksAwarded = 0;

  for (let i = 0; i < input.officialValuePoints.length; i++) {
    const rawPoint = input.officialValuePoints[i];
    const weightMatch = rawPoint.match(/^\[\+([0-9.]+) Marks?\]\s*(.*)$/);
    const allocated = weightMatch ? parseFloat(weightMatch[1]) : input.maxMarks / input.officialValuePoints.length;
    const desc = weightMatch ? weightMatch[2] : rawPoint;

    // Extract significant keywords (length >= 3, excluding common stop words)
    const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were', 'which']);
    const words = desc
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    const matched = words.filter((w) => studentText.includes(w) || (w.length > 5 && studentText.includes(w.slice(0, -2))));
    const missing = words.filter((w) => !studentText.includes(w) && !(w.length > 5 && studentText.includes(w.slice(0, -2))));

    let ratio = words.length > 0 ? matched.length / words.length : 0.5;
    if (studentText.length < 15 || studentText.includes('do not know')) ratio = 0;

    let earned = 0;
    if (ratio >= 0.5) {
      earned = allocated;
    } else if (ratio >= 0.25) {
      earned = Math.max(0.5, Math.round((allocated * 0.5) * 2) / 2);
    }
    if (earned > allocated) earned = allocated;

    totalMarksAwarded += earned;

    stepEvals.push({
      stepIndex: i + 1,
      pointDescription: desc,
      allocatedMarks: allocated,
      marksEarned: earned,
      feedback: earned >= allocated
        ? 'Excellent point coverage with accurate technical terminology.'
        : earned > 0
        ? 'Partially addressed. Key keywords missing from the official marking key.'
        : 'Value point missing in submitted answer.',
      matchedKeywords: Array.from(new Set(matched)).slice(0, 4),
      missingKeywords: Array.from(new Set(missing)).slice(0, 4),
    });
  }

  const clampedMarks = Math.min(input.maxMarks, Math.max(0, totalMarksAwarded));

  return {
    marksAwarded: clampedMarks,
    maxMarks: input.maxMarks,
    percentageScore: Math.round((clampedMarks / input.maxMarks) * 100),
    stepEvaluations: stepEvals,
    deductions: [],
    topperWritingTips: [
      'Write points in numbered bullets matching the question marks (e.g. 3 points for 3 marks).',
      'Always underline or bold primary scientific terms (e.g. catalyst, amphoteric, focal length).',
      'Include balanced chemical equations or relevant formula symbols even if not explicitly asked.'
    ],
    overallFeedback: clampedMarks >= input.maxMarks * 0.8
      ? 'Outstanding response! Your answer closely mirrors the CBSE marking scheme value points.'
      : 'Good attempt. Review the missing value points and keywords above to secure full step marks.',
    examinerSummary: `Awarded ${clampedMarks}/${input.maxMarks} marks based on step-wise value point comparison.`,
    isAiGrounded: false
  };
}

/**
 * Grades a written answer using Gemini 2.5 Flash grounded against CBSE marking schemes.
 */
export async function gradeWrittenAnswer(
  input: EvaluateAnswerRequest,
  fetchImpl: typeof fetch = fetch
): Promise<EvaluateAnswerResponse> {
  const config = getGeminiConfig();

  if (!config.apiKey) {
    return evaluateAnswerHeuristically(input);
  }

  const prompt = buildEvaluationPrompt(input);
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    `${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
    { text: prompt }
  ];

  if (input.studentAnswerImageBase64) {
    const cleanBase64 = input.studentAnswerImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const mime = input.imageMimeType || 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType: mime,
        data: cleanBase64
      }
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API error (${response.status}): ${errText}. Falling back to heuristic evaluation.`);
      return evaluateAnswerHeuristically(input);
    }

    const json = await response.json() as any;
    const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
      return evaluateAnswerHeuristically(input);
    }

    const parsed = JSON.parse(textOutput);
    const marksAwarded = typeof parsed.marksAwarded === 'number'
      ? Math.min(input.maxMarks, Math.max(0, parsed.marksAwarded))
      : 0;

    return {
      marksAwarded,
      maxMarks: input.maxMarks,
      percentageScore: Math.round((marksAwarded / input.maxMarks) * 100),
      stepEvaluations: Array.isArray(parsed.stepEvaluations) ? parsed.stepEvaluations : [],
      deductions: Array.isArray(parsed.deductions) ? parsed.deductions : [],
      topperWritingTips: Array.isArray(parsed.topperWritingTips) ? parsed.topperWritingTips : [],
      overallFeedback: parsed.overallFeedback || 'Answer evaluated according to CBSE Board Marking Scheme.',
      examinerSummary: parsed.examinerSummary || `Score: ${marksAwarded} / ${input.maxMarks}`,
      isAiGrounded: true
    };
  } catch (err: any) {
    console.warn(`Evaluation call failed: ${err?.message}. Falling back to heuristic evaluation.`);
    return evaluateAnswerHeuristically(input);
  } finally {
    clearTimeout(timer);
  }
}

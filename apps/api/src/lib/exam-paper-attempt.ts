import type { Prisma } from '@prisma/client';

export type ExamPaperQuestionResult = {
  questionNumber: number;
  sectionId: string;
  questionType: string;
  chapterSlug: string;
  marks: number;
  earnedMarks: number;
  correct: boolean;
};

export type NormalizedExamPaperAttempt = {
  clientAttemptId: string;
  examPaperId: string;
  totalMarks: number;
  earnedMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
  writtenSelfMarked: boolean;
  questionResults: ExamPaperQuestionResult[];
};

export type NormalizeResult =
  | { data: NormalizedExamPaperAttempt; error: null }
  | { data: null; error: string };

const MAX_QUESTIONS = 80;
const MAX_SECTION_LENGTH = 40;

function readRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function readClientAttemptId(value: unknown): string | null {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{8,120}$/.test(value) ? value : null;
}

function readId(value: unknown): string | null {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{4,120}$/.test(value) ? value : null;
}

function readBoundedInteger(value: unknown, min: number, max: number): number | null {
  if (!Number.isInteger(value)) {
    return null;
  }
  const number = Number(value);
  return number >= min && number <= max ? number : null;
}

function readOptionalBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/**
 * Normalizes the client payload for an exam-paper attempt. Every field is
 * validated and bounded server-side; nothing from the client is trusted.
 */
export function normalizeExamPaperAttempt(value: unknown): NormalizeResult {
  const body = readRecord(value);
  if (!body) {
    return { data: null, error: 'Invalid exam-paper attempt payload.' };
  }

  const clientAttemptId = readClientAttemptId(body.clientAttemptId);
  const examPaperId = readId(body.examPaperId);
  const totalMarks = readBoundedInteger(body.totalMarks, 1, 500);
  const earnedMarks = readBoundedInteger(body.earnedMarks, 0, 500);
  const mcqCorrect = readBoundedInteger(body.mcqCorrect, 0, MAX_QUESTIONS);
  const mcqTotal = readBoundedInteger(body.mcqTotal, 0, MAX_QUESTIONS);
  const writtenSelfMarked = readOptionalBoolean(body.writtenSelfMarked, false);
  const rawResults = Array.isArray(body.questionResults) ? body.questionResults : [];

  if (
    !clientAttemptId ||
    !examPaperId ||
    totalMarks === null ||
    earnedMarks === null ||
    mcqCorrect === null ||
    mcqTotal === null
  ) {
    return {
      data: null,
      error: 'Exam-paper attempt fields are missing or outside their allowed limits.',
    };
  }

  if (earnedMarks > totalMarks) {
    return { data: null, error: 'earnedMarks cannot exceed totalMarks.' };
  }
  if (mcqCorrect > mcqTotal) {
    return { data: null, error: 'mcqCorrect cannot exceed mcqTotal.' };
  }
  if (rawResults.length > MAX_QUESTIONS) {
    return { data: null, error: `Attempt has too many questions (max ${MAX_QUESTIONS}).` };
  }

  const questionResults: ExamPaperQuestionResult[] = [];
  for (const item of rawResults) {
    const result = readRecord(item);
    if (!result) {
      return { data: null, error: 'A question result is not an object.' };
    }
    const questionNumber = readBoundedInteger(result.questionNumber, 1, MAX_QUESTIONS);
    const marks = readBoundedInteger(result.marks, 0, 10);
    const earned = readBoundedInteger(result.earnedMarks, 0, 10);
    const sectionId =
      typeof result.sectionId === 'string'
        ? result.sectionId.slice(0, MAX_SECTION_LENGTH)
        : '';
    const questionType =
      typeof result.questionType === 'string'
        ? result.questionType.slice(0, MAX_SECTION_LENGTH)
        : '';
    const chapterSlug =
      typeof result.chapterSlug === 'string'
        ? result.chapterSlug.slice(0, MAX_SECTION_LENGTH)
        : '';
    const correct = result.correct === true;

    if (questionNumber === null || marks === null || earned === null) {
      return { data: null, error: 'A question result has invalid numbers.' };
    }
    if (earned > marks) {
      return { data: null, error: 'A question earned more than its marks.' };
    }
    if (!sectionId || !questionType || !chapterSlug) {
      return { data: null, error: 'A question result is missing section/type/chapter.' };
    }

    questionResults.push({
      questionNumber,
      sectionId,
      questionType,
      chapterSlug,
      marks,
      earnedMarks: earned,
      correct,
    });
  }

  if (questionResults.length === 0) {
    return { data: null, error: 'An attempt needs at least one question result.' };
  }

  return {
    data: {
      clientAttemptId,
      examPaperId,
      totalMarks,
      earnedMarks,
      mcqCorrect,
      mcqTotal,
      writtenSelfMarked,
      questionResults,
    },
    error: null,
  };
}

export type WeakAreaSummary = {
  weakChapterSlugs: string[];
  weakQuestionTypes: string[];
};

/**
 * Computes the weak-area summary from the per-question results: any chapter or
 * question type where the student earned less than 50% of the marks attempted
 * is flagged as weak. Empty when every area is at or above 50%.
 */
export function computeWeakAreas(
  questionResults: ExamPaperQuestionResult[],
): WeakAreaSummary {
  const chapterMarks = new Map<string, { earned: number; possible: number }>();
  const typeMarks = new Map<string, { earned: number; possible: number }>();

  for (const result of questionResults) {
    const chapter = chapterMarks.get(result.chapterSlug) ?? { earned: 0, possible: 0 };
    chapter.earned += result.earnedMarks;
    chapter.possible += result.marks;
    chapterMarks.set(result.chapterSlug, chapter);

    const type = typeMarks.get(result.questionType) ?? { earned: 0, possible: 0 };
    type.earned += result.earnedMarks;
    type.possible += result.marks;
    typeMarks.set(result.questionType, type);
  }

  const weakChapterSlugs = Array.from(chapterMarks.entries())
    .filter(([, marks]) => marks.possible > 0 && marks.earned / marks.possible < 0.5)
    .map(([slug]) => slug)
    .sort();

  const weakQuestionTypes = Array.from(typeMarks.entries())
    .filter(([, marks]) => marks.possible > 0 && marks.earned / marks.possible < 0.5)
    .map(([type]) => type)
    .sort();

  return { weakChapterSlugs, weakQuestionTypes };
}

export function matchesExamPaperAttempt(
  stored: {
    earnedMarks: number;
    mcqCorrect: number;
    mcqTotal: number;
    totalMarks: number;
    writtenSelfMarked: boolean;
    questionResults: Prisma.JsonValue | null;
  },
  incoming: NormalizedExamPaperAttempt,
): boolean {
  if (
    stored.earnedMarks !== incoming.earnedMarks ||
    stored.mcqCorrect !== incoming.mcqCorrect ||
    stored.mcqTotal !== incoming.mcqTotal ||
    stored.totalMarks !== incoming.totalMarks ||
    stored.writtenSelfMarked !== incoming.writtenSelfMarked
  ) {
    return false;
  }

  // JSONB reorders object keys, so compare field-by-field rather than by
  // stringifying (which would report identical attempts as different).
  const storedResults = Array.isArray(stored.questionResults)
    ? (stored.questionResults as unknown as ExamPaperQuestionResult[])
    : [];
  if (storedResults.length !== incoming.questionResults.length) {
    return false;
  }

  const incomingByNumber = new Map(
    incoming.questionResults.map((result) => [result.questionNumber, result]),
  );

  for (const storedResult of storedResults) {
    const incomingResult = incomingByNumber.get(storedResult.questionNumber);
    if (!incomingResult) {
      return false;
    }
    if (
      storedResult.sectionId !== incomingResult.sectionId ||
      storedResult.questionType !== incomingResult.questionType ||
      storedResult.chapterSlug !== incomingResult.chapterSlug ||
      storedResult.marks !== incomingResult.marks ||
      storedResult.earnedMarks !== incomingResult.earnedMarks ||
      storedResult.correct !== incomingResult.correct
    ) {
      return false;
    }
  }

  return true;
}

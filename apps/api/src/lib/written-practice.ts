export type WrittenPracticeSkill = string;

export type NormalizedWrittenPracticeAttempt = {
  answerLength: number;
  chapterSlug: string;
  clientAttemptId: string;
  earnedRubricPointIds: string[];
  lessonSlug: string;
  maxScoreHalfMarks: number;
  practiceKind: 'timed_diagnostic' | 'written_practice' | 'workbench';
  practiceItemId: string;
  retentionEligible: boolean;
  scoreHalfMarks: number;
  weakSkillSlugs: WrittenPracticeSkill[];
};

export type StoredWrittenPracticeAttempt = {
  answerLength: number;
  chapterId: string;
  earnedRubricPointIds: string[];
  lessonSlug: string;
  maxScoreHalfMarks: number;
  practiceItemId: string;
  retentionEligible: boolean;
  scoreHalfMarks: number;
  weakSkillSlugs: string[];
};

type NormalizeResult =
  | { data: NormalizedWrittenPracticeAttempt; error: null }
  | { data: null; error: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readSlug(value: unknown, maxLength = 100) {
  if (typeof value !== 'string') {
    return null;
  }

  const slug = value.trim();
  if (!slug || slug.length > maxLength || !SLUG_PATTERN.test(slug)) {
    return null;
  }

  return slug;
}

function readClientAttemptId(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const id = value.trim();
  return id && id.length <= 80 && /^[a-zA-Z0-9-]+$/.test(id) ? id : null;
}

function readBoundedInteger(value: unknown, minimum: number, maximum: number) {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum
    ? number
    : null;
}

function readOptionalBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function readPracticeKind(value: unknown): NormalizedWrittenPracticeAttempt['practiceKind'] {
  return value === 'timed_diagnostic' || value === 'workbench'
    ? value
    : 'written_practice';
}

function readUniqueSlugs(value: unknown, maximumItems: number) {
  if (!Array.isArray(value)) {
    return null;
  }

  const slugs = value.map((item) => readSlug(item)).filter((item): item is string => Boolean(item));
  if (slugs.length !== value.length || slugs.length > maximumItems) {
    return null;
  }

  return Array.from(new Set(slugs));
}

export function normalizeWrittenPracticeAttempt(value: unknown): NormalizeResult {
  const body = readRecord(value);
  if (!body) {
    return { data: null, error: 'Invalid written-practice payload.' };
  }

  const chapterSlug = readSlug(body.chapterSlug);
  const clientAttemptId = readClientAttemptId(body.clientAttemptId);
  const lessonSlug = readSlug(body.lessonSlug);
  const practiceItemId = readSlug(body.practiceItemId);
  const practiceKind = readPracticeKind(body.practiceKind);
  const retentionEligible = readOptionalBoolean(body.retentionEligible, true);
  const scoreHalfMarks = readBoundedInteger(body.scoreHalfMarks, 0, 80);
  const maxScoreHalfMarks = readBoundedInteger(body.maxScoreHalfMarks, 1, 80);
  const answerLength = readBoundedInteger(body.answerLength, 0, 10000);
  const earnedRubricPointIds = readUniqueSlugs(body.earnedRubricPointIds, 80);
  const weakSkillSlugs = readUniqueSlugs(body.weakSkillSlugs, 20);

  if (
    !chapterSlug ||
    !clientAttemptId ||
    !lessonSlug ||
    !practiceItemId ||
    scoreHalfMarks === null ||
    maxScoreHalfMarks === null ||
    answerLength === null ||
    !earnedRubricPointIds ||
    !weakSkillSlugs
  ) {
    return {
      data: null,
      error: 'Written-practice fields are missing or outside their allowed limits.',
    };
  }

  if (scoreHalfMarks > maxScoreHalfMarks) {
    return { data: null, error: 'scoreHalfMarks cannot exceed maxScoreHalfMarks.' };
  }

  return {
    data: {
      answerLength,
      chapterSlug,
      clientAttemptId,
      earnedRubricPointIds,
      lessonSlug,
      maxScoreHalfMarks,
      practiceKind,
      practiceItemId,
      retentionEligible,
      scoreHalfMarks,
      weakSkillSlugs,
    },
    error: null,
  };
}

function sameStringSet(left: string[], right: string[]) {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return (
    sortedLeft.length === sortedRight.length &&
    sortedLeft.every((value, index) => value === sortedRight[index])
  );
}

export function matchesWrittenPracticeAttempt(
  stored: StoredWrittenPracticeAttempt,
  incoming: NormalizedWrittenPracticeAttempt,
  chapterId: string,
) {
  return (
    stored.answerLength === incoming.answerLength &&
    stored.chapterId === chapterId &&
    stored.lessonSlug === incoming.lessonSlug &&
    stored.maxScoreHalfMarks === incoming.maxScoreHalfMarks &&
    stored.practiceItemId === incoming.practiceItemId &&
    stored.retentionEligible === incoming.retentionEligible &&
    stored.scoreHalfMarks === incoming.scoreHalfMarks &&
    sameStringSet(
      stored.earnedRubricPointIds,
      incoming.earnedRubricPointIds,
    ) &&
    sameStringSet(stored.weakSkillSlugs, incoming.weakSkillSlugs)
  );
}

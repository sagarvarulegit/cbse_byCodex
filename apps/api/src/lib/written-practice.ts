import type { MissedRubricPoint } from './mistake-review.js';

export type WrittenPracticeSkill = string;

export type NormalizedWrittenPracticeAttempt = {
  answerLength: number;
  chapterSlug: string;
  clientAttemptId: string;
  earnedRubricPointIds: string[];
  hintPrompt: string | null;
  lessonSlug: string;
  maxScoreHalfMarks: number;
  missedRubricPoints: MissedRubricPoint[];
  practiceKind: 'timed_diagnostic' | 'written_practice' | 'workbench';
  practiceItemId: string;
  practicePrompt: string | null;
  practiceTitle: string;
  retentionEligible: boolean;
  scoreHalfMarks: number;
  usedHints: boolean;
  weakSkillSlugs: WrittenPracticeSkill[];
};

export type StoredWrittenPracticeAttempt = {
  answerLength: number;
  chapterId: string;
  earnedRubricPointIds: string[];
  lessonSlug: string;
  maxScoreHalfMarks: number;
  missedRubricPointIds: string[];
  practiceKind: string;
  practiceItemId: string;
  retentionEligible: boolean;
  scoreHalfMarks: number;
  usedHints: boolean;
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

function readOptionalText(value: unknown, maxLength: number) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text ? text.slice(0, maxLength) : null;
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

function readMissedRubricPoints(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.length > 80) {
    return null;
  }

  const points: MissedRubricPoint[] = [];
  const ids = new Set<string>();
  for (const valueItem of value) {
    const item = readRecord(valueItem);
    const id = readSlug(item?.id);
    const label = readOptionalText(item?.label, 300);
    const skillSlug = readSlug(item?.skillSlug);
    if (!item || !id || !label || !skillSlug || ids.has(id)) {
      return null;
    }
    ids.add(id);
    points.push({ id, label, skillSlug });
  }

  return points;
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
  const usedHints = readOptionalBoolean(body.usedHints, false);
  const retentionEligible =
    readOptionalBoolean(body.retentionEligible, true) && !usedHints;
  const scoreHalfMarks = readBoundedInteger(body.scoreHalfMarks, 0, 80);
  const maxScoreHalfMarks = readBoundedInteger(body.maxScoreHalfMarks, 1, 80);
  const answerLength = readBoundedInteger(body.answerLength, 0, 10000);
  const earnedRubricPointIds = readUniqueSlugs(body.earnedRubricPointIds, 80);
  const hintPrompt = readOptionalText(body.hintPrompt, 2000);
  const missedRubricPoints = readMissedRubricPoints(body.missedRubricPoints);
  const weakSkillSlugs = readUniqueSlugs(body.weakSkillSlugs, 20);
  const practiceTitle = readOptionalText(body.practiceTitle, 240) ?? practiceItemId;
  const practicePrompt = readOptionalText(body.practicePrompt, 2000);

  if (
    !chapterSlug ||
    !clientAttemptId ||
    !lessonSlug ||
    !practiceItemId ||
    scoreHalfMarks === null ||
    maxScoreHalfMarks === null ||
    answerLength === null ||
    !earnedRubricPointIds ||
    !missedRubricPoints ||
    !practiceTitle ||
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
      hintPrompt,
      lessonSlug,
      maxScoreHalfMarks,
      missedRubricPoints,
      practiceKind,
      practiceItemId,
      practicePrompt,
      practiceTitle,
      retentionEligible,
      scoreHalfMarks,
      usedHints,
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
    stored.practiceKind === incoming.practiceKind &&
    sameStringSet(
      stored.missedRubricPointIds,
      incoming.missedRubricPoints.map((point) => point.id),
    ) &&
    stored.practiceItemId === incoming.practiceItemId &&
    stored.retentionEligible === incoming.retentionEligible &&
    stored.scoreHalfMarks === incoming.scoreHalfMarks &&
    stored.usedHints === incoming.usedHints &&
    sameStringSet(
      stored.earnedRubricPointIds,
      incoming.earnedRubricPointIds,
    ) &&
    sameStringSet(stored.weakSkillSlugs, incoming.weakSkillSlugs)
  );
}

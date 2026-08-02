import { Prisma, PrismaClient } from '@prisma/client';

import { prisma } from './prisma.js';

const INDIA_TIME_ZONE_OFFSET_MINUTES = 330;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export type PersonalBadgeCode =
  | 'first_lesson_completed'
  | 'first_quiz'
  | 'three_day_streak'
  | 'first_written_practice'
  | 'comeback_after_weak_score';

export type PersonalBadgeCandidate = {
  code: PersonalBadgeCode;
  description: string;
  iconName: string;
  name: string;
  scope: 'global' | 'chapter';
  source: 'lesson_complete' | 'quiz_attempt' | 'study_streak' | 'written_practice';
};

export type DailyPracticeStreakInput = {
  currentStreakDays: number;
  lastActivityDate: Date | null;
  longestStreakDays: number;
  occurredAt: Date;
};

export type DailyPracticeStreakResult = {
  activityDate: Date;
  currentStreakDays: number;
  isNewPracticeDay: boolean;
  longestStreakDays: number;
};

export type AwardedBadgeSummary = {
  code: PersonalBadgeCode;
  description: string;
  name: string;
};

export const PERSONAL_BADGE_DEFINITIONS: Record<PersonalBadgeCode, PersonalBadgeCandidate> = {
  comeback_after_weak_score: {
    code: 'comeback_after_weak_score',
    description: 'Raised a quiz score back above the revision threshold after a weak attempt.',
    iconName: 'rotate-ccw',
    name: 'Comeback Star',
    scope: 'chapter',
    source: 'quiz_attempt',
  },
  first_lesson_completed: {
    code: 'first_lesson_completed',
    description: 'Marked the first lesson as studied.',
    iconName: 'book-open-check',
    name: 'First Lesson Studied',
    scope: 'global',
    source: 'lesson_complete',
  },
  first_quiz: {
    code: 'first_quiz',
    description: 'Saved the first chapter quiz score.',
    iconName: 'badge-check',
    name: 'First Quiz',
    scope: 'global',
    source: 'quiz_attempt',
  },
  first_written_practice: {
    code: 'first_written_practice',
    description: 'Saved the first written-practice self-check.',
    iconName: 'pencil-line',
    name: 'First Written Practice',
    scope: 'global',
    source: 'written_practice',
  },
  three_day_streak: {
    code: 'three_day_streak',
    description: 'Practised on three India-calendar days in a row.',
    iconName: 'flame',
    name: 'Three-Day Streak',
    scope: 'global',
    source: 'study_streak',
  },
};
export const PERSONAL_BADGE_CODES = Object.keys(PERSONAL_BADGE_DEFINITIONS) as PersonalBadgeCode[];

function getActivityDateKey(date: Date) {
  const shiftedDate = new Date(date.getTime() + INDIA_TIME_ZONE_OFFSET_MINUTES * 60 * 1000);
  return shiftedDate.toISOString().slice(0, 10);
}

function activityDateKeyToUtcDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function getDateKeyDistanceInDays(previousDateKey: string, currentDateKey: string) {
  return Math.round(
    (activityDateKeyToUtcDate(currentDateKey).getTime() - activityDateKeyToUtcDate(previousDateKey).getTime()) /
      DAY_IN_MILLISECONDS,
  );
}

export function calculateDailyPracticeStreak(input: DailyPracticeStreakInput): DailyPracticeStreakResult {
  const currentDateKey = getActivityDateKey(input.occurredAt);
  const previousDateKey = input.lastActivityDate ? getActivityDateKey(input.lastActivityDate) : null;
  const activityDate = activityDateKeyToUtcDate(currentDateKey);

  if (!previousDateKey) {
    return {
      activityDate,
      currentStreakDays: 1,
      isNewPracticeDay: true,
      longestStreakDays: Math.max(input.longestStreakDays, 1),
    };
  }

  const distanceInDays = getDateKeyDistanceInDays(previousDateKey, currentDateKey);
  if (distanceInDays === 0) {
    return {
      activityDate,
      currentStreakDays: input.currentStreakDays,
      isNewPracticeDay: false,
      longestStreakDays: input.longestStreakDays,
    };
  }

  const currentStreakDays = distanceInDays === 1 ? input.currentStreakDays + 1 : 1;

  return {
    activityDate,
    currentStreakDays,
    isNewPracticeDay: true,
    longestStreakDays: Math.max(input.longestStreakDays, currentStreakDays),
  };
}

export function getQuizBadgeCandidates(params: {
  attemptNumber: number;
  previousScores: number[];
  scorePercent: number;
}): PersonalBadgeCandidate[] {
  const candidates: PersonalBadgeCandidate[] = [];

  if (params.attemptNumber === 1) {
    candidates.push(PERSONAL_BADGE_DEFINITIONS.first_quiz);
  }

  if (params.scorePercent >= 60 && params.previousScores.some((score) => score < 60)) {
    candidates.push(PERSONAL_BADGE_DEFINITIONS.comeback_after_weak_score);
  }

  return candidates;
}

export function getEngagementBadgeCandidates(params: {
  eventType: string;
}): PersonalBadgeCandidate[] {
  return params.eventType === 'lesson_complete'
    ? [PERSONAL_BADGE_DEFINITIONS.first_lesson_completed]
    : [];
}

export function getPracticeBadgeCandidates(params: {
  practiceKind?: string | null;
}): PersonalBadgeCandidate[] {
  return params.practiceKind === 'written_practice'
    ? [PERSONAL_BADGE_DEFINITIONS.first_written_practice]
    : [];
}

export function getStreakBadgeCandidates(params: {
  currentStreakDays: number;
}): PersonalBadgeCandidate[] {
  return params.currentStreakDays >= 3
    ? [PERSONAL_BADGE_DEFINITIONS.three_day_streak]
    : [];
}

export async function refreshDailyPracticeStreak(params: {
  db?: PrismaExecutor;
  occurredAt: Date;
  userId: string;
}) {
  const db = params.db ?? prisma;
  const existingStreak = await db.studyStreak.findUnique({
    where: { userId: params.userId },
  });

  const streak = calculateDailyPracticeStreak({
    currentStreakDays: existingStreak?.currentStreakDays ?? 0,
    lastActivityDate: existingStreak?.lastActivityDate ?? null,
    longestStreakDays: existingStreak?.longestStreakDays ?? 0,
    occurredAt: params.occurredAt,
  });

  return db.studyStreak.upsert({
    where: { userId: params.userId },
    create: {
      currentStreakDays: streak.currentStreakDays,
      lastActivityDate: streak.activityDate,
      longestStreakDays: streak.longestStreakDays,
      userId: params.userId,
    },
    update: {
      currentStreakDays: streak.currentStreakDays,
      lastActivityDate: streak.activityDate,
      longestStreakDays: streak.longestStreakDays,
    },
  });
}

export async function awardPersonalBadges(params: {
  candidates: PersonalBadgeCandidate[];
  chapterId?: string | null;
  db?: PrismaExecutor;
  userId: string;
}) {
  const db = params.db ?? prisma;
  const awardedBadges: AwardedBadgeSummary[] = [];

  for (const candidate of params.candidates) {
    const badge = await db.badge.upsert({
      where: { code: candidate.code },
      create: {
        code: candidate.code,
        criteria: {
          source: candidate.source,
        } satisfies Prisma.InputJsonValue,
        description: candidate.description,
        iconName: candidate.iconName,
        name: candidate.name,
      },
      update: {
        criteria: {
          source: candidate.source,
        } satisfies Prisma.InputJsonValue,
        description: candidate.description,
        iconName: candidate.iconName,
        isActive: true,
        name: candidate.name,
      },
    });
    const scopeKey = candidate.scope === 'chapter' && params.chapterId ? params.chapterId : 'global';

    const existingAward = await db.userBadge.findUnique({
      where: {
        userId_badgeId_scopeKey: {
          badgeId: badge.id,
          scopeKey,
          userId: params.userId,
        },
      },
    });

    if (existingAward) {
      continue;
    }

    await db.userBadge.create({
      data: {
        badgeId: badge.id,
        chapterId: candidate.scope === 'chapter' ? params.chapterId ?? null : null,
        scopeKey,
        userId: params.userId,
      },
    });
    awardedBadges.push({
      code: candidate.code,
      description: candidate.description,
      name: candidate.name,
    });
  }

  return awardedBadges;
}

export async function awardEngagementBadges(params: {
  chapterId?: string | null;
  currentStreakDays: number;
  db?: PrismaExecutor;
  eventType: string;
  userId: string;
}) {
  return awardPersonalBadges({
    candidates: [
      ...getEngagementBadgeCandidates({ eventType: params.eventType }),
      ...getStreakBadgeCandidates({ currentStreakDays: params.currentStreakDays }),
    ],
    chapterId: params.chapterId,
    db: params.db,
    userId: params.userId,
  });
}

export async function awardPracticeBadges(params: {
  chapterId?: string | null;
  currentStreakDays: number;
  db?: PrismaExecutor;
  practiceKind?: string | null;
  userId: string;
}) {
  return awardPersonalBadges({
    candidates: [
      ...getPracticeBadgeCandidates({ practiceKind: params.practiceKind }),
      ...getStreakBadgeCandidates({ currentStreakDays: params.currentStreakDays }),
    ],
    chapterId: params.chapterId,
    db: params.db,
    userId: params.userId,
  });
}

export async function awardQuizBadges(params: {
  attemptNumber: number;
  chapterId: string;
  currentStreakDays: number;
  db?: PrismaExecutor;
  scorePercent: number;
  userId: string;
}) {
  const db = params.db ?? prisma;
  const previousAttempts = await db.quizAttempt.findMany({
    where: {
      attemptNumber: { lt: params.attemptNumber },
      chapterId: params.chapterId,
      userId: params.userId,
    },
    select: { scorePercent: true },
  });

  return awardPersonalBadges({
    candidates: [
      ...getQuizBadgeCandidates({
        attemptNumber: params.attemptNumber,
        previousScores: previousAttempts.map((attempt) => attempt.scorePercent),
        scorePercent: params.scorePercent,
      }),
      ...getStreakBadgeCandidates({ currentStreakDays: params.currentStreakDays }),
    ],
    chapterId: params.chapterId,
    db,
    userId: params.userId,
  });
}

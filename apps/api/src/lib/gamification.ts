import { Prisma, PrismaClient } from '@prisma/client';

import { prisma } from './prisma.js';

const INDIA_TIME_ZONE_OFFSET_MINUTES = 330;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export type QuizBadgeCode = 'first_quiz' | 'score_improvement' | 'topic_mastery' | 'comeback_after_weak_score';

export type QuizBadgeCandidate = {
  code: QuizBadgeCode;
  description: string;
  iconName: string;
  name: string;
  scope: 'global' | 'chapter';
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
  code: QuizBadgeCode;
  description: string;
  name: string;
};

export const QUIZ_BADGE_DEFINITIONS: Record<QuizBadgeCode, QuizBadgeCandidate> = {
  comeback_after_weak_score: {
    code: 'comeback_after_weak_score',
    description: 'Raised a quiz score back above the revision threshold after a weak attempt.',
    iconName: 'rotate-ccw',
    name: 'Comeback Star',
    scope: 'chapter',
  },
  first_quiz: {
    code: 'first_quiz',
    description: 'Saved the first chapter quiz score.',
    iconName: 'badge-check',
    name: 'First Quiz',
    scope: 'global',
  },
  score_improvement: {
    code: 'score_improvement',
    description: 'Improved on the previous best score for this chapter.',
    iconName: 'trending-up',
    name: 'Score Climber',
    scope: 'chapter',
  },
  topic_mastery: {
    code: 'topic_mastery',
    description: 'Scored at least 80% without weak topics in this chapter quiz.',
    iconName: 'target',
    name: 'Topic Mastery',
    scope: 'chapter',
  },
};

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
  weakTopicSlugs: string[];
}): QuizBadgeCandidate[] {
  const candidates: QuizBadgeCandidate[] = [];
  const previousBestScore = params.previousScores.length > 0 ? Math.max(...params.previousScores) : null;

  if (params.attemptNumber === 1) {
    candidates.push(QUIZ_BADGE_DEFINITIONS.first_quiz);
  }

  if (previousBestScore !== null && params.scorePercent > previousBestScore) {
    candidates.push(QUIZ_BADGE_DEFINITIONS.score_improvement);
  }

  if (params.scorePercent >= 80 && params.weakTopicSlugs.length === 0) {
    candidates.push(QUIZ_BADGE_DEFINITIONS.topic_mastery);
  }

  if (params.scorePercent >= 60 && params.previousScores.some((score) => score < 60)) {
    candidates.push(QUIZ_BADGE_DEFINITIONS.comeback_after_weak_score);
  }

  return candidates;
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

export async function awardQuizBadges(params: {
  attemptNumber: number;
  chapterId: string;
  db?: PrismaExecutor;
  scorePercent: number;
  userId: string;
  weakTopicSlugs: string[];
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

  const candidates = getQuizBadgeCandidates({
    attemptNumber: params.attemptNumber,
    previousScores: previousAttempts.map((attempt) => attempt.scorePercent),
    scorePercent: params.scorePercent,
    weakTopicSlugs: params.weakTopicSlugs,
  });
  const awardedBadges: AwardedBadgeSummary[] = [];

  for (const candidate of candidates) {
    const badge = await db.badge.upsert({
      where: { code: candidate.code },
      create: {
        code: candidate.code,
        criteria: {
          source: 'quiz_attempt',
        } satisfies Prisma.InputJsonValue,
        description: candidate.description,
        iconName: candidate.iconName,
        name: candidate.name,
      },
      update: {
        description: candidate.description,
        iconName: candidate.iconName,
        isActive: true,
        name: candidate.name,
      },
    });
    const scopeKey = candidate.scope === 'chapter' ? params.chapterId : 'global';

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
        chapterId: candidate.scope === 'chapter' ? params.chapterId : null,
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

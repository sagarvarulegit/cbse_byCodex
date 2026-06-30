import { Prisma, PrismaClient } from '@prisma/client';

import { calculateChapterMastery, getMasteryLevel } from './mastery.js';
import { prisma } from './prisma.js';

const REVISION_THRESHOLD_PERCENT = 60;

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export function shouldCreateRevisionMission(scorePercent: number) {
  return scorePercent < REVISION_THRESHOLD_PERCENT;
}

export function buildRevisionMissionSteps(weakTopicSlugs: string[]) {
  const firstStep = weakTopicSlugs[0]
    ? `Rewatch the lesson section for ${weakTopicSlugs[0]}.`
    : 'Rewatch the most recent lesson video for this chapter.';

  return [
    firstStep,
    'Revise quick notes, formulas, and common mistakes for the weak area.',
    'Retry a focused 5-question practice set and aim for at least 60%.',
  ];
}

export function isRevisionMissionSatisfied(
  mission: {
    chapterId: string;
    targetScore: number;
  },
  masteries: Array<{
    bestQuizScorePercent: number;
    chapterId: string;
  }>,
) {
  const matchingMastery = masteries.find((mastery) => mastery.chapterId === mission.chapterId);

  return (matchingMastery?.bestQuizScorePercent ?? 0) >= mission.targetScore;
}

export async function completeSatisfiedRevisionMissions<TMission extends { chapterId: string; id: string; targetScore: number }>(params: {
  completedAt?: Date;
  db?: PrismaExecutor;
  masteries: Array<{
    bestQuizScorePercent: number;
    chapterId: string;
  }>;
  missions: TMission[];
}) {
  const db = params.db ?? prisma;
  const completedAt = params.completedAt ?? new Date();
  const visibleMissions: TMission[] = [];

  for (const mission of params.missions) {
    if (!isRevisionMissionSatisfied(mission, params.masteries)) {
      visibleMissions.push(mission);
      continue;
    }

    await db.revisionMission.update({
      where: { id: mission.id },
      data: {
        completedAt,
        status: 'completed',
      },
    });
  }

  return visibleMissions;
}

function readPercentComplete(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return 0;
  }

  const percentComplete = Number((metadata as { percentComplete?: unknown }).percentComplete);
  if (!Number.isFinite(percentComplete)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(percentComplete)));
}

function getLatestDate(dates: Array<Date | null | undefined>) {
  const validDates = dates.filter((date): date is Date => Boolean(date));
  if (validDates.length === 0) {
    return null;
  }

  return new Date(Math.max(...validDates.map((date) => date.getTime())));
}

async function findActiveRevisionMission(
  db: PrismaExecutor,
  params: {
    chapterId: string;
    userId: string;
  },
) {
  return db.revisionMission.findFirst({
    where: {
      chapterId: params.chapterId,
      status: 'active',
      userId: params.userId,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

function isUniqueConflictError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return true;
  }

  if (!error || typeof error !== 'object') {
    return false;
  }

  const { code, message } = error as { code?: unknown; message?: unknown };
  if (code === 'P2002') {
    return true;
  }

  if (typeof message !== 'string') {
    return false;
  }

  return (
    message.includes('RevisionMission_userId_chapterId_active_key') ||
    message.includes('duplicate key value violates unique constraint')
  );
}

export async function refreshChapterMastery(params: {
  chapterId: string;
  db?: PrismaExecutor;
  userId: string;
}) {
  const db = params.db ?? prisma;

  const [videoEvents, bestQuizAttempt, latestQuizAttempt, latestProgressEvent] = await Promise.all([
    db.progressEvent.findMany({
      where: {
        chapterId: params.chapterId,
        eventType: { in: ['video_checkpoint', 'video_progress'] },
        userId: params.userId,
      },
      select: { metadata: true },
    }),
    db.quizAttempt.findFirst({
      where: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
      orderBy: [{ scorePercent: 'desc' }, { createdAt: 'desc' }],
      select: { scorePercent: true },
    }),
    db.quizAttempt.findFirst({
      where: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    db.progressEvent.findFirst({
      where: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
      orderBy: { occurredAt: 'desc' },
      select: { occurredAt: true },
    }),
  ]);

  const videoCompletionPercent = videoEvents.reduce(
    (maxPercent, event) => Math.max(maxPercent, readPercentComplete(event.metadata)),
    0,
  );
  const bestQuizScorePercent = bestQuizAttempt?.scorePercent ?? 0;
  const masteryScore = calculateChapterMastery({ bestQuizScorePercent, videoCompletionPercent });
  const level = getMasteryLevel(masteryScore);
  const lastActivityAt = getLatestDate([latestProgressEvent?.occurredAt, latestQuizAttempt?.createdAt]);

  return db.chapterMastery.upsert({
    where: {
      userId_chapterId: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
    },
    create: {
      bestQuizScorePercent,
      chapterId: params.chapterId,
      lastActivityAt,
      level,
      masteryScore,
      userId: params.userId,
      videoCompletionPercent,
    },
    update: {
      bestQuizScorePercent,
      lastActivityAt,
      level,
      masteryScore,
      videoCompletionPercent,
    },
  });
}

export async function createOrRefreshRevisionMission(params: {
  chapterId: string;
  db?: PrismaExecutor;
  scorePercent: number;
  topicId?: string | null;
  userId: string;
  weakTopicSlugs: string[];
}) {
  const db = params.db ?? prisma;

  if (!shouldCreateRevisionMission(params.scorePercent)) {
    const existingMission = await findActiveRevisionMission(db, params);
    if (existingMission) {
      const completedMission = await db.revisionMission.update({
        where: { id: existingMission.id },
        data: {
          completedAt: new Date(),
          status: 'completed',
        },
      });

      return {
        mission: completedMission,
        state: 'completed' as const,
      };
    }

    return {
      mission: null,
      state: 'not_needed' as const,
    };
  }

  const existingMission = await findActiveRevisionMission(db, params);

  const data = {
    reason: `Quiz score ${params.scorePercent}% is below the 60% revision threshold.`,
    recommendedSteps: buildRevisionMissionSteps(params.weakTopicSlugs),
    targetScore: REVISION_THRESHOLD_PERCENT,
    topicId: params.topicId ?? null,
  };

  if (existingMission) {
    const mission = await db.revisionMission.update({
      where: { id: existingMission.id },
      data,
    });

    return {
      mission,
      state: 'refreshed' as const,
    };
  }

  try {
    const mission = await db.revisionMission.create({
      data: {
        ...data,
        chapterId: params.chapterId,
        userId: params.userId,
      },
    });

    return {
      mission,
      state: 'created' as const,
    };
  } catch (error) {
    if (!isUniqueConflictError(error)) {
      throw error;
    }

    const activeMission = await findActiveRevisionMission(db, params);
    if (!activeMission) {
      throw error;
    }

    const mission = await db.revisionMission.update({
      where: { id: activeMission.id },
      data,
    });

    return {
      mission,
      state: 'refreshed' as const,
    };
  }
}

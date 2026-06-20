import { Prisma } from '@prisma/client';
import { Router } from 'express';

import { awardQuizBadges, refreshDailyPracticeStreak } from '../lib/gamification.js';
import {
  createOrRefreshRevisionMission,
  isRevisionMissionSatisfied,
  refreshChapterMastery,
} from '../lib/mastery-aggregation.js';
import { prisma } from '../lib/prisma.js';
import { summarizeQuizAttempts } from '../lib/quiz-attempts.js';
import { requireSessionUser } from '../lib/session.js';

const MAX_QUIZ_TRANSACTION_ATTEMPTS = 3;

function normalizePercentComplete(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function normalizeScorePercent(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function normalizePositiveInteger(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return null;
  }

  return numericValue;
}

function normalizeWeakTopicSlugs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, 8);
}

function normalizeRecommendedSteps(value: Prisma.JsonValue) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isRetryableQuizTransactionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2034' || error.code === 'P2002';
  }

  return false;
}

export const progressRouter = Router();

progressRouter.post('/video', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save video progress.' });
    }

    const lessonId = typeof req.body?.lessonId === 'string' ? req.body.lessonId : null;
    const videoId = typeof req.body?.videoId === 'string' ? req.body.videoId : null;
    const positionSeconds = Number(req.body?.positionSeconds ?? 0);
    const durationSeconds = Number(req.body?.durationSeconds ?? 0);
    const percentComplete = normalizePercentComplete(req.body?.percentComplete);

    if (!lessonId || !videoId || percentComplete === null) {
      return res.status(400).json({ message: 'lessonId, videoId, and percentComplete are required.' });
    }

    if (!Number.isFinite(positionSeconds) || positionSeconds < 0) {
      return res.status(400).json({ message: 'positionSeconds must be a positive number.' });
    }

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        lessonId,
      },
      include: {
        lesson: {
          include: {
            topic: {
              include: {
                chapter: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ message: 'Video was not found.' });
    }

    await prisma.progressEvent.create({
      data: {
        chapterId: video.lesson.topic.chapter.id,
        eventType: percentComplete >= 30 ? 'video_checkpoint' : 'video_progress',
        lessonId,
        metadata: {
          durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
          percentComplete,
          positionSeconds: Math.round(positionSeconds),
          videoId,
        } satisfies Prisma.InputJsonValue,
        occurredAt: new Date(),
        topicId: video.lesson.topicId,
        userId: user.id,
      },
    });

    return res.status(202).json({ saved: true });
  } catch (error) {
    console.error('Failed to save video progress', error);
    return res.status(500).json({ message: 'Unable to save video progress right now.' });
  }
});

progressRouter.post('/quiz', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save quiz progress.' });
    }

    const chapterSlug = typeof req.body?.chapterSlug === 'string' ? req.body.chapterSlug.trim() : null;
    const topicSlug = typeof req.body?.topicSlug === 'string' ? req.body.topicSlug.trim() : null;
    const scorePercent = normalizeScorePercent(req.body?.scorePercent);
    const totalQuestions = normalizePositiveInteger(req.body?.totalQuestions);
    const correctAnswers = normalizePositiveInteger(req.body?.correctAnswers);
    const weakTopicSlugs = normalizeWeakTopicSlugs(req.body?.weakTopicSlugs);

    if (!chapterSlug || scorePercent === null || totalQuestions === null || correctAnswers === null) {
      return res
        .status(400)
        .json({ message: 'chapterSlug, scorePercent, totalQuestions, and correctAnswers are required.' });
    }

    if (totalQuestions <= 0 || correctAnswers > totalQuestions) {
      return res.status(400).json({ message: 'Quiz answers must fit within the total question count.' });
    }

    const derivedScorePercent = Math.round((correctAnswers / totalQuestions) * 100);

    const chapter = await prisma.chapter.findFirst({
      where: {
        isPublished: true,
        slug: chapterSlug,
      },
      include: {
        topics: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }

    const chapterTopicSlugs = new Set(chapter.topics.map((chapterTopic) => chapterTopic.slug));
    const topic = topicSlug ? chapter.topics.find((chapterTopic) => chapterTopic.slug === topicSlug) : null;
    if (topicSlug && !topic) {
      return res.status(400).json({ message: 'topicSlug must belong to the selected chapter.' });
    }

    if (weakTopicSlugs.some((weakTopicSlug) => !chapterTopicSlugs.has(weakTopicSlug))) {
      return res.status(400).json({ message: 'weakTopicSlugs must belong to the selected chapter.' });
    }

    let result;
    for (let attemptIndex = 0; attemptIndex < MAX_QUIZ_TRANSACTION_ATTEMPTS; attemptIndex += 1) {
      try {
        result = await prisma.$transaction(
          async (tx) => {
            const previousAttempts = await tx.quizAttempt.count({
              where: {
                chapterId: chapter.id,
                userId: user.id,
              },
            });

            const attempt = await tx.quizAttempt.create({
              data: {
                attemptNumber: previousAttempts + 1,
                chapterId: chapter.id,
                correctAnswers,
                scorePercent: derivedScorePercent,
                topicId: topic?.id ?? null,
                totalQuestions,
                userId: user.id,
                weakTopicSlugs,
              },
            });

            await tx.progressEvent.create({
              data: {
                chapterId: chapter.id,
                eventType: 'quiz_attempt',
                metadata: {
                  attemptId: attempt.id,
                  correctAnswers,
                  scorePercent: derivedScorePercent,
                  totalQuestions,
                  weakTopicSlugs,
                } satisfies Prisma.InputJsonValue,
                occurredAt: attempt.createdAt,
                quizId: attempt.quizId,
                topicId: topic?.id ?? null,
                userId: user.id,
              },
            });

            const mission = await createOrRefreshRevisionMission({
              chapterId: chapter.id,
              db: tx,
              scorePercent: derivedScorePercent,
              topicId: topic?.id ?? null,
              userId: user.id,
              weakTopicSlugs,
            });
            const mastery = await refreshChapterMastery({
              chapterId: chapter.id,
              db: tx,
              userId: user.id,
            });
            const studyStreak = await refreshDailyPracticeStreak({
              db: tx,
              occurredAt: attempt.createdAt,
              userId: user.id,
            });
            const awardedBadges = await awardQuizBadges({
              attemptNumber: attempt.attemptNumber,
              chapterId: chapter.id,
              db: tx,
              scorePercent: derivedScorePercent,
              userId: user.id,
              weakTopicSlugs,
            });

            return { attempt, awardedBadges, mastery, mission, studyStreak };
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (error) {
        if (attemptIndex === MAX_QUIZ_TRANSACTION_ATTEMPTS - 1 || !isRetryableQuizTransactionError(error)) {
          throw error;
        }
      }
    }

    if (!result) {
      throw new Error('Quiz transaction did not complete.');
    }

    return res.status(201).json({
      attempt: {
        attemptNumber: result.attempt.attemptNumber,
        correctAnswers: result.attempt.correctAnswers,
        createdAt: result.attempt.createdAt.toISOString(),
        scorePercent: result.attempt.scorePercent,
        totalQuestions: result.attempt.totalQuestions,
        weakTopicSlugs: result.attempt.weakTopicSlugs,
      },
      mastery: {
        bestQuizScorePercent: result.mastery.bestQuizScorePercent,
        level: result.mastery.level,
        masteryScore: result.mastery.masteryScore,
        videoCompletionPercent: result.mastery.videoCompletionPercent,
      },
      gamification: {
        awardedBadges: result.awardedBadges,
        streak: {
          currentStreakDays: result.studyStreak.currentStreakDays,
          longestStreakDays: result.studyStreak.longestStreakDays,
        },
      },
      revisionMission: result.mission
        ? {
            id: result.mission.id,
            reason: result.mission.reason,
            recommendedSteps: normalizeRecommendedSteps(result.mission.recommendedSteps),
            status: result.mission.status,
            targetScore: result.mission.targetScore,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to save quiz progress', error);
    return res.status(500).json({ message: 'Unable to save quiz progress right now.' });
  }
});

progressRouter.get('/quiz-attempts', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view quiz attempts.' });
    }

    const chapterSlug = typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug.trim() : null;
    if (!chapterSlug) {
      return res.status(400).json({ message: 'chapterSlug is required.' });
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        isPublished: true,
        slug: chapterSlug,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        chapterId: chapter.id,
        userId: user.id,
      },
      orderBy: [{ attemptNumber: 'desc' }, { createdAt: 'desc' }],
      select: {
        attemptNumber: true,
        correctAnswers: true,
        createdAt: true,
        scorePercent: true,
        totalQuestions: true,
        weakTopicSlugs: true,
      },
    });
    const history = summarizeQuizAttempts(attempts);

    return res.json({
      chapter: {
        slug: chapter.slug,
        title: chapter.title,
      },
      ...history,
    });
  } catch (error) {
    console.error('Failed to load quiz attempts', error);
    return res.status(500).json({ message: 'Unable to load quiz attempts right now.' });
  }
});

progressRouter.get('/mastery', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view mastery.' });
    }

    const chapterSlug = typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug.trim() : null;
    const chapterFilter = chapterSlug
      ? {
          chapter: {
            slug: chapterSlug,
          },
        }
      : {};

    const [masteries, missions, studyStreak, userBadges] = await Promise.all([
      prisma.chapterMastery.findMany({
        where: {
          userId: user.id,
          ...chapterFilter,
        },
        include: {
          chapter: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: [{ masteryScore: 'asc' }, { updatedAt: 'desc' }],
      }),
      prisma.revisionMission.findMany({
        where: {
          status: 'active',
          userId: user.id,
          ...chapterFilter,
        },
        include: {
          chapter: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.studyStreak.findUnique({
        where: {
          userId: user.id,
        },
      }),
      prisma.userBadge.findMany({
        where: {
          userId: user.id,
        },
        include: {
          badge: true,
          chapter: true,
        },
        orderBy: {
          awardedAt: 'desc',
        },
        take: 8,
      }),
    ]);

    const visibleMissions = missions.filter((mission) => !isRevisionMissionSatisfied(mission, masteries));

    return res.json({
      badges: userBadges.map((userBadge) => ({
        awardedAt: userBadge.awardedAt.toISOString(),
        chapterSlug: userBadge.chapter?.slug ?? null,
        chapterTitle: userBadge.chapter?.title ?? null,
        code: userBadge.badge.code,
        description: userBadge.badge.description,
        name: userBadge.badge.name,
      })),
      masteries: masteries.map((mastery) => ({
        bestQuizScorePercent: mastery.bestQuizScorePercent,
        chapterSlug: mastery.chapter.slug,
        chapterTitle: mastery.chapter.title,
        lastActivityAt: mastery.lastActivityAt?.toISOString() ?? null,
        level: mastery.level,
        masteryScore: mastery.masteryScore,
        subjectName: mastery.chapter.subject.name,
        videoCompletionPercent: mastery.videoCompletionPercent,
      })),
      revisionMissions: visibleMissions.map((mission) => ({
        chapterSlug: mission.chapter.slug,
        chapterTitle: mission.chapter.title,
        id: mission.id,
        reason: mission.reason,
        recommendedSteps: normalizeRecommendedSteps(mission.recommendedSteps),
        status: mission.status,
        subjectName: mission.chapter.subject.name,
        targetScore: mission.targetScore,
      })),
      streak: studyStreak
        ? {
            currentStreakDays: studyStreak.currentStreakDays,
            lastActivityDate: studyStreak.lastActivityDate?.toISOString() ?? null,
            longestStreakDays: studyStreak.longestStreakDays,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to load mastery progress', error);
    return res.status(500).json({ message: 'Unable to load mastery progress right now.' });
  }
});

import { Prisma } from '@prisma/client';
import { Router } from 'express';

import {
  awardEngagementBadges,
  awardPracticeBadges,
  awardQuizBadges,
  PERSONAL_BADGE_CODES,
  refreshDailyPracticeStreak,
} from '../lib/gamification.js';
import {
  buildExamReadyChecklist,
  hasThreeDayRecall,
} from '../lib/exam-readiness.js';
import {
  buildRevisionMissionActions,
  completeSatisfiedRevisionMissions,
  createOrRefreshRevisionMission,
  refreshChapterMastery,
} from '../lib/mastery-aggregation.js';
import { normalizePilotEngagementPayload, normalizePilotFeedbackPayload } from '../lib/pilot-progress.js';
import {
  buildPilotReviewPayload,
  canViewPilotReview,
  normalizePilotReviewWindowDays,
} from '../lib/pilot-review.js';
import { buildPracticeRetention } from '../lib/practice-retention.js';
import {
  normalizeQuizQuestionResults,
  syncPracticeMistakes,
  syncQuizMistakes,
} from '../lib/mistake-review.js';
import { prisma } from '../lib/prisma.js';
import { ensureChapter } from '../lib/curriculum-chapters.js';
import { summarizeQuizAttempts } from '../lib/quiz-attempts.js';
import { findInvalidWeakTopicSlug } from '../lib/quiz-topic-slugs.js';
import { requireSessionUser } from '../lib/session.js';
import {
  matchesWrittenPracticeAttempt,
  normalizeWrittenPracticeAttempt,
} from '../lib/written-practice.js';

const MAX_QUIZ_TRANSACTION_ATTEMPTS = 3;
const QUIZ_TRANSACTION_MAX_WAIT_MS = 15000;
const QUIZ_TRANSACTION_TIMEOUT_MS = 60000;
const MAX_PRACTICE_TRANSACTION_ATTEMPTS = 3;
const PRACTICE_TRANSACTION_MAX_WAIT_MS = 15000;
const PRACTICE_TRANSACTION_TIMEOUT_MS = 60000;

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

function shouldCountForStudyStreak(eventType: string) {
  return eventType === 'lesson_complete';
}

function isRetryableQuizTransactionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2028' || error.code === 'P2034' || error.code === 'P2002';
  }

  return false;
}

function isRetryablePracticeTransactionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2028' || error.code === 'P2034' || error.code === 'P2002';
  }

  return false;
}

async function findPublishedChapterId(chapterSlug: string | null) {
  if (!chapterSlug) {
    return null;
  }

  const chapter = await ensureChapter(prisma, chapterSlug);
  return chapter?.id ?? null;
}

function readLessonSlugFromMetadata(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return null;
  }

  const lessonSlug = (metadata as Prisma.JsonObject).lessonSlug;
  return typeof lessonSlug === 'string' ? lessonSlug : null;
}

async function loadExamReadiness(userId: string, chapterSlug: string) {
  let chapter = await prisma.chapter.findFirst({
    where: { isPublished: true, slug: chapterSlug },
    select: {
      id: true,
      topics: {
        select: {
          lessons: {
            where: { publishStatus: 'published' },
            select: { slug: true },
          },
        },
      },
    },
  });
  if (!chapter) {
    await ensureChapter(prisma, chapterSlug);
    chapter = await prisma.chapter.findFirst({
      where: { isPublished: true, slug: chapterSlug },
      select: {
        id: true,
        topics: {
          select: {
            lessons: {
              where: { publishStatus: 'published' },
              select: { slug: true },
            },
          },
        },
      },
    });
  }
  if (!chapter) {
    return null;
  }

  const [
    storedChecklist,
    lessonCompletions,
    practiceAttempts,
    mastery,
    unresolvedMistakeCount,
  ] = await Promise.all([
    prisma.examReadyChecklist.findUnique({
      where: { userId_chapterId: { chapterId: chapter.id, userId } },
    }),
    prisma.progressEvent.findMany({
      where: { chapterId: chapter.id, eventType: 'lesson_complete', userId },
      select: { metadata: true },
    }),
    prisma.writtenPracticeAttempt.findMany({
      where: { chapterId: chapter.id, userId },
      select: {
        answerLength: true,
        attemptNumber: true,
        createdAt: true,
        maxScoreHalfMarks: true,
        practiceKind: true,
        practiceItemId: true,
        retentionEligible: true,
        scoreHalfMarks: true,
      },
    }),
    prisma.chapterMastery.findUnique({
      where: { userId_chapterId: { chapterId: chapter.id, userId } },
      select: { bestQuizScorePercent: true },
    }),
    prisma.mistakeReviewItem.count({
      where: { chapterId: chapter.id, resolvedAt: null, userId },
    }),
  ]);

  const publishedLessonSlugs = new Set(
    chapter.topics.flatMap((topic) => topic.lessons.map((lesson) => lesson.slug)),
  );
  const completedLessonSlugs = new Set(
    lessonCompletions
      .map((event) => readLessonSlugFromMetadata(event.metadata))
      .filter((slug): slug is string => slug !== null && publishedLessonSlugs.has(slug)),
  );

  return buildExamReadyChecklist({
    bestQuizScorePercent: mastery?.bestQuizScorePercent ?? 0,
    chapterSlug,
    completedLessonCount: completedLessonSlugs.size,
    conceptsStudiedConfirmed: storedChecklist?.conceptsStudiedConfirmed ?? false,
    ncertQuestionsAttempted: storedChecklist?.ncertQuestionsAttempted ?? false,
    publishedLessonCount: publishedLessonSlugs.size,
    threeDayRecallCompleted: hasThreeDayRecall(practiceAttempts),
    unresolvedMistakeCount,
    weakAreasRevised: storedChecklist?.weakAreasRevised ?? false,
    writtenAnswerCount: practiceAttempts.filter(
      (attempt) =>
        attempt.practiceKind === 'written_practice' && attempt.answerLength > 0,
    ).length,
  });
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

progressRouter.post('/engagement', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save pilot activity.' });
    }

    const payload = normalizePilotEngagementPayload(req.body);
    if (!payload.data) {
      return res.status(400).json({ message: payload.error ?? 'Invalid engagement payload.' });
    }

    const engagement = payload.data;
    const chapterId = await findPublishedChapterId(engagement.chapterSlug);
    const occurredAt = new Date();

    const gamification = shouldCountForStudyStreak(engagement.eventType)
      ? await prisma.$transaction(async (tx) => {
          await tx.progressEvent.create({
            data: {
              chapterId,
              eventType: engagement.eventType,
              metadata: {
                chapterSlug: engagement.chapterSlug,
                lessonSlug: engagement.lessonSlug,
                path: engagement.path,
                source: 'free_student_pilot',
                surface: engagement.surface,
              } satisfies Prisma.InputJsonValue,
              occurredAt,
              userId: user.id,
            },
          });
          const studyStreak = await refreshDailyPracticeStreak({
            db: tx,
            occurredAt,
            userId: user.id,
          });
          const awardedBadges = await awardEngagementBadges({
            chapterId,
            currentStreakDays: studyStreak.currentStreakDays,
            db: tx,
            eventType: engagement.eventType,
            userId: user.id,
          });

          return {
            awardedBadges,
            streak: {
              currentStreakDays: studyStreak.currentStreakDays,
              longestStreakDays: studyStreak.longestStreakDays,
            },
          };
        })
      : null;

    if (!gamification) {
      await prisma.progressEvent.create({
        data: {
          chapterId,
          eventType: engagement.eventType,
          metadata: {
            chapterSlug: engagement.chapterSlug,
            lessonSlug: engagement.lessonSlug,
            path: engagement.path,
            source: 'free_student_pilot',
            surface: engagement.surface,
          } satisfies Prisma.InputJsonValue,
          occurredAt,
          userId: user.id,
        },
      });
    }

    return res.status(202).json({
      gamification,
      saved: true,
    });
  } catch (error) {
    console.error('Failed to save pilot engagement', error);
    return res.status(500).json({ message: 'Unable to save pilot activity right now.' });
  }
});

progressRouter.post('/feedback', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to send feedback.' });
    }

    const payload = normalizePilotFeedbackPayload(req.body);
    if (!payload.data) {
      return res.status(400).json({ message: payload.error ?? 'Invalid feedback payload.' });
    }

    const feedback = payload.data;
    const chapterId = await findPublishedChapterId(feedback.chapterSlug);

    await prisma.progressEvent.create({
      data: {
        chapterId,
        eventType: 'feedback_submission',
        metadata: {
          category: feedback.category,
          chapterSlug: feedback.chapterSlug,
          lessonSlug: feedback.lessonSlug,
          message: feedback.message,
          path: feedback.path,
          rating: feedback.rating,
          source: 'free_student_pilot',
          stuckReason: feedback.stuckReason,
          surface: feedback.surface,
        } satisfies Prisma.InputJsonValue,
        occurredAt: new Date(),
        userId: user.id,
      },
    });

    return res.status(201).json({ saved: true });
  } catch (error) {
    console.error('Failed to save pilot feedback', error);
    return res.status(500).json({ message: 'Unable to send feedback right now.' });
  }
});

progressRouter.get('/pilot-review', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!canViewPilotReview(user)) {
      return res.status(403).json({ message: 'Admin access is required to review pilot activity.' });
    }

    const windowDays = normalizePilotReviewWindowDays(req.query.windowDays);
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    const events = await prisma.progressEvent.findMany({
      where: {
        occurredAt: {
          gte: since,
        },
        OR: [
          {
            eventType: 'feedback_submission',
          },
          {
            metadata: {
              path: ['source'],
              equals: 'free_student_pilot',
            },
          },
        ],
      },
      orderBy: {
        occurredAt: 'desc',
      },
      select: {
        eventType: true,
        metadata: true,
        occurredAt: true,
        userId: true,
      },
      take: 500,
    });

    return res.json(buildPilotReviewPayload({ events, windowDays }));
  } catch (error) {
    console.error('Failed to load pilot review', error);
    return res.status(500).json({ message: 'Unable to load pilot review right now.' });
  }
});

progressRouter.post('/practice', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save written-practice progress.' });
    }

    const normalized = normalizeWrittenPracticeAttempt(req.body);
    if (!normalized.data) {
      return res.status(400).json({ message: normalized.error });
    }

    const practice = normalized.data;
    const chapter = await prisma.chapter.findFirst({
      where: {
        isPublished: true,
        slug: practice.chapterSlug,
        topics: {
          some: {
            lessons: {
              some: {
                publishStatus: 'published',
                slug: practice.lessonSlug,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Published chapter lesson was not found.' });
    }

    let savedResult;
    for (let attemptIndex = 0; attemptIndex < MAX_PRACTICE_TRANSACTION_ATTEMPTS; attemptIndex += 1) {
      try {
        savedResult = await prisma.$transaction(
          async (tx) => {
            const existingAttempt = await tx.writtenPracticeAttempt.findUnique({
              where: {
                userId_clientAttemptId: {
                  clientAttemptId: practice.clientAttemptId,
                  userId: user.id,
                },
              },
            });
            if (existingAttempt) {
              return {
                attempt: existingAttempt,
                awardedBadges: [],
                studyStreak: null,
              };
            }

            const latestAttempt = await tx.writtenPracticeAttempt.findFirst({
              where: {
                practiceItemId: practice.practiceItemId,
                userId: user.id,
              },
              orderBy: {
                attemptNumber: 'desc',
              },
              select: {
                attemptNumber: true,
              },
            });

            const attempt = await tx.writtenPracticeAttempt.create({
              data: {
                answerLength: practice.answerLength,
                attemptNumber: (latestAttempt?.attemptNumber ?? 0) + 1,
                chapterId: chapter.id,
                clientAttemptId: practice.clientAttemptId,
                earnedRubricPointIds: practice.earnedRubricPointIds,
                lessonSlug: practice.lessonSlug,
                maxScoreHalfMarks: practice.maxScoreHalfMarks,
                missedRubricPointIds: practice.missedRubricPoints.map((point) => point.id),
                practiceKind: practice.practiceKind,
                practiceItemId: practice.practiceItemId,
                retentionEligible: practice.retentionEligible,
                scoreHalfMarks: practice.scoreHalfMarks,
                userId: user.id,
                usedHints: practice.usedHints,
                weakSkillSlugs: practice.weakSkillSlugs,
              },
            });

            await tx.progressEvent.create({
              data: {
                chapterId: chapter.id,
                eventType: 'written_practice_scored',
                metadata: {
                  answerLength: attempt.answerLength,
                  attemptId: attempt.id,
                  attemptNumber: attempt.attemptNumber,
                  earnedRubricPointIds: attempt.earnedRubricPointIds,
                  lessonSlug: attempt.lessonSlug,
                  maxScoreHalfMarks: attempt.maxScoreHalfMarks,
                  missedRubricPointIds: attempt.missedRubricPointIds,
                  practiceKind: practice.practiceKind,
                  practiceItemId: attempt.practiceItemId,
                  retentionEligible: attempt.retentionEligible,
                  scoreHalfMarks: attempt.scoreHalfMarks,
                  usedHints: attempt.usedHints,
                  weakSkillSlugs: attempt.weakSkillSlugs,
                } satisfies Prisma.InputJsonValue,
                occurredAt: attempt.createdAt,
                userId: user.id,
              },
            });

            await syncPracticeMistakes({
              attemptedAt: attempt.createdAt,
              chapterId: chapter.id,
              chapterSlug: practice.chapterSlug,
              db: tx,
              earnedRubricPointIds: attempt.earnedRubricPointIds,
              hintPrompt: practice.hintPrompt,
              lessonSlug: attempt.lessonSlug,
              missedRubricPoints: practice.missedRubricPoints,
              practiceItemId: attempt.practiceItemId,
              practiceKind: practice.practiceKind,
              practicePrompt: practice.practicePrompt,
              practiceTitle: practice.practiceTitle,
              usedHints: attempt.usedHints,
              userId: user.id,
            });

            const studyStreak = await refreshDailyPracticeStreak({
              db: tx,
              occurredAt: attempt.createdAt,
              userId: user.id,
            });
            const awardedBadges = await awardPracticeBadges({
              chapterId: chapter.id,
              currentStreakDays: studyStreak.currentStreakDays,
              db: tx,
              practiceKind: practice.practiceKind,
              userId: user.id,
            });

            return {
              attempt,
              awardedBadges,
              studyStreak,
            };
          },
          {
            maxWait: PRACTICE_TRANSACTION_MAX_WAIT_MS,
            timeout: PRACTICE_TRANSACTION_TIMEOUT_MS,
          },
        );
        break;
      } catch (error) {
        if (
          attemptIndex === MAX_PRACTICE_TRANSACTION_ATTEMPTS - 1 ||
          !isRetryablePracticeTransactionError(error)
        ) {
          throw error;
        }
      }
    }

    if (!savedResult) {
      throw new Error('Written-practice transaction did not complete.');
    }
    const savedAttempt = savedResult.attempt;
    if (!matchesWrittenPracticeAttempt(savedAttempt, practice, chapter.id)) {
      return res.status(409).json({
        message:
          'This client attempt id is already attached to different immutable practice data.',
      });
    }

    const retentionAttempts = await prisma.writtenPracticeAttempt.findMany({
      where: {
        practiceItemId: practice.practiceItemId,
        userId: user.id,
      },
      orderBy: [{ attemptNumber: 'asc' }, { createdAt: 'asc' }],
      select: {
        attemptNumber: true,
        createdAt: true,
        maxScoreHalfMarks: true,
        retentionEligible: true,
        scoreHalfMarks: true,
      },
    });

    return res.status(201).json({
      attempt: {
        attemptNumber: savedAttempt.attemptNumber,
        clientAttemptId: savedAttempt.clientAttemptId,
        createdAt: savedAttempt.createdAt.toISOString(),
        earnedRubricPointIds: savedAttempt.earnedRubricPointIds,
        maxScoreHalfMarks: savedAttempt.maxScoreHalfMarks,
        missedRubricPointIds: savedAttempt.missedRubricPointIds,
        retentionEligible: savedAttempt.retentionEligible,
        scoreHalfMarks: savedAttempt.scoreHalfMarks,
        usedHints: savedAttempt.usedHints,
        weakSkillSlugs: savedAttempt.weakSkillSlugs,
      },
      gamification: savedResult.studyStreak
        ? {
            awardedBadges: savedResult.awardedBadges,
            streak: {
              currentStreakDays: savedResult.studyStreak.currentStreakDays,
              longestStreakDays: savedResult.studyStreak.longestStreakDays,
            },
          }
        : null,
      retention: buildPracticeRetention(retentionAttempts),
    });
  } catch (error) {
    console.error('Failed to save written-practice progress', error);
    return res.status(500).json({ message: 'Unable to save written-practice progress right now.' });
  }
});

progressRouter.get('/practice-attempts', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view written-practice attempts.' });
    }

    const chapterSlug =
      typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug.trim() : null;
    const practiceItemId =
      typeof req.query.practiceItemId === 'string' ? req.query.practiceItemId.trim() : null;

    if (!chapterSlug || !practiceItemId) {
      return res.status(400).json({ message: 'chapterSlug and practiceItemId are required.' });
    }

    const attemptWhere = {
      chapter: {
        isPublished: true,
        slug: chapterSlug,
      },
      practiceItemId,
      userId: user.id,
    } satisfies Prisma.WrittenPracticeAttemptWhereInput;
    const [attempts, retentionAttempts] = await Promise.all([
      prisma.writtenPracticeAttempt.findMany({
        where: attemptWhere,
        orderBy: [{ attemptNumber: 'desc' }, { createdAt: 'desc' }],
        select: {
          answerLength: true,
          attemptNumber: true,
          clientAttemptId: true,
          createdAt: true,
          earnedRubricPointIds: true,
          maxScoreHalfMarks: true,
          missedRubricPointIds: true,
          retentionEligible: true,
          scoreHalfMarks: true,
          usedHints: true,
          weakSkillSlugs: true,
        },
        take: 5,
      }),
      prisma.writtenPracticeAttempt.findMany({
        where: attemptWhere,
        orderBy: [{ attemptNumber: 'asc' }, { createdAt: 'asc' }],
        select: {
          attemptNumber: true,
          createdAt: true,
          maxScoreHalfMarks: true,
          retentionEligible: true,
          scoreHalfMarks: true,
        },
      }),
    ]);

    return res.json({
      attempts: attempts.map((attempt) => ({
        answerLength: attempt.answerLength,
        attemptNumber: attempt.attemptNumber,
        clientAttemptId: attempt.clientAttemptId,
        earnedRubricPointIds: attempt.earnedRubricPointIds,
        maxScoreHalfMarks: attempt.maxScoreHalfMarks,
        missedRubricPointIds: attempt.missedRubricPointIds,
        retentionEligible: attempt.retentionEligible,
        savedAt: attempt.createdAt.toISOString(),
        scoreHalfMarks: attempt.scoreHalfMarks,
        usedHints: attempt.usedHints,
        weakSkillSlugs: attempt.weakSkillSlugs,
      })),
      retention: buildPracticeRetention(retentionAttempts),
    });
  } catch (error) {
    console.error('Failed to load written-practice attempts', error);
    return res.status(500).json({ message: 'Unable to load written-practice attempts right now.' });
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
    const normalizedQuestionResults = normalizeQuizQuestionResults(req.body?.questionResults);

    if (!normalizedQuestionResults.data) {
      return res.status(400).json({ message: normalizedQuestionResults.error });
    }
    const questionResults = normalizedQuestionResults.data;

    if (!chapterSlug || scorePercent === null || totalQuestions === null || correctAnswers === null) {
      return res
        .status(400)
        .json({ message: 'chapterSlug, scorePercent, totalQuestions, and correctAnswers are required.' });
    }

    if (totalQuestions <= 0 || correctAnswers > totalQuestions) {
      return res.status(400).json({ message: 'Quiz answers must fit within the total question count.' });
    }

    if (
      questionResults.length > 0 &&
      (questionResults.length !== totalQuestions ||
        questionResults.filter((result) => result.isCorrect).length !== correctAnswers)
    ) {
      return res.status(400).json({
        message: 'questionResults must match the submitted quiz totals.',
      });
    }

    const derivedScorePercent = Math.round((correctAnswers / totalQuestions) * 100);

    const chapter = await ensureChapter(prisma, chapterSlug);

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }

    const chapterTopicSlugs = new Set(chapter.topics.map((chapterTopic) => chapterTopic.slug));
    const topic = topicSlug ? chapter.topics.find((chapterTopic) => chapterTopic.slug === topicSlug) : null;
    const missionTopic =
      weakTopicSlugs.length > 0
        ? chapter.topics.find((chapterTopic) => chapterTopic.slug === weakTopicSlugs[0]) ?? topic
        : topic;
    if (topicSlug && !topic) {
      return res.status(400).json({ message: 'topicSlug must belong to the selected chapter.' });
    }

    if (
      findInvalidWeakTopicSlug({
        chapterSlug,
        chapterTopicSlugs: Array.from(chapterTopicSlugs),
        weakTopicSlugs,
      })
    ) {
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
                questionResults:
                  questionResults.length > 0
                    ? (questionResults as unknown as Prisma.InputJsonValue)
                    : undefined,
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

            if (questionResults.length > 0 || weakTopicSlugs.length > 0) {
              await syncQuizMistakes({
                attemptedAt: attempt.createdAt,
                chapterId: chapter.id,
                chapterSlug,
                db: tx,
                questionResults,
                userId: user.id,
                weakTopicSlugs,
              });
            }

            const revisionMission = await createOrRefreshRevisionMission({
              chapterId: chapter.id,
              db: tx,
              scorePercent: derivedScorePercent,
              topicId: missionTopic?.id ?? null,
              userId: user.id,
              weakTopicLabel: missionTopic?.title ?? null,
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
              currentStreakDays: studyStreak.currentStreakDays,
              db: tx,
              scorePercent: derivedScorePercent,
              userId: user.id,
            });

            return { attempt, awardedBadges, mastery, revisionMission, studyStreak };
          },
          {
            maxWait: QUIZ_TRANSACTION_MAX_WAIT_MS,
            timeout: QUIZ_TRANSACTION_TIMEOUT_MS,
          },
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
      revisionMission: result.revisionMission.mission
        ? {
            id: result.revisionMission.mission.id,
            reason: result.revisionMission.mission.reason,
            recommendedActions: buildRevisionMissionActions({
              chapterSlug,
              primaryWeakTopicLabel: missionTopic?.title ?? null,
              weakTopicSlugs,
            }),
            recommendedSteps: normalizeRecommendedSteps(result.revisionMission.mission.recommendedSteps),
            state: result.revisionMission.state,
            status: result.revisionMission.mission.status,
            targetScore: result.revisionMission.mission.targetScore,
          }
        : {
            mission: null,
            state: result.revisionMission.state,
          },
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

    const chapter = await ensureChapter(prisma, chapterSlug);

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

progressRouter.get('/mistakes', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view My Mistakes.' });
    }

    const chapterSlug =
      typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug.trim() : null;
    const status =
      req.query.status === 'resolved' || req.query.status === 'all'
        ? req.query.status
        : 'active';
    const items = await prisma.mistakeReviewItem.findMany({
      where: {
        chapter: chapterSlug ? { slug: chapterSlug } : undefined,
        resolvedAt:
          status === 'all' ? undefined : status === 'resolved' ? { not: null } : null,
        userId: user.id,
      },
      orderBy: [{ retryAt: 'asc' }, { lastSeenAt: 'desc' }],
      select: {
        chapter: {
          select: {
            slug: true,
            subject: { select: { name: true } },
            title: true,
          },
        },
        conceptSlug: true,
        detail: true,
        id: true,
        kind: true,
        lastSeenAt: true,
        metadata: true,
        occurrenceCount: true,
        resolvedAt: true,
        retryAt: true,
        reviewHref: true,
        sourceItemId: true,
        title: true,
      },
      take: 200,
    });
    const now = new Date();

    return res.json({
      items: items.map((item) => ({
        chapterSlug: item.chapter.slug,
        chapterTitle: item.chapter.title,
        conceptSlug: item.conceptSlug,
        detail: item.detail,
        due: item.resolvedAt === null && item.retryAt <= now,
        id: item.id,
        kind: item.kind,
        lastSeenAt: item.lastSeenAt.toISOString(),
        metadata: item.metadata,
        occurrenceCount: item.occurrenceCount,
        resolvedAt: item.resolvedAt?.toISOString() ?? null,
        retryAt: item.retryAt.toISOString(),
        reviewHref: item.reviewHref,
        sourceItemId: item.sourceItemId,
        subject: item.chapter.subject.name,
        title: item.title,
      })),
      status,
    });
  } catch (error) {
    console.error('Failed to load My Mistakes', error);
    return res.status(500).json({ message: 'Unable to load My Mistakes right now.' });
  }
});

progressRouter.patch('/mistakes/:mistakeId', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to update My Mistakes.' });
    }
    if (typeof req.body?.resolved !== 'boolean') {
      return res.status(400).json({ message: 'resolved must be true or false.' });
    }

    const existing = await prisma.mistakeReviewItem.findFirst({
      where: { id: req.params.mistakeId, userId: user.id },
      select: { chapterId: true, id: true },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Mistake item was not found.' });
    }

    const resolvedAt = req.body.resolved ? new Date() : null;
    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.mistakeReviewItem.update({
        where: { id: existing.id },
        data: { resolvedAt },
      });
      const remaining = await tx.mistakeReviewItem.count({
        where: {
          chapterId: existing.chapterId,
          id: { not: existing.id },
          resolvedAt: null,
          userId: user.id,
        },
      });
      await tx.examReadyChecklist.upsert({
        where: {
          userId_chapterId: { chapterId: existing.chapterId, userId: user.id },
        },
        create: {
          chapterId: existing.chapterId,
          userId: user.id,
          weakAreasRevised: Boolean(resolvedAt) && remaining === 0,
        },
        update: {
          weakAreasRevised: Boolean(resolvedAt) && remaining === 0,
        },
      });
      return item;
    });

    return res.json({
      id: updated.id,
      resolvedAt: updated.resolvedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('Failed to update My Mistakes', error);
    return res.status(500).json({ message: 'Unable to update this mistake right now.' });
  }
});

progressRouter.get('/exam-readiness', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view Exam Ready.' });
    }
    const chapterSlug =
      typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug.trim() : null;
    if (!chapterSlug) {
      return res.status(400).json({ message: 'chapterSlug is required.' });
    }

    const checklist = await loadExamReadiness(user.id, chapterSlug);
    if (!checklist) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }
    return res.json(checklist);
  } catch (error) {
    console.error('Failed to load Exam Ready checklist', error);
    return res.status(500).json({ message: 'Unable to load Exam Ready right now.' });
  }
});

progressRouter.patch('/exam-readiness', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to update Exam Ready.' });
    }
    const chapterSlug =
      typeof req.body?.chapterSlug === 'string' ? req.body.chapterSlug.trim() : null;
    const itemId = req.body?.itemId;
    const complete = req.body?.complete;
    if (
      !chapterSlug ||
      typeof complete !== 'boolean' ||
      !['conceptsStudied', 'ncertQuestionsAttempted', 'weakAreasRevised'].includes(itemId)
    ) {
      return res.status(400).json({
        message: 'chapterSlug, a student-confirmed checklist item, and complete are required.',
      });
    }

    const chapterId = await findPublishedChapterId(chapterSlug);
    if (!chapterId) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }
    if (itemId === 'weakAreasRevised' && complete) {
      const unresolvedMistakes = await prisma.mistakeReviewItem.count({
        where: { chapterId, resolvedAt: null, userId: user.id },
      });
      if (unresolvedMistakes > 0) {
        return res.status(409).json({
          message: 'Revise or resolve every active My Mistakes item first.',
        });
      }
    }

    const update =
      itemId === 'conceptsStudied'
        ? { conceptsStudiedConfirmed: complete }
        : itemId === 'ncertQuestionsAttempted'
          ? { ncertQuestionsAttempted: complete }
          : { weakAreasRevised: complete };
    await prisma.examReadyChecklist.upsert({
      where: { userId_chapterId: { chapterId, userId: user.id } },
      create: { chapterId, userId: user.id, ...update },
      update,
    });

    return res.json(await loadExamReadiness(user.id, chapterSlug));
  } catch (error) {
    console.error('Failed to update Exam Ready checklist', error);
    return res.status(500).json({ message: 'Unable to update Exam Ready right now.' });
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
          topic: true,
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
          badge: {
            code: {
              in: PERSONAL_BADGE_CODES,
            },
          },
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

    const visibleMissions = await completeSatisfiedRevisionMissions({
      masteries,
      missions,
    });

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
        recommendedActions: buildRevisionMissionActions({
          chapterSlug: mission.chapter.slug,
          primaryWeakTopicLabel: mission.topic?.title ?? null,
          weakTopicSlugs: mission.topic?.slug ? [mission.topic.slug] : [],
        }),
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

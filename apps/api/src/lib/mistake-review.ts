import { Prisma } from '@prisma/client';

export const MISTAKE_RETRY_DAYS = 3;

export type QuizQuestionResult = {
  correctAnswer: string;
  explanation: string | null;
  isCorrect: boolean;
  prompt: string;
  questionId: string;
  selectedAnswer: string;
  title: string;
  topicLabel: string | null;
  topicSlug: string | null;
};

export type MissedRubricPoint = {
  id: string;
  label: string;
  skillSlug: string;
};

type NormalizeQuestionResults =
  | { data: QuizQuestionResult[]; error: null }
  | { data: null; error: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function readOptionalText(value: unknown, maxLength: number) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return readText(value, maxLength);
}

function readOptionalSlug(value: unknown) {
  const slug = readOptionalText(value, 120);
  return slug && SLUG_PATTERN.test(slug) ? slug : slug === null ? null : undefined;
}

export function normalizeQuizQuestionResults(value: unknown): NormalizeQuestionResults {
  if (value === null || value === undefined) {
    return { data: [], error: null };
  }
  if (!Array.isArray(value) || value.length > 100) {
    return { data: null, error: 'questionResults must contain at most 100 quiz questions.' };
  }

  const results: QuizQuestionResult[] = [];
  const seenIds = new Set<string>();
  for (const item of value) {
    const record = readRecord(item);
    const questionId = readText(record?.questionId, 120);
    const title = readText(record?.title, 240);
    const prompt = readText(record?.prompt, 2000);
    const selectedAnswer = readText(record?.selectedAnswer, 800);
    const correctAnswer = readText(record?.correctAnswer, 800);
    const explanation = readOptionalText(record?.explanation, 2000);
    const topicLabel = readOptionalText(record?.topicLabel, 240);
    const topicSlug = readOptionalSlug(record?.topicSlug);
    if (
      !record ||
      !questionId ||
      !/^[a-zA-Z0-9_-]+$/.test(questionId) ||
      !title ||
      !prompt ||
      !selectedAnswer ||
      !correctAnswer ||
      typeof record.isCorrect !== 'boolean' ||
      explanation === undefined ||
      topicLabel === undefined ||
      topicSlug === undefined ||
      seenIds.has(questionId)
    ) {
      return { data: null, error: 'questionResults contains invalid or duplicate quiz evidence.' };
    }

    seenIds.add(questionId);
    results.push({
      correctAnswer,
      explanation,
      isCorrect: record.isCorrect,
      prompt,
      questionId,
      selectedAnswer,
      title,
      topicLabel,
      topicSlug,
    });
  }

  return { data: results, error: null };
}

export function buildMistakeRetryAt(attemptedAt: Date) {
  return new Date(attemptedAt.getTime() + MISTAKE_RETRY_DAYS * 24 * 60 * 60 * 1000);
}

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function questionItemKey(chapterSlug: string, questionId: string) {
  return `quiz:${chapterSlug}:${questionId}`;
}

function conceptItemKey(chapterSlug: string, conceptSlug: string) {
  return `concept:${chapterSlug}:${conceptSlug}`;
}

function hintItemKey(chapterSlug: string, practiceItemId: string) {
  return `hint:${chapterSlug}:${practiceItemId}`;
}

function markingPointItemKey(
  chapterSlug: string,
  practiceItemId: string,
  pointId: string,
) {
  return `mark:${chapterSlug}:${practiceItemId}:${pointId}`;
}

async function flagOpenWeakAreas(
  db: Prisma.TransactionClient,
  userId: string,
  chapterId: string,
) {
  await db.examReadyChecklist.upsert({
    where: { userId_chapterId: { chapterId, userId } },
    create: { chapterId, userId, weakAreasRevised: false },
    update: { weakAreasRevised: false },
  });
}

export async function syncQuizMistakes(params: {
  attemptedAt: Date;
  chapterId: string;
  chapterSlug: string;
  db: Prisma.TransactionClient;
  questionResults: QuizQuestionResult[];
  userId: string;
  weakTopicSlugs: string[];
}) {
  const retryAt = buildMistakeRetryAt(params.attemptedAt);
  const reviewHref = `/chapters/${params.chapterSlug}/quiz`;
  const incorrectQuestions = params.questionResults.filter((result) => !result.isCorrect);
  const correctQuestions = params.questionResults.filter((result) => result.isCorrect);

  await Promise.all(
    correctQuestions.map((result) =>
      params.db.mistakeReviewItem.updateMany({
        where: {
          itemKey: questionItemKey(params.chapterSlug, result.questionId),
          userId: params.userId,
        },
        data: { resolvedAt: params.attemptedAt },
      }),
    ),
  );

  await Promise.all(
    incorrectQuestions.map((result) =>
      params.db.mistakeReviewItem.upsert({
        where: {
          userId_itemKey: {
            itemKey: questionItemKey(params.chapterSlug, result.questionId),
            userId: params.userId,
          },
        },
        create: {
          chapterId: params.chapterId,
          conceptSlug: result.topicSlug,
          detail: `You chose “${result.selectedAnswer}”. Correct answer: “${result.correctAnswer}”.`,
          itemKey: questionItemKey(params.chapterSlug, result.questionId),
          kind: 'quiz_question',
          lastSeenAt: params.attemptedAt,
          metadata: {
            correctAnswer: result.correctAnswer,
            explanation: result.explanation,
            prompt: result.prompt,
            selectedAnswer: result.selectedAnswer,
          } satisfies Prisma.InputJsonValue,
          retryAt,
          reviewHref: `${reviewHref}#quiz-question-${result.questionId}`,
          sourceItemId: result.questionId,
          title: result.title,
          userId: params.userId,
        },
        update: {
          conceptSlug: result.topicSlug,
          detail: `You chose “${result.selectedAnswer}”. Correct answer: “${result.correctAnswer}”.`,
          lastSeenAt: params.attemptedAt,
          metadata: {
            correctAnswer: result.correctAnswer,
            explanation: result.explanation,
            prompt: result.prompt,
            selectedAnswer: result.selectedAnswer,
          } satisfies Prisma.InputJsonValue,
          occurrenceCount: { increment: 1 },
          resolvedAt: null,
          retryAt,
          reviewHref: `${reviewHref}#quiz-question-${result.questionId}`,
          title: result.title,
        },
      })
    )
  );

  const labelBySlug = new Map(
    params.questionResults
      .filter((result) => result.topicSlug && result.topicLabel)
      .map((result) => [result.topicSlug as string, result.topicLabel as string]),
  );
  if (params.weakTopicSlugs.length === 0) {
    await params.db.mistakeReviewItem.updateMany({
      where: {
        chapterId: params.chapterId,
        kind: 'weak_concept',
        userId: params.userId,
      },
      data: { resolvedAt: params.attemptedAt },
    });
  } else {
    await params.db.mistakeReviewItem.updateMany({
      where: {
        chapterId: params.chapterId,
        conceptSlug: { notIn: params.weakTopicSlugs },
        kind: 'weak_concept',
        userId: params.userId,
      },
      data: { resolvedAt: params.attemptedAt },
    });
  }

  await Promise.all(
    params.weakTopicSlugs.map((conceptSlug) => {
      const conceptLabel = labelBySlug.get(conceptSlug) ?? formatSlug(conceptSlug);
      return params.db.mistakeReviewItem.upsert({
        where: {
          userId_itemKey: {
            itemKey: conceptItemKey(params.chapterSlug, conceptSlug),
            userId: params.userId,
          },
        },
        create: {
          chapterId: params.chapterId,
          conceptSlug,
          detail: 'This concept appeared in one or more incorrect quiz answers.',
          itemKey: conceptItemKey(params.chapterSlug, conceptSlug),
          kind: 'weak_concept',
          lastSeenAt: params.attemptedAt,
          retryAt,
          reviewHref: `/chapters/${params.chapterSlug}/notes`,
          sourceItemId: conceptSlug,
          title: `Weak concept: ${conceptLabel}`,
          userId: params.userId,
        },
        update: {
          lastSeenAt: params.attemptedAt,
          occurrenceCount: { increment: 1 },
          resolvedAt: null,
          retryAt,
          title: `Weak concept: ${conceptLabel}`,
        },
      });
    })
  );

  if (incorrectQuestions.length > 0 || params.weakTopicSlugs.length > 0) {
    await flagOpenWeakAreas(params.db, params.userId, params.chapterId);
  }
}

export async function syncPracticeMistakes(params: {
  attemptedAt: Date;
  chapterId: string;
  chapterSlug: string;
  db: Prisma.TransactionClient;
  earnedRubricPointIds: string[];
  hintPrompt: string | null;
  lessonSlug: string;
  missedRubricPoints: MissedRubricPoint[];
  practiceItemId: string;
  practiceKind: string;
  practicePrompt: string | null;
  practiceTitle: string;
  usedHints: boolean;
  userId: string;
}) {
  const retryAt = buildMistakeRetryAt(params.attemptedAt);
  const reviewHref =
    params.practiceKind === 'written_practice'
      ? `/chapters/${params.chapterSlug}/lessons/${params.lessonSlug}#written-practice-${params.practiceItemId}`
      : `/chapters/${params.chapterSlug}/lessons/${params.lessonSlug}`;

  await Promise.all(
    params.earnedRubricPointIds.map((pointId) =>
      params.db.mistakeReviewItem.updateMany({
        where: {
          itemKey: markingPointItemKey(params.chapterSlug, params.practiceItemId, pointId),
          userId: params.userId,
        },
        data: { resolvedAt: params.attemptedAt },
      }),
    ),
  );

  await Promise.all(
    params.missedRubricPoints.map((point) =>
      params.db.mistakeReviewItem.upsert({
        where: {
          userId_itemKey: {
            itemKey: markingPointItemKey(params.chapterSlug, params.practiceItemId, point.id),
            userId: params.userId,
          },
        },
        create: {
          chapterId: params.chapterId,
          conceptSlug: point.skillSlug,
          detail: `Your self-check did not include this marking point: ${point.label}`,
          itemKey: markingPointItemKey(params.chapterSlug, params.practiceItemId, point.id),
          kind: 'written_marking_point',
          lastSeenAt: params.attemptedAt,
          lessonSlug: params.lessonSlug,
          metadata: {
            practicePrompt: params.practicePrompt,
            practiceTitle: params.practiceTitle,
          } satisfies Prisma.InputJsonValue,
          retryAt,
          reviewHref,
          sourceItemId: point.id,
          title: `Missed marking point: ${point.label}`,
          userId: params.userId,
        },
        update: {
          conceptSlug: point.skillSlug,
          detail: `Your self-check did not include this marking point: ${point.label}`,
          lastSeenAt: params.attemptedAt,
          metadata: {
            practicePrompt: params.practicePrompt,
            practiceTitle: params.practiceTitle,
          } satisfies Prisma.InputJsonValue,
          occurrenceCount: { increment: 1 },
          resolvedAt: null,
          retryAt,
          reviewHref,
          title: `Missed marking point: ${point.label}`,
        },
      })
    )
  );

  const hintKey = hintItemKey(params.chapterSlug, params.practiceItemId);
  if (params.usedHints) {
    await params.db.mistakeReviewItem.upsert({
      where: { userId_itemKey: { itemKey: hintKey, userId: params.userId } },
      create: {
        chapterId: params.chapterId,
        detail: 'You completed this practice after opening one or more hints. Retry it independently.',
        itemKey: hintKey,
        kind: 'hint_used',
        lastSeenAt: params.attemptedAt,
        lessonSlug: params.lessonSlug,
        metadata: {
          practiceKind: params.practiceKind,
          prompt: params.hintPrompt ?? params.practicePrompt,
        } satisfies Prisma.InputJsonValue,
        retryAt,
        reviewHref,
        sourceItemId: params.practiceItemId,
        title: `Retry without hints: ${params.practiceTitle}`,
        userId: params.userId,
      },
      update: {
        lastSeenAt: params.attemptedAt,
        metadata: {
          practiceKind: params.practiceKind,
          prompt: params.hintPrompt ?? params.practicePrompt,
        } satisfies Prisma.InputJsonValue,
        occurrenceCount: { increment: 1 },
        resolvedAt: null,
        retryAt,
        reviewHref,
        title: `Retry without hints: ${params.practiceTitle}`,
      },
    });
  } else {
    await params.db.mistakeReviewItem.updateMany({
      where: { itemKey: hintKey, userId: params.userId },
      data: { resolvedAt: params.attemptedAt },
    });
  }

  if (params.usedHints || params.missedRubricPoints.length > 0) {
    await flagOpenWeakAreas(params.db, params.userId, params.chapterId);
  }
}

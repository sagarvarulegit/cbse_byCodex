import { buildPracticeRetention, type PracticeRetentionAttempt } from './practice-retention.js';

export const EXAM_READY_QUIZ_TARGET_PERCENT = 70;

export type ExamReadyChecklistState = {
  chapterSlug: string;
  completedCount: number;
  items: Array<{
    automatic: boolean;
    complete: boolean;
    description: string;
    id:
      | 'conceptsStudied'
      | 'ncertQuestionsAttempted'
      | 'writtenAnswerCompleted'
      | 'chapterQuizTargetReached'
      | 'weakAreasRevised'
      | 'threeDayRecallCompleted';
    label: string;
  }>;
  quizTargetPercent: number;
  totalCount: number;
};

export function hasThreeDayRecall(
  attempts: Array<PracticeRetentionAttempt & { practiceItemId: string }>,
  now = new Date(),
) {
  const attemptsByItem = new Map<string, PracticeRetentionAttempt[]>();
  for (const attempt of attempts) {
    const current = attemptsByItem.get(attempt.practiceItemId) ?? [];
    current.push(attempt);
    attemptsByItem.set(attempt.practiceItemId, current);
  }

  return Array.from(attemptsByItem.values()).some((itemAttempts) =>
    buildPracticeRetention(itemAttempts, now).checkpoints.some(
      (checkpoint) => checkpoint.checkpoint === 'D3' && checkpoint.status === 'complete',
    ),
  );
}

export function buildExamReadyChecklist(params: {
  bestQuizScorePercent: number;
  chapterSlug: string;
  completedLessonCount: number;
  conceptsStudiedConfirmed: boolean;
  ncertQuestionsAttempted: boolean;
  publishedLessonCount: number;
  threeDayRecallCompleted: boolean;
  unresolvedMistakeCount: number;
  weakAreasRevised: boolean;
  writtenAnswerCount: number;
}): ExamReadyChecklistState {
  const allLessonsCompleted =
    params.publishedLessonCount > 0 &&
    params.completedLessonCount >= params.publishedLessonCount;
  const items: ExamReadyChecklistState['items'] = [
    {
      automatic: allLessonsCompleted,
      complete: params.conceptsStudiedConfirmed || allLessonsCompleted,
      description: allLessonsCompleted
        ? 'Completed from your saved lesson-study record.'
        : 'Confirm after you have studied every chapter concept.',
      id: 'conceptsStudied',
      label: 'Concepts studied',
    },
    {
      automatic: false,
      complete: params.ncertQuestionsAttempted,
      description: 'Confirm after attempting the chapter’s NCERT questions before checking answers.',
      id: 'ncertQuestionsAttempted',
      label: 'NCERT questions attempted',
    },
    {
      automatic: true,
      complete: params.writtenAnswerCount > 0,
      description: 'Completed by a saved written-practice self-check.',
      id: 'writtenAnswerCompleted',
      label: 'Written answer completed',
    },
    {
      automatic: true,
      complete: params.bestQuizScorePercent >= EXAM_READY_QUIZ_TARGET_PERCENT,
      description: `Reach ${EXAM_READY_QUIZ_TARGET_PERCENT}% or more in a saved chapter quiz.`,
      id: 'chapterQuizTargetReached',
      label: 'Chapter quiz target reached',
    },
    {
      automatic: false,
      complete: params.weakAreasRevised && params.unresolvedMistakeCount === 0,
      description:
        params.unresolvedMistakeCount > 0
          ? `${params.unresolvedMistakeCount} My Mistakes item(s) still need revision.`
          : 'Confirm after revising every weak area in My Mistakes.',
      id: 'weakAreasRevised',
      label: 'Weak areas revised',
    },
    {
      automatic: true,
      complete: params.threeDayRecallCompleted,
      description: 'Completed by a fresh 80%+ practice attempt on or after day three.',
      id: 'threeDayRecallCompleted',
      label: 'Three-day recall completed',
    },
  ];

  return {
    chapterSlug: params.chapterSlug,
    completedCount: items.filter((item) => item.complete).length,
    items,
    quizTargetPercent: EXAM_READY_QUIZ_TARGET_PERCENT,
    totalCount: items.length,
  };
}

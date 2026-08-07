import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExamReadyChecklist, hasThreeDayRecall } from './exam-readiness.js';

test('Exam Ready keeps evidence items separate from student confirmation', () => {
  const checklist = buildExamReadyChecklist({
    bestQuizScorePercent: 72,
    chapterSlug: 'real-numbers',
    completedLessonCount: 1,
    conceptsStudiedConfirmed: true,
    ncertQuestionsAttempted: true,
    publishedLessonCount: 3,
    threeDayRecallCompleted: false,
    unresolvedMistakeCount: 1,
    weakAreasRevised: true,
    writtenAnswerCount: 1,
  });

  assert.equal(checklist.completedCount, 4);
  assert.equal(
    checklist.items.find((item) => item.id === 'weakAreasRevised')?.complete,
    false,
  );
});

test('a separate qualifying attempt on day three completes recall', () => {
  assert.equal(
    hasThreeDayRecall([
      {
        attemptNumber: 1,
        createdAt: new Date('2026-08-01T10:00:00.000Z'),
        maxScoreHalfMarks: 10,
        practiceItemId: 'practice-one',
        retentionEligible: true,
        scoreHalfMarks: 8,
      },
      {
        attemptNumber: 2,
        createdAt: new Date('2026-08-04T10:00:00.000Z'),
        maxScoreHalfMarks: 10,
        practiceItemId: 'practice-one',
        retentionEligible: true,
        scoreHalfMarks: 9,
      },
    ]),
    true,
  );
});

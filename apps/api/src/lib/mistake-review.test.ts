import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMistakeRetryAt, normalizeQuizQuestionResults } from './mistake-review.js';

test('quiz question evidence is bounded and preserves the review details', () => {
  const result = normalizeQuizQuestionResults([
    {
      correctAnswer: '13',
      explanation: 'Use the shared prime factor.',
      isCorrect: false,
      prompt: 'Find the HCF of 26 and 91.',
      questionId: 'question-2',
      selectedAnswer: '7',
      title: 'HCF check',
      topicLabel: 'The Fundamental Theorem of Arithmetic',
      topicSlug: 'fundamental-theorem-of-arithmetic',
    },
  ]);

  assert.ok(result.data);
  assert.equal(result.data[0]?.questionId, 'question-2');
  assert.equal(result.data[0]?.isCorrect, false);
});

test('mistake retries are scheduled three days after the evidence time', () => {
  const attemptedAt = new Date('2026-08-04T10:00:00.000Z');
  assert.equal(
    buildMistakeRetryAt(attemptedAt).toISOString(),
    '2026-08-07T10:00:00.000Z',
  );
});

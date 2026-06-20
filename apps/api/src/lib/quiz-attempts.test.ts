import assert from 'node:assert/strict';
import test from 'node:test';

import { summarizeQuizAttempts } from './quiz-attempts.js';

test('summarizeQuizAttempts returns latest attempts and best score stats', () => {
  const history = summarizeQuizAttempts([
    {
      attemptNumber: 1,
      correctAnswers: 4,
      createdAt: new Date('2026-06-15T10:00:00.000Z'),
      scorePercent: 80,
      totalQuestions: 5,
      weakTopicSlugs: ['euclid-division-lemma'],
    },
    {
      attemptNumber: 3,
      correctAnswers: 5,
      createdAt: new Date('2026-06-17T10:00:00.000Z'),
      scorePercent: 100,
      totalQuestions: 5,
      weakTopicSlugs: [],
    },
    {
      attemptNumber: 2,
      correctAnswers: 2,
      createdAt: new Date('2026-06-16T10:00:00.000Z'),
      scorePercent: 40,
      totalQuestions: 5,
      weakTopicSlugs: ['hcf-lcm'],
    },
  ]);

  assert.deepEqual(
    history.attempts.map((attempt) => attempt.attemptNumber),
    [3, 2, 1],
  );
  assert.equal(history.stats.attemptCount, 3);
  assert.equal(history.stats.bestAttemptNumber, 3);
  assert.equal(history.stats.bestScorePercent, 100);
  assert.equal(history.stats.latestAttemptNumber, 3);
  assert.equal(history.stats.latestScorePercent, 100);
  assert.equal(history.attempts[0]?.createdAt, '2026-06-17T10:00:00.000Z');
});

test('summarizeQuizAttempts handles empty quiz history', () => {
  const history = summarizeQuizAttempts([]);

  assert.deepEqual(history.attempts, []);
  assert.deepEqual(history.stats, {
    attemptCount: 0,
    bestAttemptNumber: null,
    bestScorePercent: null,
    latestAttemptNumber: null,
    latestScorePercent: null,
  });
});

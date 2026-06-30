import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateDailyPracticeStreak, getQuizBadgeCandidates } from './gamification.js';

test('calculateDailyPracticeStreak starts a daily practice streak on the first quiz day', () => {
  const result = calculateDailyPracticeStreak({
    currentStreakDays: 0,
    lastActivityDate: null,
    longestStreakDays: 0,
    occurredAt: new Date('2026-06-14T03:30:00.000Z'),
  });

  assert.equal(result.currentStreakDays, 1);
  assert.equal(result.longestStreakDays, 1);
  assert.equal(result.activityDate.toISOString(), '2026-06-14T00:00:00.000Z');
  assert.equal(result.isNewPracticeDay, true);
});

test('calculateDailyPracticeStreak extends across consecutive India calendar days', () => {
  const result = calculateDailyPracticeStreak({
    currentStreakDays: 2,
    lastActivityDate: new Date('2026-06-14T00:00:00.000Z'),
    longestStreakDays: 4,
    occurredAt: new Date('2026-06-14T18:45:00.000Z'),
  });

  assert.equal(result.currentStreakDays, 3);
  assert.equal(result.longestStreakDays, 4);
  assert.equal(result.activityDate.toISOString(), '2026-06-15T00:00:00.000Z');
  assert.equal(result.isNewPracticeDay, true);
});

test('calculateDailyPracticeStreak does not increment twice on the same practice day', () => {
  const result = calculateDailyPracticeStreak({
    currentStreakDays: 3,
    lastActivityDate: new Date('2026-06-14T00:00:00.000Z'),
    longestStreakDays: 3,
    occurredAt: new Date('2026-06-14T08:00:00.000Z'),
  });

  assert.equal(result.currentStreakDays, 3);
  assert.equal(result.longestStreakDays, 3);
  assert.equal(result.isNewPracticeDay, false);
});

test('getQuizBadgeCandidates awards first quiz, improvement, mastery, and comeback badges from quiz history', () => {
  const badges = getQuizBadgeCandidates({
    attemptNumber: 3,
    previousScores: [45, 58],
    scorePercent: 82,
    weakTopicSlugs: [],
  });

  assert.deepEqual(
    badges.map((badge) => badge.code),
    ['score_improvement', 'topic_mastery', 'comeback_after_weak_score'],
  );
});

test('getQuizBadgeCandidates awards the first quiz badge only for attempt one', () => {
  assert.deepEqual(
    getQuizBadgeCandidates({
      attemptNumber: 1,
      previousScores: [],
      scorePercent: 40,
      weakTopicSlugs: ['linear-equations'],
    }).map((badge) => badge.code),
    ['first_quiz'],
  );
});

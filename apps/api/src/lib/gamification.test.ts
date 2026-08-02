import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateDailyPracticeStreak,
  getEngagementBadgeCandidates,
  getPracticeBadgeCandidates,
  getQuizBadgeCandidates,
  getStreakBadgeCandidates,
} from './gamification.js';

test('calculateDailyPracticeStreak starts a study streak on the first counted activity day', () => {
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

test('calculateDailyPracticeStreak does not increment twice on the same study day', () => {
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

test('getQuizBadgeCandidates awards comeback badges from quiz history', () => {
  const badges = getQuizBadgeCandidates({
    attemptNumber: 3,
    previousScores: [45, 58],
    scorePercent: 82,
  });

  assert.deepEqual(
    badges.map((badge) => badge.code),
    ['comeback_after_weak_score'],
  );
});

test('getQuizBadgeCandidates awards the first quiz badge only for attempt one', () => {
  assert.deepEqual(
    getQuizBadgeCandidates({
      attemptNumber: 1,
      previousScores: [],
      scorePercent: 40,
    }).map((badge) => badge.code),
    ['first_quiz'],
  );
});

test('personal badges come only from matching persisted learning actions', () => {
  assert.deepEqual(
    getEngagementBadgeCandidates({ eventType: 'lesson_complete' }).map((badge) => badge.code),
    ['first_lesson_completed'],
  );
  assert.deepEqual(getEngagementBadgeCandidates({ eventType: 'lesson_start' }), []);
  assert.deepEqual(
    getPracticeBadgeCandidates({ practiceKind: 'written_practice' }).map((badge) => badge.code),
    ['first_written_practice'],
  );
  assert.deepEqual(getPracticeBadgeCandidates({ practiceKind: 'timed_diagnostic' }), []);
  assert.deepEqual(
    getStreakBadgeCandidates({ currentStreakDays: 3 }).map((badge) => badge.code),
    ['three_day_streak'],
  );
  assert.deepEqual(getStreakBadgeCandidates({ currentStreakDays: 2 }), []);
});

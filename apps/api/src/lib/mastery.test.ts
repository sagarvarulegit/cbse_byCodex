import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateChapterMastery, getMasteryLevel, getNextMasteryTarget } from './mastery.js';

test('calculateChapterMastery weights video at 30 and quiz at 70', () => {
  assert.equal(calculateChapterMastery({ videoCompletionPercent: 90, bestQuizScorePercent: 60 }), 69);
});

test('calculateChapterMastery clamps invalid values into the 0 to 100 range', () => {
  assert.equal(calculateChapterMastery({ videoCompletionPercent: 150, bestQuizScorePercent: -20 }), 30);
  assert.equal(calculateChapterMastery({ videoCompletionPercent: Number.NaN, bestQuizScorePercent: 80 }), 56);
});

test('getMasteryLevel maps thresholds to student-facing levels', () => {
  assert.equal(getMasteryLevel(0), 'learner');
  assert.equal(getMasteryLevel(39), 'learner');
  assert.equal(getMasteryLevel(40), 'skilled');
  assert.equal(getMasteryLevel(69), 'skilled');
  assert.equal(getMasteryLevel(70), 'exam_ready');
  assert.equal(getMasteryLevel(89), 'exam_ready');
  assert.equal(getMasteryLevel(90), 'topper_track');
});

test('getNextMasteryTarget returns the next level target', () => {
  assert.deepEqual(getNextMasteryTarget(39), { level: 'skilled', minimumScore: 40 });
  assert.deepEqual(getNextMasteryTarget(69), { level: 'exam_ready', minimumScore: 70 });
  assert.deepEqual(getNextMasteryTarget(89), { level: 'topper_track', minimumScore: 90 });
  assert.equal(getNextMasteryTarget(90), null);
});

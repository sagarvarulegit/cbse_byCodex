import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPracticeRetention } from './practice-retention.js';

function attempt(
  attemptNumber: number,
  day: number,
  scoreHalfMarks = 8,
) {
  return {
    attemptNumber,
    createdAt: new Date(Date.UTC(2026, 6, 1 + day)),
    maxScoreHalfMarks: 10,
    scoreHalfMarks,
  };
}

test('retention stays locked until a real 80 percent attempt exists', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0, 7)],
    new Date(Date.UTC(2026, 6, 10)),
  );

  assert.equal(retention.startedAt, null);
  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.status),
    ['locked', 'locked', 'locked'],
  );
});

test('separate on-time attempts complete D0, D3, and D7', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0), attempt(2, 3), attempt(3, 7)],
    new Date(Date.UTC(2026, 6, 8)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.completedByAttemptNumber),
    [1, 2, 3],
  );
  assert.ok(retention.checkpoints.every((checkpoint) => checkpoint.status === 'complete'));
});

test('one overdue retry cannot complete both D3 and D7', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0), attempt(2, 9)],
    new Date(Date.UTC(2026, 6, 12)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.status),
    ['complete', 'complete', 'due'],
  );
  assert.equal(retention.checkpoints[2].completedByAttemptNumber, null);
});

test('attempts excluded by integrity checks never complete retention', () => {
  const retention = buildPracticeRetention(
    [
      { ...attempt(1, 0), retentionEligible: false },
      attempt(2, 1),
    ],
    new Date(Date.UTC(2026, 6, 2)),
  );

  assert.equal(retention.checkpoints[0].completedByAttemptNumber, 2);
});

test('D7 stays locked until a separate D3 attempt exists', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0)],
    new Date(Date.UTC(2026, 6, 10)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.status),
    ['complete', 'due', 'locked'],
  );
});

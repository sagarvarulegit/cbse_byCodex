import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPracticeRetention } from './practice-retention';

function attempt(attemptNumber: number, day: number, scoreHalfMarks = 8) {
  return {
    attemptNumber,
    maxScoreHalfMarks: 10,
    savedAt: new Date(Date.UTC(2026, 6, 1 + day)).toISOString(),
    scoreHalfMarks,
  };
}

test('browser retention mirrors the separate-attempt D0 D3 D7 contract', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0), attempt(2, 3), attempt(3, 7)],
    new Date(Date.UTC(2026, 6, 8)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.completedByAttemptNumber),
    [1, 2, 3],
  );
});

test('browser retention does not let one late attempt satisfy two checkpoints', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0), attempt(2, 9)],
    new Date(Date.UTC(2026, 6, 12)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.status),
    ['complete', 'complete', 'due'],
  );
});

test('browser retention ignores attempts marked ineligible', () => {
  const retention = buildPracticeRetention(
    [
      { ...attempt(1, 0), retentionEligible: false },
      attempt(2, 1),
    ],
    new Date(Date.UTC(2026, 6, 2)),
  );

  assert.equal(retention.checkpoints[0].completedByAttemptNumber, 2);
});

test('browser D7 stays locked until D3 is completed', () => {
  const retention = buildPracticeRetention(
    [attempt(1, 0)],
    new Date(Date.UTC(2026, 6, 10)),
  );

  assert.deepEqual(
    retention.checkpoints.map((checkpoint) => checkpoint.status),
    ['complete', 'due', 'locked'],
  );
});

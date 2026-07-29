export const PRACTICE_RETENTION_THRESHOLD_PERCENT = 80;

export type PracticeRetentionAttempt = {
  attemptNumber: number;
  createdAt: Date;
  maxScoreHalfMarks: number;
  retentionEligible?: boolean;
  scoreHalfMarks: number;
};

export type PracticeRetentionCheckpoint = {
  checkpoint: 'D0' | 'D3' | 'D7';
  completedAt: string | null;
  completedByAttemptNumber: number | null;
  dueAt: string | null;
  status: 'complete' | 'due' | 'locked' | 'not-due';
};

export type PracticeRetentionSummary = {
  checkpoints: PracticeRetentionCheckpoint[];
  startedAt: string | null;
  thresholdPercent: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function qualifies(attempt: PracticeRetentionAttempt) {
  return (
    attempt.maxScoreHalfMarks > 0 &&
    attempt.retentionEligible !== false &&
    attempt.scoreHalfMarks * 100 >=
      attempt.maxScoreHalfMarks * PRACTICE_RETENTION_THRESHOLD_PERCENT
  );
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function buildPracticeRetention(
  attempts: PracticeRetentionAttempt[],
  now = new Date(),
): PracticeRetentionSummary {
  const qualifyingAttempts = [...attempts]
    .filter(qualifies)
    .sort(
      (left, right) =>
        left.createdAt.getTime() - right.createdAt.getTime() ||
        left.attemptNumber - right.attemptNumber,
    );
  const firstAttempt = qualifyingAttempts[0] ?? null;

  if (!firstAttempt) {
    return {
      checkpoints: [
        {
          checkpoint: 'D0',
          completedAt: null,
          completedByAttemptNumber: null,
          dueAt: null,
          status: 'locked',
        },
        {
          checkpoint: 'D3',
          completedAt: null,
          completedByAttemptNumber: null,
          dueAt: null,
          status: 'locked',
        },
        {
          checkpoint: 'D7',
          completedAt: null,
          completedByAttemptNumber: null,
          dueAt: null,
          status: 'locked',
        },
      ],
      startedAt: null,
      thresholdPercent: PRACTICE_RETENTION_THRESHOLD_PERCENT,
    };
  }

  const d3DueAt = addDays(firstAttempt.createdAt, 3);
  const d7DueAt = addDays(firstAttempt.createdAt, 7);
  const d3Attempt =
    qualifyingAttempts.find(
      (attempt) =>
        attempt.attemptNumber !== firstAttempt.attemptNumber &&
        attempt.createdAt >= d3DueAt,
    ) ?? null;
  const d7Attempt =
    qualifyingAttempts.find(
      (attempt) =>
        attempt.attemptNumber !== firstAttempt.attemptNumber &&
        attempt.attemptNumber !== d3Attempt?.attemptNumber &&
        attempt.createdAt >= d7DueAt &&
        (!d3Attempt || attempt.attemptNumber > d3Attempt.attemptNumber),
    ) ?? null;

  return {
    checkpoints: [
      {
        checkpoint: 'D0',
        completedAt: firstAttempt.createdAt.toISOString(),
        completedByAttemptNumber: firstAttempt.attemptNumber,
        dueAt: firstAttempt.createdAt.toISOString(),
        status: 'complete',
      },
      {
        checkpoint: 'D3',
        completedAt: d3Attempt?.createdAt.toISOString() ?? null,
        completedByAttemptNumber: d3Attempt?.attemptNumber ?? null,
        dueAt: d3DueAt.toISOString(),
        status: d3Attempt ? 'complete' : now >= d3DueAt ? 'due' : 'not-due',
      },
      {
        checkpoint: 'D7',
        completedAt: d7Attempt?.createdAt.toISOString() ?? null,
        completedByAttemptNumber: d7Attempt?.attemptNumber ?? null,
        dueAt: d7DueAt.toISOString(),
        status: d7Attempt
          ? 'complete'
          : !d3Attempt
            ? 'locked'
            : now >= d7DueAt
              ? 'due'
              : 'not-due',
      },
    ],
    startedAt: firstAttempt.createdAt.toISOString(),
    thresholdPercent: PRACTICE_RETENTION_THRESHOLD_PERCENT,
  };
}

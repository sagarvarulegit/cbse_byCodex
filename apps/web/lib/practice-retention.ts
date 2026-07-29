export const PRACTICE_RETENTION_THRESHOLD_PERCENT = 80;

export type PracticeRetentionAttempt = {
  attemptNumber: number;
  maxScoreHalfMarks: number;
  retentionEligible?: boolean;
  savedAt: string;
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

export function buildPracticeRetention(
  attempts: PracticeRetentionAttempt[],
  now = new Date(),
): PracticeRetentionSummary {
  const qualifyingAttempts = attempts
    .map((attempt) => ({ ...attempt, savedDate: new Date(attempt.savedAt) }))
    .filter(
      (attempt) =>
        qualifies(attempt) && Number.isFinite(attempt.savedDate.getTime()),
    )
    .sort(
      (left, right) =>
        left.savedDate.getTime() - right.savedDate.getTime() ||
        left.attemptNumber - right.attemptNumber,
    );
  const firstAttempt = qualifyingAttempts[0] ?? null;

  if (!firstAttempt) {
    return {
      checkpoints: (['D0', 'D3', 'D7'] as const).map((checkpoint) => ({
        checkpoint,
        completedAt: null,
        completedByAttemptNumber: null,
        dueAt: null,
        status: 'locked',
      })),
      startedAt: null,
      thresholdPercent: PRACTICE_RETENTION_THRESHOLD_PERCENT,
    };
  }

  const d3DueAt = new Date(firstAttempt.savedDate.getTime() + 3 * DAY_MS);
  const d7DueAt = new Date(firstAttempt.savedDate.getTime() + 7 * DAY_MS);
  const d3Attempt =
    qualifyingAttempts.find(
      (attempt) =>
        attempt.attemptNumber !== firstAttempt.attemptNumber &&
        attempt.savedDate >= d3DueAt,
    ) ?? null;
  const d7Attempt =
    qualifyingAttempts.find(
      (attempt) =>
        attempt.attemptNumber !== firstAttempt.attemptNumber &&
        attempt.attemptNumber !== d3Attempt?.attemptNumber &&
        attempt.savedDate >= d7DueAt &&
        (!d3Attempt || attempt.attemptNumber > d3Attempt.attemptNumber),
    ) ?? null;

  return {
    checkpoints: [
      {
        checkpoint: 'D0',
        completedAt: firstAttempt.savedDate.toISOString(),
        completedByAttemptNumber: firstAttempt.attemptNumber,
        dueAt: firstAttempt.savedDate.toISOString(),
        status: 'complete',
      },
      {
        checkpoint: 'D3',
        completedAt: d3Attempt?.savedDate.toISOString() ?? null,
        completedByAttemptNumber: d3Attempt?.attemptNumber ?? null,
        dueAt: d3DueAt.toISOString(),
        status: d3Attempt ? 'complete' : now >= d3DueAt ? 'due' : 'not-due',
      },
      {
        checkpoint: 'D7',
        completedAt: d7Attempt?.savedDate.toISOString() ?? null,
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
    startedAt: firstAttempt.savedDate.toISOString(),
    thresholdPercent: PRACTICE_RETENTION_THRESHOLD_PERCENT,
  };
}

export type QuizAttemptRecord = {
  attemptNumber: number;
  correctAnswers: number;
  createdAt: Date;
  scorePercent: number;
  totalQuestions: number;
  weakTopicSlugs: string[];
};

export type QuizAttemptSummary = {
  attemptNumber: number;
  correctAnswers: number;
  createdAt: string;
  scorePercent: number;
  totalQuestions: number;
  weakTopicSlugs: string[];
};

export type QuizAttemptHistoryStats = {
  attemptCount: number;
  bestAttemptNumber: number | null;
  bestScorePercent: number | null;
  latestAttemptNumber: number | null;
  latestScorePercent: number | null;
};

export type QuizAttemptHistory = {
  attempts: QuizAttemptSummary[];
  stats: QuizAttemptHistoryStats;
};

function compareLatestAttempts(left: QuizAttemptRecord, right: QuizAttemptRecord) {
  if (left.attemptNumber !== right.attemptNumber) {
    return right.attemptNumber - left.attemptNumber;
  }

  return right.createdAt.getTime() - left.createdAt.getTime();
}

function compareBestAttempts(left: QuizAttemptRecord, right: QuizAttemptRecord) {
  if (left.scorePercent !== right.scorePercent) {
    return right.scorePercent - left.scorePercent;
  }

  return compareLatestAttempts(left, right);
}

export function summarizeQuizAttempts(records: QuizAttemptRecord[]): QuizAttemptHistory {
  const latestAttempts = [...records].sort(compareLatestAttempts);
  const [latestAttempt] = latestAttempts;
  const [bestAttempt] = [...records].sort(compareBestAttempts);

  return {
    attempts: latestAttempts.map((attempt) => ({
      attemptNumber: attempt.attemptNumber,
      correctAnswers: attempt.correctAnswers,
      createdAt: attempt.createdAt.toISOString(),
      scorePercent: attempt.scorePercent,
      totalQuestions: attempt.totalQuestions,
      weakTopicSlugs: attempt.weakTopicSlugs,
    })),
    stats: {
      attemptCount: records.length,
      bestAttemptNumber: bestAttempt?.attemptNumber ?? null,
      bestScorePercent: bestAttempt?.scorePercent ?? null,
      latestAttemptNumber: latestAttempt?.attemptNumber ?? null,
      latestScorePercent: latestAttempt?.scorePercent ?? null,
    },
  };
}

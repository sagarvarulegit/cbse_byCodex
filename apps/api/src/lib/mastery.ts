export type MasteryLevelCode = 'learner' | 'skilled' | 'exam_ready' | 'topper_track';

export type MasteryInput = {
  bestQuizScorePercent: number | null | undefined;
  videoCompletionPercent: number | null | undefined;
};

export type NextMasteryTarget = {
  level: MasteryLevelCode;
  minimumScore: number;
};

function clampPercent(value: number | null | undefined) {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, numericValue));
}

export function calculateChapterMastery(input: MasteryInput) {
  const videoScore = clampPercent(input.videoCompletionPercent);
  const quizScore = clampPercent(input.bestQuizScorePercent);

  return Math.round(videoScore * 0.3 + quizScore * 0.7);
}

export function getMasteryLevel(score: number): MasteryLevelCode {
  const normalizedScore = clampPercent(score);

  if (normalizedScore >= 90) {
    return 'topper_track';
  }

  if (normalizedScore >= 70) {
    return 'exam_ready';
  }

  if (normalizedScore >= 40) {
    return 'skilled';
  }

  return 'learner';
}

export function getNextMasteryTarget(score: number): NextMasteryTarget | null {
  const normalizedScore = clampPercent(score);

  if (normalizedScore < 40) {
    return { level: 'skilled', minimumScore: 40 };
  }

  if (normalizedScore < 70) {
    return { level: 'exam_ready', minimumScore: 70 };
  }

  if (normalizedScore < 90) {
    return { level: 'topper_track', minimumScore: 90 };
  }

  return null;
}

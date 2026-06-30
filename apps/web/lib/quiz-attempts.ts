import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

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
  chapter?: {
    slug: string;
    title: string;
  };
  stats: QuizAttemptHistoryStats;
};

export const EMPTY_QUIZ_ATTEMPT_HISTORY: QuizAttemptHistory = {
  attempts: [],
  stats: {
    attemptCount: 0,
    bestAttemptNumber: null,
    bestScorePercent: null,
    latestAttemptNumber: null,
    latestScorePercent: null,
  },
};

export async function getStudentQuizAttempts(chapterSlug: string): Promise<QuizAttemptHistory> {
  const token = await getStudentSessionToken();
  if (!token) {
    return EMPTY_QUIZ_ATTEMPT_HISTORY;
  }

  const url = new URL('/v1/progress/quiz-attempts', API_BASE_URL);
  url.searchParams.set('chapterSlug', chapterSlug);

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!response?.ok) {
    return EMPTY_QUIZ_ATTEMPT_HISTORY;
  }

  return (await response.json().catch(() => EMPTY_QUIZ_ATTEMPT_HISTORY)) as QuizAttemptHistory;
}

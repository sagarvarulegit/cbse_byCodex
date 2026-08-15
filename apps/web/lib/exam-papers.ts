const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type ExamPaperAnswerKey = {
  options?: string[];
  correctOptionIndex?: number;
  valuePoints: string[];
  modelAnswer: string;
};

export type ExamPaperQuestion = {
  questionNumber: number;
  sectionId: string;
  questionType: string;
  marks: number;
  statement: string;
  answerKey: ExamPaperAnswerKey;
  sourceKind: string;
  chapterSlug?: string | null;
};

export type ExamPaperSection = {
  id: string;
  title: string;
  instructions: string;
  questionCount: number;
  marksPerQuestion: number;
};

export type ExamPaper = {
  id: string;
  title: string;
  seed: number;
  totalMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  layoutVersion: string;
  sections: ExamPaperSection[];
  questions: ExamPaperQuestion[];
  verificationStatus: 'unverified' | 'review' | 'verified' | 'rejected';
  verification: unknown;
  publishStatus: string;
  createdAt: string;
};

export type ExamPaperSummary = {
  id: string;
  title: string;
  seed: number;
  totalMarks: number;
  verificationStatus: string;
  publishStatus: string;
  createdAt: string;
};

export type MockTestSeriesPaper = {
  number: number;
  seed: number;
  title: string;
  id?: string;
  verificationStatus?: string;
  publishStatus?: string;
  totalMarks?: number;
  durationMinutes?: number;
  isFreeSample?: boolean;
};

export type MockTestSeries = {
  key: string;
  title: string;
  description: string;
  subjectSlug: string;
  freeSampleNumber: number;
};

type GenerateResponse = {
  paper: ExamPaper;
  verificationNote?: string;
};

/**
 * This module must stay importable by client components, so it never imports
 * `next/headers`. The session token is read on the server (lib/auth) and
 * passed in by the page — client components cannot read the httpOnly cookie.
 */
async function apiFetch<T>(
  token: string | null,
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return (await response.json().catch(() => null)) as T | null;
}

export async function generateExamPaper(
  token: string | null,
  subjectSlug: string,
  seed?: number,
) {
  return apiFetch<GenerateResponse>(token, '/v1/exam-papers/generate', {
    method: 'POST',
    body: JSON.stringify({ subjectSlug, ...(seed ? { seed } : {}) }),
  });
}

export async function getExamPaper(token: string | null, id: string) {
  return apiFetch<{ paper: ExamPaper }>(
    token,
    `/v1/exam-papers/${encodeURIComponent(id)}`,
  );
}

export async function listExamPapers(token: string | null) {
  return apiFetch<{ papers: ExamPaperSummary[] }>(token, '/v1/exam-papers');
}

export async function getMockTestSeries(token: string | null) {
  return apiFetch<{ series: MockTestSeries; papers: MockTestSeriesPaper[] }>(
    token,
    '/v1/exam-papers/series',
  );
}

export type ExamPaperQuestionResult = {
  questionNumber: number;
  sectionId: string;
  questionType: string;
  chapterSlug: string;
  marks: number;
  earnedMarks: number;
  correct: boolean;
};

export type SavedExamPaperAttempt = {
  id: string;
  clientAttemptId: string;
  attemptNumber: number;
  examPaperId: string;
  totalMarks: number;
  earnedMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
  writtenSelfMarked: boolean;
  createdAt: string;
};

export type ExamPaperAttemptPayload = {
  clientAttemptId: string;
  totalMarks: number;
  earnedMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
  writtenSelfMarked: boolean;
  questionResults: ExamPaperQuestionResult[];
};

export type SubmitAttemptResponse = {
  attempt: SavedExamPaperAttempt;
  created: boolean;
  matches: boolean;
  weakAreas: { weakChapterSlugs: string[]; weakQuestionTypes: string[] };
};

export async function submitExamPaperAttempt(
  token: string | null,
  examPaperId: string,
  payload: ExamPaperAttemptPayload,
) {
  return apiFetch<SubmitAttemptResponse>(
    token,
    `/v1/exam-papers/${encodeURIComponent(examPaperId)}/attempt`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export type ExamPaperAttemptSummary = {
  id: string;
  clientAttemptId: string;
  attemptNumber: number;
  examPaperId: string;
  paperTitle: string;
  paperSeed: number;
  totalMarks: number;
  earnedMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
  writtenSelfMarked: boolean;
  weakChapterSlugs: string[];
  weakQuestionTypes: string[];
  createdAt: string;
};

export type ExamPaperAttemptsResponse = {
  attempts: ExamPaperAttemptSummary[];
  weakAreas: { weakChapterSlugs: string[]; weakQuestionTypes: string[] };
  aggregate: {
    attempts: number;
    averagePercent: number;
    bestPercent: number;
  } | null;
};

export async function listExamPaperAttempts(token: string | null, paperId?: string) {
  const params = new URLSearchParams();
  if (paperId) {
    params.set('paperId', paperId);
  }
  const query = params.toString();
  return apiFetch<ExamPaperAttemptsResponse>(
    token,
    `/v1/exam-papers/attempts${query ? `?${query}` : ''}`,
  );
}

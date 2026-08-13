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

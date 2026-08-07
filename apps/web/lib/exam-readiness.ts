import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type ExamReadyItemId =
  | 'conceptsStudied'
  | 'ncertQuestionsAttempted'
  | 'writtenAnswerCompleted'
  | 'chapterQuizTargetReached'
  | 'weakAreasRevised'
  | 'threeDayRecallCompleted';

export type ExamReadyChecklistState = {
  chapterSlug: string;
  completedCount: number;
  items: Array<{
    automatic: boolean;
    complete: boolean;
    description: string;
    id: ExamReadyItemId;
    label: string;
  }>;
  quizTargetPercent: number;
  totalCount: number;
};

export async function getStudentExamReadiness(
  chapterSlug: string,
): Promise<ExamReadyChecklistState | null> {
  const token = await getStudentSessionToken();
  if (!token) {
    return null;
  }
  const url = new URL('/v1/progress/exam-readiness', API_BASE_URL);
  url.searchParams.set('chapterSlug', chapterSlug);
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  return (await response.json().catch(() => null)) as ExamReadyChecklistState | null;
}

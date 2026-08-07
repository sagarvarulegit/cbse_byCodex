import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type MistakeKind =
  | 'quiz_question'
  | 'weak_concept'
  | 'hint_used'
  | 'written_marking_point';

export type MistakeReviewItem = {
  chapterSlug: string;
  chapterTitle: string;
  conceptSlug: string | null;
  detail: string | null;
  due: boolean;
  id: string;
  kind: MistakeKind;
  lastSeenAt: string;
  metadata: Record<string, unknown> | null;
  occurrenceCount: number;
  resolvedAt: string | null;
  retryAt: string;
  reviewHref: string;
  sourceItemId: string | null;
  subject: string;
  title: string;
};

export type MistakesPayload = {
  items: MistakeReviewItem[];
  status: 'active' | 'resolved' | 'all';
};

export async function getStudentMistakes(
  status: MistakesPayload['status'] = 'active',
): Promise<MistakesPayload> {
  const token = await getStudentSessionToken();
  if (!token) {
    return { items: [], status };
  }
  const url = new URL('/v1/progress/mistakes', API_BASE_URL);
  url.searchParams.set('status', status);
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (!response?.ok) {
    return { items: [], status };
  }

  return (await response.json().catch(() => ({ items: [], status }))) as MistakesPayload;
}

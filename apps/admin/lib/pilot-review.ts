import { getAdminSessionToken } from './auth';

export type PilotReviewPayload = {
  generatedAt: string;
  windowDays: number;
  summary: {
    totalEvents: number;
    feedbackCount: number;
    averageRating: number | null;
    activeStudents: number;
    mostActiveChapter: string | null;
    mostCommonEventType: string | null;
  };
  eventBreakdown: Array<{
    eventType: string;
    count: number;
  }>;
  chapterBreakdown: Array<{
    chapterSlug: string | null;
    chapterTitle: string | null;
    count: number;
  }>;
  surfaceBreakdown: Array<{
    surface: string | null;
    count: number;
  }>;
  recentFeedback: PilotReviewFeedback[];
  frictionSignals: PilotReviewFeedback[];
};

export type PilotReviewFeedback = {
    category: string | null;
    chapterSlug: string | null;
    lessonSlug: string | null;
    message: string;
    occurredAt: string;
    path: string | null;
    rating: number | null;
    surface: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export function createEmptyPilotReview(windowDays = 14): PilotReviewPayload {
  return {
    generatedAt: new Date().toISOString(),
    windowDays,
    summary: {
      activeStudents: 0,
      averageRating: null,
      feedbackCount: 0,
      mostActiveChapter: null,
      mostCommonEventType: null,
      totalEvents: 0,
    },
    eventBreakdown: [],
    chapterBreakdown: [],
    frictionSignals: [],
    surfaceBreakdown: [],
    recentFeedback: [],
  };
}

export async function getPilotReview(windowDays = 14) {
  const token = await getAdminSessionToken();
  if (!token) {
    return createEmptyPilotReview(windowDays);
  }

  const url = new URL('/v1/progress/pilot-review', API_BASE_URL);
  url.searchParams.set('windowDays', String(windowDays));

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return createEmptyPilotReview(windowDays);
    }

    return (await response.json()) as PilotReviewPayload;
  } catch {
    return createEmptyPilotReview(windowDays);
  }
}

export type PilotReviewEvent = {
  eventType: string;
  metadata: unknown;
  occurredAt: Date;
  userId: string;
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

const DEFAULT_WINDOW_DAYS = 14;
const MAX_WINDOW_DAYS = 30;

type PilotMetadata = {
  category?: unknown;
  chapterSlug?: unknown;
  chapterTitle?: unknown;
  lessonSlug?: unknown;
  message?: unknown;
  path?: unknown;
  rating?: unknown;
  source?: unknown;
  surface?: unknown;
};

function readMetadata(value: unknown): PilotMetadata {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as PilotMetadata;
}

function readOptionalText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readRating(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function isPilotReviewEvent(event: PilotReviewEvent) {
  const metadata = readMetadata(event.metadata);
  return event.eventType === 'feedback_submission' || metadata.source === 'free_student_pilot';
}

export function canViewPilotReview(user: { role: string } | null) {
  return user?.role === 'admin';
}

export function normalizePilotReviewWindowDays(value: unknown) {
  if (typeof value !== 'string') {
    return DEFAULT_WINDOW_DAYS;
  }

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return DEFAULT_WINDOW_DAYS;
  }

  return Math.min(numericValue, MAX_WINDOW_DAYS);
}

function incrementCount(counts: Map<string, number>, key: string) {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function sortedBreakdown(counts: Map<string, number>) {
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
}

function getTopKey(counts: Map<string, number>) {
  return sortedBreakdown(counts)[0]?.key ?? null;
}

function isFrictionSignal(feedback: PilotReviewFeedback) {
  return (
    feedback.category === 'bug' ||
    feedback.category === 'stuck' ||
    (feedback.rating !== null && feedback.rating <= 2)
  );
}

function compareFrictionSignals(left: PilotReviewFeedback, right: PilotReviewFeedback) {
  const leftRating = left.rating ?? Number.POSITIVE_INFINITY;
  const rightRating = right.rating ?? Number.POSITIVE_INFINITY;

  if (leftRating !== rightRating) {
    return leftRating - rightRating;
  }

  if (left.category !== right.category) {
    return left.category === 'bug' ? -1 : 1;
  }

  return right.occurredAt.localeCompare(left.occurredAt);
}

export function buildPilotReviewPayload({
  events,
  generatedAt = new Date(),
  windowDays,
}: {
  events: PilotReviewEvent[];
  generatedAt?: Date;
  windowDays: number;
}): PilotReviewPayload {
  const pilotEvents = events.filter(isPilotReviewEvent);
  const eventCounts = new Map<string, number>();
  const chapterCounts = new Map<string, number>();
  const chapterTitles = new Map<string, string | null>();
  const surfaceCounts = new Map<string, number>();
  const activeStudentIds = new Set<string>();
  const ratings: number[] = [];
  const recentFeedback: PilotReviewPayload['recentFeedback'] = [];

  for (const event of pilotEvents) {
    const metadata = readMetadata(event.metadata);
    const chapterSlug = readOptionalText(metadata.chapterSlug);
    const chapterTitle = readOptionalText(metadata.chapterTitle);
    const chapterKey = chapterSlug ?? '__none__';
    const surface = readOptionalText(metadata.surface);
    const surfaceKey = surface ?? '__none__';

    activeStudentIds.add(event.userId);
    incrementCount(eventCounts, event.eventType);
    incrementCount(chapterCounts, chapterKey);
    incrementCount(surfaceCounts, surfaceKey);
    if (!chapterTitles.has(chapterKey)) {
      chapterTitles.set(chapterKey, chapterTitle);
    }

    if (event.eventType !== 'feedback_submission') {
      continue;
    }

    const message = readOptionalText(metadata.message);
    if (!message) {
      continue;
    }

    const rating = readRating(metadata.rating);
    if (rating !== null) {
      ratings.push(rating);
    }

    recentFeedback.push({
      category: readOptionalText(metadata.category),
      chapterSlug,
      lessonSlug: readOptionalText(metadata.lessonSlug),
      message,
      occurredAt: event.occurredAt.toISOString(),
      path: readOptionalText(metadata.path),
      rating,
      surface,
    });
  }

  const averageRating =
    ratings.length > 0 ? Math.round((ratings.reduce((total, rating) => total + rating, 0) / ratings.length) * 10) / 10 : null;

  recentFeedback.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const frictionSignals = recentFeedback.filter(isFrictionSignal).sort(compareFrictionSignals).slice(0, 5);

  return {
    generatedAt: generatedAt.toISOString(),
    windowDays,
    summary: {
      activeStudents: activeStudentIds.size,
      averageRating,
      feedbackCount: recentFeedback.length,
      mostActiveChapter: getTopKey(chapterCounts)?.replace('__none__', '') || null,
      mostCommonEventType: getTopKey(eventCounts),
      totalEvents: pilotEvents.length,
    },
    eventBreakdown: sortedBreakdown(eventCounts).map((item) => ({
      count: item.count,
      eventType: item.key,
    })),
    chapterBreakdown: sortedBreakdown(chapterCounts).map((item) => ({
      chapterSlug: item.key === '__none__' ? null : item.key,
      chapterTitle: chapterTitles.get(item.key) ?? null,
      count: item.count,
    })),
    surfaceBreakdown: sortedBreakdown(surfaceCounts).map((item) => ({
      count: item.count,
      surface: item.key === '__none__' ? null : item.key,
    })),
    recentFeedback: recentFeedback.slice(0, 12),
    frictionSignals,
  };
}

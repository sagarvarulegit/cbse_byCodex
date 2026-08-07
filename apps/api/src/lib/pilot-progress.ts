export const PILOT_ENGAGEMENT_EVENT_TYPES = [
  'lesson_start',
  'lesson_complete',
  'quiz_start',
  'dashboard_view',
  'chapter_open',
  'focus_mix_start',
  'focus_mix_complete',
] as const;

export const PILOT_FEEDBACK_SURFACES = ['lesson', 'quiz', 'dashboard'] as const;
export const PILOT_FEEDBACK_CATEGORIES = ['stuck', 'feedback', 'bug'] as const;
export const PILOT_STUCK_REASONS = [
  'explanation_unclear',
  'question_unclear',
  'activity_unusable',
  'answer_incorrect',
  'need_example',
] as const;

type PilotEngagementEventType = (typeof PILOT_ENGAGEMENT_EVENT_TYPES)[number];
type PilotFeedbackSurface = (typeof PILOT_FEEDBACK_SURFACES)[number];
type PilotFeedbackCategory = (typeof PILOT_FEEDBACK_CATEGORIES)[number];
type PilotStuckReason = (typeof PILOT_STUCK_REASONS)[number];
type PilotEngagementSurface = PilotFeedbackSurface | 'chapter' | 'study_remix';

type Result<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export type NormalizedPilotEngagement = {
  chapterSlug: string | null;
  eventType: PilotEngagementEventType;
  lessonSlug: string | null;
  path: string | null;
  surface: PilotEngagementSurface;
};

export type NormalizedPilotFeedback = {
  category: PilotFeedbackCategory;
  chapterSlug: string | null;
  lessonSlug: string | null;
  message: string;
  path: string | null;
  rating: number | null;
  stuckReason: PilotStuckReason | null;
  surface: PilotFeedbackSurface;
};

const STUCK_REASON_MESSAGES: Record<PilotStuckReason, string> = {
  activity_unusable: 'I cannot use this activity.',
  answer_incorrect: 'The answer looks incorrect.',
  explanation_unclear: 'I do not understand the explanation.',
  need_example: 'I need another example.',
  question_unclear: 'I do not understand the question.',
};

function readRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readText(value: unknown, maxLength = 160) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function readOptionalText(value: unknown, maxLength = 160) {
  return readText(value, maxLength);
}

function readPath(value: unknown) {
  const path = readText(value, 300);
  if (!path || !path.startsWith('/')) {
    return null;
  }

  return path;
}

function readRating(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const rating = Number(value);
  if (!Number.isInteger(rating)) {
    return null;
  }

  return Math.max(1, Math.min(5, rating));
}

function isPilotEngagementEventType(value: string): value is PilotEngagementEventType {
  return PILOT_ENGAGEMENT_EVENT_TYPES.includes(value as PilotEngagementEventType);
}

function isPilotEngagementSurface(value: string): value is PilotEngagementSurface {
  return [...PILOT_FEEDBACK_SURFACES, 'chapter', 'study_remix'].includes(
    value as PilotEngagementSurface,
  );
}

function isPilotFeedbackSurface(value: string): value is PilotFeedbackSurface {
  return PILOT_FEEDBACK_SURFACES.includes(value as PilotFeedbackSurface);
}

function isPilotFeedbackCategory(value: string): value is PilotFeedbackCategory {
  return PILOT_FEEDBACK_CATEGORIES.includes(value as PilotFeedbackCategory);
}

function isPilotStuckReason(value: string): value is PilotStuckReason {
  return PILOT_STUCK_REASONS.includes(value as PilotStuckReason);
}

export function normalizePilotEngagementPayload(value: unknown): Result<NormalizedPilotEngagement> {
  const body = readRecord(value);
  if (!body) {
    return { data: null, error: 'Invalid engagement payload.' };
  }

  const eventType = readText(body.eventType);
  if (!eventType || !isPilotEngagementEventType(eventType)) {
    return {
      data: null,
      error:
        'eventType must be lesson_start, lesson_complete, quiz_start, dashboard_view, chapter_open, focus_mix_start, or focus_mix_complete.',
    };
  }

  const surface = readText(body.surface);
  if (!surface || !isPilotEngagementSurface(surface)) {
    return {
      data: null,
      error: 'surface must be lesson, quiz, dashboard, chapter, or study_remix.',
    };
  }

  return {
    data: {
      chapterSlug: readOptionalText(body.chapterSlug),
      eventType,
      lessonSlug: readOptionalText(body.lessonSlug),
      path: readPath(body.path),
      surface,
    },
    error: null,
  };
}

export function normalizePilotFeedbackPayload(value: unknown): Result<NormalizedPilotFeedback> {
  const body = readRecord(value);
  if (!body) {
    return { data: null, error: 'Invalid feedback payload.' };
  }

  const surface = readText(body.surface);
  if (!surface || !isPilotFeedbackSurface(surface)) {
    return { data: null, error: 'surface must be lesson, quiz, or dashboard.' };
  }

  const category = readText(body.category) ?? 'feedback';
  if (!isPilotFeedbackCategory(category)) {
    return { data: null, error: 'category must be stuck, feedback, or bug.' };
  }

  const rawStuckReason = readText(body.stuckReason);
  const stuckReason =
    rawStuckReason && isPilotStuckReason(rawStuckReason) ? rawStuckReason : null;
  if (category === 'stuck' && !stuckReason) {
    return { data: null, error: 'Choose what you are stuck on.' };
  }

  const message =
    readText(body.message, 1200) ??
    (stuckReason ? STUCK_REASON_MESSAGES[stuckReason] : null);
  if (!message || (category !== 'stuck' && message.length < 8)) {
    return { data: null, error: 'Please share at least 8 characters of feedback.' };
  }

  return {
    data: {
      category,
      chapterSlug: readOptionalText(body.chapterSlug),
      lessonSlug: readOptionalText(body.lessonSlug),
      message,
      path: readPath(body.path),
      rating: readRating(body.rating),
      stuckReason,
      surface,
    },
    error: null,
  };
}

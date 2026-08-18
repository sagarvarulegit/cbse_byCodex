import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type MasteryLevel = 'learner' | 'skilled' | 'exam_ready' | 'topper_track';

export type ChapterMasterySummary = {
  bestQuizScorePercent: number;
  chapterSlug: string;
  chapterTitle: string;
  lastActivityAt: string | null;
  level: MasteryLevel;
  masteryScore: number;
  subjectName: string;
  videoCompletionPercent: number;
};

export type RevisionMissionSummary = {
  chapterSlug: string;
  chapterTitle: string;
  id: string;
  reason: string;
  recommendedActions?: Array<{
    href: string;
    label: string;
    step: string;
  }>;
  recommendedSteps: string[];
  status: string;
  subjectName: string;
  targetScore: number;
};

export type StudyStreakSummary = {
  currentStreakDays: number;
  lastActivityDate: string | null;
  longestStreakDays: number;
};

export type BadgeSummary = {
  awardedAt: string;
  chapterSlug: string | null;
  chapterTitle: string | null;
  code: string;
  description: string;
  name: string;
};

export type MasteryPayload = {
  badges: BadgeSummary[];
  masteries: ChapterMasterySummary[];
  revisionMissions: RevisionMissionSummary[];
  streak: StudyStreakSummary | null;
};

const EMPTY_MASTERY_PAYLOAD: MasteryPayload = {
  badges: [],
  masteries: [],
  revisionMissions: [],
  streak: null,
};

export function formatMasteryLevel(level: MasteryLevel) {
  const labels: Record<MasteryLevel, string> = {
    exam_ready: 'Exam Ready',
    learner: 'Learner',
    skilled: 'Skilled',
    topper_track: 'Topper Track',
  };

  return labels[level];
}

export function getNextMasteryLabel(score: number) {
  if (score < 40) {
    return 'Reach Skilled at 40%';
  }

  if (score < 70) {
    return 'Reach Exam Ready at 70%';
  }

  if (score < 90) {
    return 'Reach Topper Track at 90%';
  }

  return 'Maintain Topper Track';
}

export function getChapterMasteryDisplay(chapterMastery?: ChapterMasterySummary) {
  if (!chapterMastery) {
    return {
      hasProgress: false,
      label: 'Not started',
      score: 0,
    } as const;
  }

  return {
    hasProgress: true,
    label: formatMasteryLevel(chapterMastery.level),
    score: chapterMastery.masteryScore,
  } as const;
}

const masteryCache = new Map<string, { data: MasteryPayload; timestamp: number }>();
const MASTERY_CACHE_TTL_MS = 15 * 1000; // 15s cache

export function invalidateMasteryCache(token?: string | null) {
  if (token) {
    for (const key of masteryCache.keys()) {
      if (key.startsWith(token)) masteryCache.delete(key);
    }
  } else {
    masteryCache.clear();
  }
}

export async function getStudentMastery(chapterSlug?: string): Promise<MasteryPayload> {
  const token = await getStudentSessionToken();
  if (!token) {
    return EMPTY_MASTERY_PAYLOAD;
  }

  const cacheKey = `${token}:${chapterSlug || 'global'}`;
  const now = Date.now();
  const cached = masteryCache.get(cacheKey);
  if (cached && now - cached.timestamp < MASTERY_CACHE_TTL_MS) {
    return cached.data;
  }

  const url = new URL('/v1/progress/mastery', API_BASE_URL);
  if (chapterSlug) {
    url.searchParams.set('chapterSlug', chapterSlug);
  }

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!response?.ok) {
    return EMPTY_MASTERY_PAYLOAD;
  }

  const data = (await response.json().catch(() => EMPTY_MASTERY_PAYLOAD)) as MasteryPayload;
  masteryCache.set(cacheKey, { data, timestamp: now });
  return data;
}

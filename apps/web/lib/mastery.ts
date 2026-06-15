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

export async function getStudentMastery(chapterSlug?: string): Promise<MasteryPayload> {
  const token = await getStudentSessionToken();
  if (!token) {
    return EMPTY_MASTERY_PAYLOAD;
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

  return (await response.json().catch(() => EMPTY_MASTERY_PAYLOAD)) as MasteryPayload;
}

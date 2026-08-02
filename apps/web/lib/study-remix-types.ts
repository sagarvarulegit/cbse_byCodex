export const STUDY_REMIX_STORAGE_VERSION = 1 as const;

export type StudyRemixAccent = 'english' | 'math' | 'science';

export type StudyRemixChapterSlug =
  | 'chemical-reactions-and-equations'
  | 'real-numbers'
  | 'two-stories-about-flying';

export type StudyRemixTrack = {
  durationMinutes: number;
  href: string;
  id: string;
  subtitle: string;
  title: string;
};

export type StudyRemixCue = {
  copy: string;
  href: string;
  source: 'curated' | 'revision_mission';
  title: string;
};

export type StudyRemixMix = {
  accent: StudyRemixAccent;
  chapterCode: string;
  chapterSlug: StudyRemixChapterSlug;
  chapterTitle: string;
  coverTitle: string;
  cue: StudyRemixCue;
  masteryLabel: string;
  masteryScore: number;
  nextBreakLabel: string;
  recordCode: string;
  subject: string;
  subjectLabel: string;
  totalMinutes: number;
  tracks: StudyRemixTrack[];
};

export type StudyRemixDashboardModel = {
  activeMissionCount: number;
  badgeCount: number;
  defaultChapterSlug: StudyRemixChapterSlug;
  mixes: StudyRemixMix[];
  student: {
    classLevel: number;
    firstName: string;
    fullName: string;
    id: string;
    initials: string;
    streakLabel: string;
  };
};

export type StudyRemixPlayerStatus = 'complete' | 'paused' | 'playing';

export type StudyRemixPlayerSession = {
  completionEventSent: boolean;
  elapsedSeconds: number;
  mix: StudyRemixMix;
  status: StudyRemixPlayerStatus;
  studentId: string;
  version: typeof STUDY_REMIX_STORAGE_VERSION;
};

export type StudyRemixTomorrowCue = {
  chapterSlug: StudyRemixChapterSlug;
  chapterTitle: string;
  cue: StudyRemixCue;
  savedForDate: string;
  subject: string;
  version: typeof STUDY_REMIX_STORAGE_VERSION;
};

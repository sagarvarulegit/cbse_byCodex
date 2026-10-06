import { getChapter, getChapterEntries } from './course-content';
import { getVisibleCurriculumSubjects } from './curriculum/registry';
import { getCurriculumSubjectChapterEntries } from './curriculum/subject-navigation';
import type { ChapterMasterySummary, MasteryPayload } from './mastery';

/** The 4 core CBSE Class 10 board subjects shown on the student dashboard. */
export const CORE_SUBJECT_SLUGS = [
  'mathematics-standard',
  'science',
  'social-science',
  'english-language-and-literature',
] as const;

export type NextStep =
  | {
      kind: 'revise';
      chapterSlug: string;
      chapterTitle: string;
      subjectName: string;
      reason: string;
      href: string;
    }
  | {
      kind: 'continue';
      chapterSlug: string;
      chapterTitle: string;
      subjectName: string;
      masteryScore: number;
      href: string;
    }
  | { kind: 'start' };

export type SubjectProgress = {
  slug: string;
  title: string;
  subjectCode: string;
  chapterCount: number;
  startedCount: number;
  progressPercent: number;
};

function chapterHref(slug: string): string | null {
  return getChapter(slug) ? `/chapters/${slug}` : null;
}

/**
 * Picks ONE next study action from the student's real data.
 * Priority: an active revision mission → the most recently touched unfinished
 * chapter → the Day-1 starter. Every link is checked against real chapter content.
 */
export function pickNextStep(mastery: MasteryPayload): NextStep {
  for (const mission of mastery.revisionMissions) {
    if (mission.status !== 'active') continue;
    const href = mission.recommendedActions?.[0]?.href ?? chapterHref(mission.chapterSlug);
    if (!href) continue;
    return {
      kind: 'revise',
      chapterSlug: mission.chapterSlug,
      chapterTitle: mission.chapterTitle,
      subjectName: mission.subjectName,
      reason: mission.reason,
      href,
    };
  }

  for (const chapter of getRecentChapters(mastery.masteries, 10)) {
    if (chapter.masteryScore >= 100) continue;
    const href = chapterHref(chapter.chapterSlug);
    if (!href) continue;
    return {
      kind: 'continue',
      chapterSlug: chapter.chapterSlug,
      chapterTitle: chapter.chapterTitle,
      subjectName: chapter.subjectName,
      masteryScore: Math.round(chapter.masteryScore),
      href,
    };
  }

  return { kind: 'start' };
}

/** Chapters the student has touched, most recent first, limited to real content. */
export function getRecentChapters(
  masteries: ChapterMasterySummary[],
  limit: number,
): ChapterMasterySummary[] {
  return masteries
    .filter((m) => m.lastActivityAt && getChapter(m.chapterSlug))
    .sort((a, b) => Date.parse(b.lastActivityAt ?? '') - Date.parse(a.lastActivityAt ?? ''))
    .slice(0, limit);
}

/**
 * Progress per core subject, matched by chapter slug (not by subject name),
 * so "Mathematics" chapters count towards "Mathematics Standard" correctly.
 */
export function buildCoreSubjectProgress(masteries: ChapterMasterySummary[]): SubjectProgress[] {
  const startedSlugs = new Set(
    masteries
      .filter((m) => m.masteryScore > 0 || m.bestQuizScorePercent > 0 || m.lastActivityAt)
      .map((m) => m.chapterSlug),
  );
  const chapterEntries = getChapterEntries();
  const subjects = getVisibleCurriculumSubjects();

  return CORE_SUBJECT_SLUGS.flatMap((slug) => {
    const subject = subjects.find((s) => s.slug === slug);
    if (!subject) return [];
    const chapterSlugs = getCurriculumSubjectChapterEntries(subject, chapterEntries).map(
      ([chapterSlug]) => chapterSlug,
    );
    const startedCount = chapterSlugs.filter((s) => startedSlugs.has(s)).length;
    const chapterCount = chapterSlugs.length;
    return [
      {
        slug: subject.slug,
        title: subject.title,
        subjectCode: subject.subjectCode,
        chapterCount,
        startedCount,
        progressPercent: chapterCount > 0 ? Math.round((startedCount / chapterCount) * 100) : 0,
      },
    ];
  });
}

/** Short human-readable relative time, e.g. "today", "2 days ago". */
export function formatRelativeDay(iso: string | null, now: Date = new Date()): string {
  if (!iso) return '';
  const days = Math.floor((now.getTime() - Date.parse(iso)) / 86_400_000);
  if (Number.isNaN(days)) return '';
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wk ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

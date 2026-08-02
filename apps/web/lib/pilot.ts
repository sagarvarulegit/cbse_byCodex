import { getChapter, hasChapterPack } from './course-content';
import { getChapterSubjectNavigation } from './curriculum/subject-navigation';

export const PILOT_CHAPTER_SLUGS = [
  'real-numbers',
  'chemical-reactions-and-equations',
  'two-stories-about-flying',
] as const;

export type PilotChapterSlug = (typeof PILOT_CHAPTER_SLUGS)[number];

export type PilotPathStep = {
  href: string;
  label: string;
};

export type PilotChapterCard = {
  accent: 'blue' | 'green';
  minutesLabel: string;
  notesHref: string;
  pathSteps: PilotPathStep[];
  quizHref: string;
  slug: PilotChapterSlug;
  status: string;
  subject: string;
  summary: string;
  title: string;
  topics: string[];
};

const pilotMinutes: Record<PilotChapterSlug, string> = {
  'chemical-reactions-and-equations': '5 hr 35 min total',
  'real-numbers': '46 min',
  'two-stories-about-flying': '35 min',
};

function getAccent(subject: string): 'blue' | 'green' {
  return subject === 'Science' ? 'green' : 'blue';
}

function getPilotNotesHref(slug: PilotChapterSlug) {
  const chapter = getChapter(slug);
  const hasPublishedLesson = chapter?.lessons.some((lesson) => lesson.fileName);

  if (hasPublishedLesson || hasChapterPack(slug)) {
    return `/chapters/${slug}/notes`;
  }

  return `/chapters/${slug}`;
}

export function isPilotChapter(slug: string): slug is PilotChapterSlug {
  return PILOT_CHAPTER_SLUGS.includes(slug as PilotChapterSlug);
}

export function getPilotChapterCard(slug: PilotChapterSlug): PilotChapterCard | null {
  const chapter = getChapter(slug);

  if (!chapter) {
    return null;
  }

  const notesHref = getPilotNotesHref(slug);
  const quizHref = `/chapters/${slug}/quiz`;
  const subjectNavigation = getChapterSubjectNavigation(slug);

  return {
    accent: getAccent(chapter.subject),
    minutesLabel: pilotMinutes[slug],
    notesHref,
    pathSteps: [
      { href: '/subjects', label: 'Choose subject' },
      ...(subjectNavigation
        ? [{ href: subjectNavigation.href, label: 'View chapters' }]
        : []),
      { href: notesHref, label: 'Study chapter' },
      { href: quizHref, label: 'Take quiz' },
    ],
    quizHref,
    slug,
    status: 'Free pilot',
    subject: chapter.subject,
    summary: chapter.summary,
    title: chapter.title,
    topics: chapter.topics ?? chapter.lessons.map((lesson) => lesson.title),
  };
}

export function getPilotChapterCards() {
  return PILOT_CHAPTER_SLUGS.map((slug) => getPilotChapterCard(slug)).filter(
    (card): card is PilotChapterCard => Boolean(card),
  );
}

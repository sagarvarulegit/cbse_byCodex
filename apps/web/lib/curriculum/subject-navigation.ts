import { hasChapterPack, type ChapterContent } from '../course-content';
import type { AssessmentMode, CurriculumSubject } from './types';

type ChapterEntry = ReturnType<typeof import('../course-content').getChapterEntries>[number];

export type SubjectCatalogItem = {
  slug: string;
  title: string;
  subjectCode: string;
  assessmentLabel: string;
  academicSession: string;
  chapterCount: number;
  liveCount: number;
  accent: 'blue' | 'green';
  description: string;
};

export const SUBJECT_ROUTE_ALIASES: Record<string, string> = {
  english: 'english-language-and-literature',
  hindi: 'hindi-course-b',
  mathematics: 'mathematics-standard',
};

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  'mathematics-standard':
    'Master Algebra, Geometry, Trigonometry, and Probability using interactive board-style worked examples, step-by-step proofs, and simple-English revision notes.',
  science:
    'Explore Physics, Chemistry, and Biology using visual chemical equations, diagram breakdowns of human systems, and animated physics explainers.',
  'english-language-and-literature':
    'Build reading, grammar, and literature confidence for English Language and Literature with curated summaries, writing support, and chapter-first revision.',
  'hindi-course-b':
    'Improve comprehension, grammar, and literature performance for Hindi Course B with chapter summaries, writing support, and simple revision guidance.',
  'social-science':
    'Deep dive into History, Geography, Civics, and Economics with concept maps, chapter packs, and exam-focused revision cues.',
  'health-and-physical-education':
    'Understand physical fitness, balanced diets, community health, sports basics, and first-aid guidelines through the active HPE curriculum map.',
};

const SUBJECT_ACCENTS: Record<string, 'blue' | 'green'> = {
  'mathematics-standard': 'blue',
  science: 'green',
  'english-language-and-literature': 'blue',
  'hindi-course-b': 'green',
  'social-science': 'blue',
  'health-and-physical-education': 'green',
};

const ASSESSMENT_LABELS: Record<AssessmentMode, string> = {
  board: 'Board exam',
  internal: 'Internal assessment',
  'optional-skill': 'Optional skill',
};

export function resolveCurriculumSubjectSlug(slug: string): string {
  return SUBJECT_ROUTE_ALIASES[slug] ?? slug;
}

export function getAssessmentLabel(assessmentMode: AssessmentMode): string {
  return ASSESSMENT_LABELS[assessmentMode];
}

export function getCurriculumSubjectChapterEntries(
  subject: CurriculumSubject,
  chapterEntries: ChapterEntry[],
): ChapterEntry[] {
  const chapterBySlug = new Map(chapterEntries);
  const entries: ChapterEntry[] = [];
  const seenSlugs = new Set<string>();

  for (const slug of getCurriculumSubjectChapterSlugs(subject)) {
    if (seenSlugs.has(slug)) {
      continue;
    }

    seenSlugs.add(slug);

    const chapter = chapterBySlug.get(slug);

    if (chapter) {
      entries.push([slug, chapter]);
    }
  }

  return entries;
}

export function buildSubjectCatalog(
  subjects: CurriculumSubject[],
  chapterEntries: ChapterEntry[],
): SubjectCatalogItem[] {
  return subjects.map((subject) => {
    const subjectChapterEntries = getCurriculumSubjectChapterEntries(subject, chapterEntries);

    return {
      slug: subject.slug,
      title: subject.title,
      subjectCode: subject.subjectCode,
      assessmentLabel: getAssessmentLabel(subject.assessmentMode),
      academicSession: subject.academicSession,
      chapterCount: subjectChapterEntries.length,
      liveCount: subjectChapterEntries.filter(isLiveChapterEntry).length,
      accent: SUBJECT_ACCENTS[subject.slug] ?? 'blue',
      description:
        SUBJECT_DESCRIPTIONS[subject.slug] ??
        'Browse the current curriculum map, active chapters, and revision-ready learning paths.',
    };
  });
}

function getCurriculumSubjectChapterSlugs(subject: CurriculumSubject): string[] {
  return subject.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) => chapter.platformChapterSlugs),
  );
}

function isLiveChapterEntry([slug, chapter]: [string, ChapterContent]): boolean {
  return chapter.lessons.length > 0 || hasChapterPack(slug);
}

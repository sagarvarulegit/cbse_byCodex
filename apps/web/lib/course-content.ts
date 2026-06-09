import { promises as fs } from 'fs';
import path from 'path';

export type LessonMeta = {
  slug: string;
  fileName: string;
  title: string;
  type: string;
  minutes: number;
  free: boolean;
  preview: string;
};

export type ChapterContent = {
  subject: string;
  title: string;
  progress: number;
  mastery: string;
  streakTask: string;
  summary: string;
  lessons: LessonMeta[];
};

export type MarkdownBlock =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code'; text: string };

export type LessonContent = {
  chapterSlug: string;
  chapter: ChapterContent;
  lesson: LessonMeta;
  blocks: MarkdownBlock[];
  previousLesson: LessonMeta | null;
  nextLesson: LessonMeta | null;
};

const chapters: Record<string, ChapterContent> = {
  'real-numbers': {
    subject: 'Mathematics',
    title: 'Real Numbers',
    progress: 42,
    mastery: 'Notes live',
    streakTask: 'Finish one lesson note and solve 3 practice questions',
    summary:
      'Now live with simple-English lesson notes, glossary help, board-style long-division demos, comic recaps, and quick practice for every key concept in Chapter 1.',
    lessons: [
      {
        slug: 'euclid-division-lemma',
        fileName: '01-euclid-division-lemma.md',
        title: 'Euclid division lemma',
        type: 'Support concept note',
        minutes: 8,
        free: true,
        preview: 'Start with familiar long division, then map it to a = bq + r and Euclid HCF steps without fear.',
      },
      {
        slug: 'fundamental-theorem-of-arithmetic',
        fileName: '02-fundamental-theorem-of-arithmetic.md',
        title: 'Fundamental theorem of arithmetic',
        type: 'Core concept note',
        minutes: 10,
        free: false,
        preview: 'Prime numbers, factors, and prime factorisation explained in easy English with quick recall help.',
      },
      {
        slug: 'hcf-and-lcm-by-prime-factorisation',
        fileName: '03-hcf-and-lcm-by-prime-factorisation.md',
        title: 'HCF and LCM by prime factorisation',
        type: 'Board scoring lesson',
        minutes: 12,
        free: false,
        preview: 'Learn the one clean rule that separates HCF from LCM and stops the usual confusion.',
      },
      {
        slug: 'irrational-numbers',
        fileName: '04-irrational-numbers.md',
        title: 'Irrational numbers',
        type: 'Proof and understanding',
        minutes: 9,
        free: false,
        preview: 'Know the difference between rational and irrational numbers and remember the √2 proof flow.',
      },
      {
        slug: 'decimal-expansion-of-rational-numbers',
        fileName: '05-decimal-expansion-of-rational-numbers.md',
        title: 'Decimal expansion of rational numbers',
        type: 'Quick test concept',
        minutes: 7,
        free: false,
        preview: 'Use denominator factorisation to tell whether a decimal will terminate or repeat.',
      },
    ],
  },
  'chemical-reactions-and-equations': {
    subject: 'Science',
    title: 'Chemical Reactions and Equations',
    progress: 28,
    mastery: 'Getting started',
    streakTask: 'Balance 6 equations without hints',
    summary:
      'A visual Science chapter experience with animated reactions, activity explanations, sharp notes, quizzes, and revision checkpoints.',
    lessons: [
      {
        slug: 'chemical-equations',
        fileName: '',
        title: 'Chemical equations',
        type: 'Animated intro',
        minutes: 7,
        free: true,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'balancing-equations',
        fileName: '',
        title: 'Balancing equations',
        type: 'Interactive practice',
        minutes: 11,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'combination-and-decomposition-reactions',
        fileName: '',
        title: 'Combination and decomposition reactions',
        type: 'Visual explainer',
        minutes: 9,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'displacement-and-double-displacement-reactions',
        fileName: '',
        title: 'Displacement and double displacement reactions',
        type: 'Activity breakdown',
        minutes: 10,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'oxidation-and-reduction',
        fileName: '',
        title: 'Oxidation and reduction',
        type: 'Revision sprint',
        minutes: 8,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
    ],
  },
};

const lessonDirectories: Partial<Record<keyof typeof chapters, string>> = {
  'real-numbers': path.join(process.cwd(), 'content', 'real-numbers', 'lessons'),
};

export function getChapter(slug: string) {
  return chapters[slug] ?? null;
}

export function getChapterEntries() {
  return Object.entries(chapters);
}

export async function getLessonContent(chapterSlug: string, lessonSlug: string): Promise<LessonContent | null> {
  const chapter = chapters[chapterSlug];

  if (!chapter) {
    return null;
  }

  const lessonIndex = chapter.lessons.findIndex((item) => item.slug === lessonSlug);

  if (lessonIndex === -1) {
    return null;
  }

  const lesson = chapter.lessons[lessonIndex];
  const directory = lessonDirectories[chapterSlug as keyof typeof lessonDirectories];

  if (!directory || !lesson.fileName) {
    return null;
  }

  const raw = await fs.readFile(path.join(directory, lesson.fileName), 'utf8');
  const markdown = stripFrontmatter(raw);

  return {
    chapterSlug,
    chapter,
    lesson,
    blocks: parseMarkdown(markdown),
    previousLesson: lessonIndex > 0 ? chapter.lessons[lessonIndex - 1] : null,
    nextLesson: lessonIndex < chapter.lessons.length - 1 ? chapter.lessons[lessonIndex + 1] : null,
  };
}

function stripFrontmatter(source: string) {
  if (!source.startsWith('---')) {
    return source;
  }

  const end = source.indexOf('\n---', 3);

  if (end === -1) {
    return source;
  }

  return source.slice(end + 4).trim();
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listType: 'unordered-list' | 'ordered-list' | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ').trim() });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) {
      listType = null;
      listItems = [];
      return;
    }

    blocks.push({ type: listType, items: [...listItems] });
    listType = null;
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    if (/^#\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '') });
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();

      if (listType && listType !== 'unordered-list') {
        flushList();
      }

      listType = 'unordered-list';
      listItems.push(trimmed.replace(/^-\s+/, ''));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();

      if (listType && listType !== 'ordered-list') {
        flushList();
      }

      listType = 'ordered-list';
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    if (/^`.*`$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'code', text: trimmed.slice(1, -1) });
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

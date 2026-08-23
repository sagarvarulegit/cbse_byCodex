import type { ExamPaper } from '@prisma/client';

/**
 * Fixed Board Mock Test Series definition for Mathematics Standard (041).
 *
 * The series is a curated set of deterministic papers: each paper is generated
 * once from a fixed seed, verified, and published as a *shared* paper
 * (userId = null) so every student takes the same Paper 1, Paper 2, … .
 *
 * The first paper is the free sample used as the acquisition funnel; the
 * remaining papers are the paid product (gated by entitlement, added when
 * payments land).
 */
export const MATHS_041_SERIES = {
  key: 'maths-041-board-mock-2026',
  subjectSlug: 'mathematics-standard',
  title: 'CBSE Class 10 Maths (Standard 041) — Board Mock Test Series',
  description:
    'Five full board-style papers (80 marks, 3 hours, 15 minutes reading) ' +
    'assembled deterministically from the verified question bank, following ' +
    'the official question-paper design. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

/**
 * Fixed Board Mock Test Series definition for Science (086).
 */
export const SCIENCE_086_SERIES = {
  key: 'science-086-board-mock-2026',
  subjectSlug: 'science',
  title: 'CBSE Class 10 Science (086) — Board Mock Test Series',
  description:
    'Five full board-style papers (80 marks, 3 hours, 15 minutes reading, 39 questions) ' +
    'assembled deterministically from the verified question bank, following ' +
    'the official CBSE Science question-paper design. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

/**
 * Fixed Board Mock Test Series definition for Social Science (087).
 */
export const SOCIAL_SCIENCE_087_SERIES = {
  key: 'social-science-087-board-mock-2026',
  subjectSlug: 'social-science',
  title: 'CBSE Class 10 Social Science (087) — Board Mock Test Series',
  description:
    'Five full board-style papers (80 marks, 3 hours, 15 minutes reading, 37 questions across 6 sections) ' +
    'covering History, Geography, Civics, and Economics from the verified question bank. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

/**
 * Fixed Board Mock Test Series definition for English Language & Literature (184).
 */
export const ENGLISH_184_SERIES = {
  key: 'english-184-board-mock-2026',
  subjectSlug: 'english-language-and-literature',
  title: 'CBSE Class 10 English (184) — Board Mock Test Series',
  description:
    'Five full board-style papers (80 marks, 3 hours, 15 minutes reading, 34 questions) ' +
    'covering Reading Comprehension, Creative Writing, Grammar, and Literature from the verified question bank. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

export const MATHS_241_SERIES = {
  key: 'maths-241-board-mock-2026',
  subjectSlug: 'mathematics-basic',
  title: 'CBSE Class 10 Maths (Basic 241) — Board Mock Test Series',
  description:
    'Five full board-style papers (80 marks, 3 hours, 15 minutes reading) ' +
    'assembled deterministically from the verified question bank, following ' +
    'the official CBSE Class 10 Mathematics Basic (241) question-paper design. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

export type MockTestSeriesDefinition =
  | typeof MATHS_041_SERIES
  | typeof MATHS_241_SERIES
  | typeof SCIENCE_086_SERIES
  | typeof SOCIAL_SCIENCE_087_SERIES
  | typeof ENGLISH_184_SERIES;

export const TEST_SERIES_BY_SUBJECT: Record<string, MockTestSeriesDefinition> = {
  'mathematics-standard': MATHS_041_SERIES,
  'mathematics-basic': MATHS_241_SERIES,
  'science': SCIENCE_086_SERIES,
  'social-science': SOCIAL_SCIENCE_087_SERIES,
  'english-language-and-literature': ENGLISH_184_SERIES,
};

export function getMockTestSeriesForSubject(
  subjectSlug: string = 'mathematics-standard',
): MockTestSeriesDefinition {
  return TEST_SERIES_BY_SUBJECT[subjectSlug] ?? MATHS_041_SERIES;
}

export type MockTestSeriesPaper = {
  number: number;
  seed: number;
  title: string;
  id?: string;
  verificationStatus?: string;
  publishStatus?: string;
  totalMarks?: number;
  durationMinutes?: number;
  isFreeSample?: boolean;
  isUnlocked?: boolean;
};

export function isSeriesPaper(paper: ExamPaper): boolean {
  return paper.userId === null && paper.publishStatus === 'published';
}

/** Papers already published for the series, keyed by seed. */
export function indexSeriesPapers(papers: ExamPaper[]): Map<number, ExamPaper> {
  return new Map(papers.map((paper) => [paper.seed, paper]));
}

export function seriesPaperView(
  definition: MockTestSeriesPaper,
  paper?: ExamPaper,
  series: MockTestSeriesDefinition = MATHS_041_SERIES,
  isUnlocked: boolean = definition.number === series.freeSampleNumber,
): MockTestSeriesPaper {
  return {
    number: definition.number,
    seed: definition.seed,
    title: definition.title,
    isFreeSample: definition.number === series.freeSampleNumber,
    isUnlocked,
    ...(paper
      ? {
          id: paper.id,
          verificationStatus: paper.verificationStatus,
          publishStatus: paper.publishStatus,
          totalMarks: paper.totalMarks,
          durationMinutes: paper.durationMinutes,
        }
      : {}),
  };
}

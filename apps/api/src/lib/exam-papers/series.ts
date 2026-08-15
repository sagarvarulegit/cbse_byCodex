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
    'the official 2025-26 question-paper design. Paper 1 is free.',
  freeSampleNumber: 1,
  papers: [
    { number: 1, seed: 101, title: 'Mock Test 1' },
    { number: 2, seed: 202, title: 'Mock Test 2' },
    { number: 3, seed: 303, title: 'Mock Test 3' },
    { number: 4, seed: 404, title: 'Mock Test 4' },
    { number: 5, seed: 505, title: 'Mock Test 5' },
  ],
} as const;

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
): MockTestSeriesPaper {
  return {
    number: definition.number,
    seed: definition.seed,
    title: definition.title,
    isFreeSample: definition.number === MATHS_041_SERIES.freeSampleNumber,
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

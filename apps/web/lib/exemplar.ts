import exemplarData from './exemplar-questions.generated.json';
import type { ParsedQuizQuestion } from './quiz-content';

export type ExemplarQuizQuestion = {
  id: string;
  qNo: number;
  chapterSlug: string;
  subject: string;
  title: string;
  prompt: string;
  options: {
    value: number;
    label: string;
  }[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: string;
  sourceCoverage: string;
};

const ALL_EXEMPLAR_QUESTIONS: Record<string, ExemplarQuizQuestion[]> =
  exemplarData as Record<string, ExemplarQuizQuestion[]>;

/**
 * Returns all NCERT Exemplar questions for a specific chapter slug.
 */
export function getExemplarQuestionsForChapter(
  chapterSlug: string,
): ExemplarQuizQuestion[] {
  return ALL_EXEMPLAR_QUESTIONS[chapterSlug] ?? [];
}

/**
 * Converts ExemplarQuizQuestions into the standard ParsedQuizQuestion interface
 * used by QuizRunner and QuizWithHistory.
 */
export function getParsedExemplarQuestions(
  chapterSlug: string,
): ParsedQuizQuestion[] {
  const questions = getExemplarQuestionsForChapter(chapterSlug);
  return questions.map((q) => ({
    id: q.id,
    title: q.title,
    prompt: q.prompt,
    options: q.options,
    correctOptionIndex: q.correctOptionIndex,
    explanation: q.explanation,
    difficulty: 'Hard',
    sourceCoverage: q.sourceCoverage,
    topicSlug: chapterSlug,
  }));
}

/**
 * Returns the total count of Exemplar HOTS questions available for a chapter.
 */
export function getExemplarCountForChapter(chapterSlug: string): number {
  return (ALL_EXEMPLAR_QUESTIONS[chapterSlug] ?? []).length;
}

/**
 * Checks if a chapter has NCERT Exemplar HOTS questions available.
 */
export function hasExemplarQuestions(chapterSlug: string): boolean {
  return getExemplarCountForChapter(chapterSlug) > 0;
}

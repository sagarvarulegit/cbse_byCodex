import {
  parseQuizContent,
  QuizContentValidationError,
  type QuizContentValidationIssue,
} from './quiz-content';

export type QuizMetadataValidationLevel = 'error' | 'warning';

export type QuizMetadataValidationMessage = QuizContentValidationIssue & {
  level: QuizMetadataValidationLevel;
};

export type QuizMetadataValidationResult = {
  errors: QuizMetadataValidationMessage[];
  questionsParsed: number;
  warnings: QuizMetadataValidationMessage[];
};

export type ValidateQuizMetadataOptions = {
  requireExplanation?: boolean;
  requireTopicSlugs?: string[];
};

function isQuizContentValidationError(error: unknown): error is QuizContentValidationError {
  return (
    error instanceof QuizContentValidationError ||
    (error instanceof Error && error.name === 'QuizContentValidationError')
  );
}

export function validateQuizMetadata(
  markdown: string,
  options: ValidateQuizMetadataOptions = {},
): QuizMetadataValidationResult {
  const requiredTopicSlugs = options.requireTopicSlugs ?? [];
  const requireExplanation = options.requireExplanation ?? false;
  const requireTopic = requiredTopicSlugs.length > 0;
  const errors: QuizMetadataValidationMessage[] = [];
  const warnings: QuizMetadataValidationMessage[] = [];
  let questionsParsed = 0;

  try {
    const questions = parseQuizContent(markdown, requiredTopicSlugs, { strictMetadata: true });
    questionsParsed = questions.length;
  } catch (error) {
    if (!isQuizContentValidationError(error)) {
      throw error;
    }

    for (const issue of error.issues) {
      if ((issue.code === 'missing-topic' || issue.code === 'invalid-topic') && !requireTopic) {
        continue;
      }

      const isExplanationWarning = issue.code === 'missing-explanation' && !requireExplanation;
      const target = isExplanationWarning ? warnings : errors;

      target.push({
        ...issue,
        level: isExplanationWarning ? 'warning' : 'error',
      });
    }

    questionsParsed = parseQuizContent(markdown, requiredTopicSlugs).length;
  }

  return { errors, questionsParsed, warnings };
}

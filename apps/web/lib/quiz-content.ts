export type ParsedQuizQuestion = {
  correctOptionIndex: number;
  difficulty?: string;
  explanation?: string;
  id: string;
  options: {
    label: string;
    value: number;
  }[];
  prompt: string;
  sourceCoverage?: string;
  title: string;
  topicSlug?: string;
  topicTags?: string[];
};

export type QuizParseOptions = {
  strictMetadata?: boolean;
};

export type QuizContentValidationIssue = {
  code:
    | 'missing-answer'
    | 'invalid-answer'
    | 'missing-explanation'
    | 'missing-topic'
    | 'invalid-topic';
  message: string;
  questionId: string;
  title: string;
};

export class QuizContentValidationError extends Error {
  issues: QuizContentValidationIssue[];

  constructor(issues: QuizContentValidationIssue[]) {
    super(issues.map((issue) => issue.message).join('\n'));
    this.name = 'QuizContentValidationError';
    this.issues = issues;
  }
}

function stripInlineCode(value: string) {
  return value.replace(/`([^`]+)`/g, '$1').trim();
}

export function slugifyQuizTopic(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitTopicTags(value: string) {
  return value
    .split(',')
    .map((tag) => stripInlineCode(tag))
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function findMatchingTopicSlug(topicTags: string[], validTopicSlugs: string[], fallbackTopicSlug?: string) {
  for (const tag of topicTags) {
    const candidates = [tag, slugifyQuizTopic(tag)];
    const matchingTopicSlug = candidates.find((candidate) => validTopicSlugs.includes(candidate));
    if (matchingTopicSlug) {
      return matchingTopicSlug;
    }
  }

  return fallbackTopicSlug;
}

export function parseQuizContent(
  markdown: string,
  topicSlugs: string[],
  parseOptions: QuizParseOptions = {},
): ParsedQuizQuestion[] {
  const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/, '');
  const blocks = contentWithoutFrontmatter
    .split(/\n(?=##\s+)/)
    .filter((block) => /^##\s+\d+\.\s+/.test(block.trim()));
  const questions: ParsedQuizQuestion[] = [];
  const issues: QuizContentValidationIssue[] = [];

  for (const [index, block] of blocks.entries()) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const heading = lines[0]?.replace(/^##\s+\d+\.\s+/, '').trim();

    if (!heading) {
      continue;
    }

    const options: ParsedQuizQuestion['options'] = [];
    const promptLines: string[] = [];
    let answerValue: number | null = null;
    let difficulty: string | undefined;
    let explanation: string | undefined;
    let sourceCoverage: string | undefined;
    let topicTags: string[] = [];

    for (const line of lines.slice(1)) {
      const optionMatch = line.match(/^(\d+)\.\s+(.+)$/);
      const answerMatch = line.match(/^(?:answer|correct answer):\s*(\d+)/i);
      const metadataMatch = line.match(/^(topic|topics|difficulty|source|source coverage|explanation):\s*(.+)$/i);

      if (optionMatch) {
        options.push({
          label: stripInlineCode(optionMatch[2]),
          value: Number.parseInt(optionMatch[1], 10),
        });
        continue;
      }

      if (answerMatch) {
        answerValue = Number.parseInt(answerMatch[1], 10);
        continue;
      }

      if (metadataMatch) {
        const [, metadataKey, metadataValue] = metadataMatch;
        const normalizedValue = stripInlineCode(metadataValue);
        const normalizedKey = metadataKey.toLowerCase();

        if (normalizedKey === 'topic' || normalizedKey === 'topics') {
          topicTags = splitTopicTags(normalizedValue);
          continue;
        }

        if (normalizedKey === 'difficulty') {
          difficulty = normalizedValue;
          continue;
        }

        if (normalizedKey === 'source' || normalizedKey === 'source coverage') {
          sourceCoverage = normalizedValue;
          continue;
        }

        if (normalizedKey === 'explanation') {
          explanation = normalizedValue;
          continue;
        }
      }

      promptLines.push(stripInlineCode(line));
    }

    if (options.length < 2 || promptLines.length === 0) {
      continue;
    }

    const questionId = `question-${index + 1}`;
    const title = stripInlineCode(heading);
    const answerOptionIndex =
      answerValue !== null ? options.findIndex((option) => option.value === answerValue) : -1;
    const matchingTopicSlug = findMatchingTopicSlug(topicTags, topicSlugs);
    const topicSlug = parseOptions.strictMetadata
      ? matchingTopicSlug
      : matchingTopicSlug ?? topicSlugs[index];

    if (parseOptions.strictMetadata) {
      if (answerValue === null) {
        issues.push({
          code: 'missing-answer',
          message: `${questionId} (${heading}) is missing Answer metadata.`,
          questionId,
          title,
        });
      } else if (answerOptionIndex < 0) {
        issues.push({
          code: 'invalid-answer',
          message: `${questionId} (${heading}) has Answer: ${answerValue}, but no option uses that value.`,
          questionId,
          title,
        });
      }

      if (!explanation) {
        issues.push({
          code: 'missing-explanation',
          message: `${questionId} (${heading}) is missing Explanation metadata.`,
          questionId,
          title,
        });
      }

      if (topicTags.length === 0) {
        issues.push({
          code: 'missing-topic',
          message: `${questionId} (${heading}) is missing Topic metadata.`,
          questionId,
          title,
        });
      } else if (!matchingTopicSlug) {
        issues.push({
          code: 'invalid-topic',
          message: `${questionId} (${heading}) has no Topic matching the chapter topic slugs.`,
          questionId,
          title,
        });
      }
    }

    questions.push({
      correctOptionIndex: answerOptionIndex >= 0 ? answerOptionIndex : 0,
      ...(difficulty ? { difficulty } : {}),
      ...(explanation ? { explanation } : {}),
      id: questionId,
      options,
      prompt: promptLines.join(' '),
      ...(sourceCoverage ? { sourceCoverage } : {}),
      title,
      ...(topicTags.length > 0 ? { topicTags } : {}),
      ...(topicSlug ? { topicSlug } : {}),
    });
  }

  if (parseOptions.strictMetadata && issues.length > 0) {
    throw new QuizContentValidationError(issues);
  }

  return questions;
}

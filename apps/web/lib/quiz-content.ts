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

function stripInlineCode(value: string) {
  return value.replace(/`([^`]+)`/g, '$1').trim();
}

function slugifyTopic(label: string) {
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
    const candidates = [tag, slugifyTopic(tag)];
    const matchingTopicSlug = candidates.find((candidate) => validTopicSlugs.includes(candidate));
    if (matchingTopicSlug) {
      return matchingTopicSlug;
    }
  }

  return fallbackTopicSlug;
}

export function parseQuizContent(markdown: string, topicSlugs: string[]): ParsedQuizQuestion[] {
  const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/, '');
  const blocks = contentWithoutFrontmatter
    .split(/\n(?=##\s+\d+\.\s+)/)
    .filter((block) => /^##\s+\d+\.\s+/.test(block.trim()));

  return blocks.flatMap((block, index) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const heading = lines[0]?.replace(/^##\s+\d+\.\s+/, '').trim();

    if (!heading) {
      return [];
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
      return [];
    }

    const answerOptionIndex = answerValue ? options.findIndex((option) => option.value === answerValue) : -1;
    const fallbackTopicSlug = topicSlugs[index];
    const topicSlug = findMatchingTopicSlug(topicTags, topicSlugs, fallbackTopicSlug);

    return [
      {
        correctOptionIndex: answerOptionIndex >= 0 ? answerOptionIndex : 0,
        ...(difficulty ? { difficulty } : {}),
        ...(explanation ? { explanation } : {}),
        id: `question-${index + 1}`,
        options,
        prompt: promptLines.join(' '),
        ...(sourceCoverage ? { sourceCoverage } : {}),
        title: stripInlineCode(heading),
        ...(topicTags.length > 0 ? { topicTags } : {}),
        ...(topicSlug ? { topicSlug } : {}),
      },
    ];
  });
}

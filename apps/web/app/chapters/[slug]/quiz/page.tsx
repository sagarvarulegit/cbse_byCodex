import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuizScoreForm from '../../../../components/QuizScoreForm';
import { getChapter, getQuizContent } from '../../../../lib/course-content';

type ParsedQuizQuestion = {
  correctOptionIndex: number;
  id: string;
  options: {
    label: string;
    value: number;
  }[];
  prompt: string;
  title: string;
  topicSlug?: string;
};

function slugifyTopic(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripInlineCode(value: string) {
  return value.replace(/`([^`]+)`/g, '$1').trim();
}

function parseQuizContent(markdown: string, topicSlugs: string[]): ParsedQuizQuestion[] {
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

    for (const line of lines.slice(1)) {
      const optionMatch = line.match(/^(\d+)\.\s+(.+)$/);
      const answerMatch = line.match(/^(?:answer|correct answer):\s*(\d+)/i);

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

      promptLines.push(stripInlineCode(line));
    }

    if (options.length < 2 || promptLines.length === 0) {
      return [];
    }

    const answerOptionIndex = answerValue ? options.findIndex((option) => option.value === answerValue) : -1;
    const topicSlug = topicSlugs[index];

    return [
      {
        correctOptionIndex: answerOptionIndex >= 0 ? answerOptionIndex : 0,
        id: `question-${index + 1}`,
        options,
        prompt: promptLines.join(' '),
        title: stripInlineCode(heading),
        ...(topicSlug ? { topicSlug } : {}),
      },
    ];
  });
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  const quizContent = await getQuizContent(slug);

  if (!chapter || !quizContent) {
    notFound();
  }

  const weakTopicOptions =
    chapter.lessons.length > 0
      ? chapter.lessons.map((lesson) => ({
          label: lesson.title,
          slug: lesson.slug,
        }))
      : (chapter.topics ?? [])
          .map((topic) => ({
            label: topic,
            slug: slugifyTopic(topic),
          }))
          .filter((topic) => topic.slug.length > 0);
  const quizQuestions = parseQuizContent(
    quizContent,
    weakTopicOptions.map((topic) => topic.slug),
  );

  if (quizQuestions.length === 0) {
    notFound();
  }

  return (
    <main className="section-shell quiz-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{chapter.subject}</p>
          <h1>{chapter.title} quiz</h1>
        </div>
        <Link className="ghost-link" href={`/chapters/${slug}`}>
          Back to chapter
        </Link>
      </div>

      <div className="quiz-shell">
        <QuizScoreForm chapterSlug={slug} questions={quizQuestions} weakTopicOptions={weakTopicOptions} />
      </div>
    </main>
  );
}

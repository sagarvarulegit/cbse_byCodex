import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuizScoreForm from '../../../../components/QuizScoreForm';
import { getChapter, getQuizContent } from '../../../../lib/course-content';

function slugifyTopic(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
        <article className="quiz-content-card">
          <pre style={{ whiteSpace: 'pre-wrap' }}>{quizContent}</pre>
        </article>
        <QuizScoreForm chapterSlug={slug} weakTopicOptions={weakTopicOptions} />
      </div>
    </main>
  );
}

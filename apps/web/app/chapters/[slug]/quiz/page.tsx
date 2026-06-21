import Link from 'next/link';
import { notFound } from 'next/navigation';
import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../../../components/PilotEngagementTracker';
import QuizScoreForm from '../../../../components/QuizScoreForm';
import { getChapter, getQuizContent } from '../../../../lib/course-content';
import { isPilotChapter } from '../../../../lib/pilot';
import { parseQuizContent } from '../../../../lib/quiz-content';
import { getStudentQuizAttempts } from '../../../../lib/quiz-attempts';

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
  const isPilot = isPilotChapter(slug);

  if (!chapter || !quizContent) {
    notFound();
  }

  const quizAttemptHistory = await getStudentQuizAttempts(slug);

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
      {isPilot ? <PilotEngagementTracker chapterSlug={slug} eventType="quiz_start" surface="quiz" /> : null}

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
        <QuizScoreForm
          chapterSlug={slug}
          initialAttemptHistory={quizAttemptHistory}
          questions={quizQuestions}
          weakTopicOptions={weakTopicOptions}
        />
      </div>

      {isPilot ? (
        <section className="pilot-feedback-section quiz-feedback-section">
          <PilotFeedbackForm chapterSlug={slug} surface="quiz" />
        </section>
      ) : null}
    </main>
  );
}

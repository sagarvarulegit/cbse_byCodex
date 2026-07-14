import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../../../components/PilotEngagementTracker';
import QuizScoreForm from '../../../../components/QuizScoreForm';
import { getChapter, getQuizContent } from '../../../../lib/course-content';
import { isPilotChapter } from '../../../../lib/pilot';
import { parseQuizContent, slugifyQuizTopic } from '../../../../lib/quiz-content';
import { getStudentQuizAttempts } from '../../../../lib/quiz-attempts';

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  const quizContent = await getQuizContent(slug);
  const isPilot = isPilotChapter(slug);

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
            slug: slugifyQuizTopic(topic),
          }))
          .filter((topic) => topic.slug.length > 0);
  const quizQuestions = parseQuizContent(
    quizContent,
    weakTopicOptions.map((topic) => topic.slug),
    { strictMetadata: isPilot },
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
        <Suspense fallback={<QuizLoading />}>
          <QuizWithHistory
            chapterSlug={slug}
            questions={quizQuestions}
            weakTopicOptions={weakTopicOptions}
          />
        </Suspense>
      </div>

      {isPilot ? (
        <section className="pilot-feedback-section quiz-feedback-section">
          <PilotFeedbackForm chapterSlug={slug} surface="quiz" />
        </section>
      ) : null}
    </main>
  );
}

async function QuizWithHistory({
  chapterSlug,
  questions,
  weakTopicOptions,
}: {
  chapterSlug: string;
  questions: ReturnType<typeof parseQuizContent>;
  weakTopicOptions: { label: string; slug: string }[];
}) {
  const quizAttemptHistory = await getStudentQuizAttempts(chapterSlug);

  return (
    <QuizScoreForm
      chapterSlug={chapterSlug}
      initialAttemptHistory={quizAttemptHistory}
      questions={questions}
      weakTopicOptions={weakTopicOptions}
    />
  );
}

function QuizLoading() {
  return (
    <section aria-busy="true" aria-label="Loading quiz" className="route-loading-card quiz-loading-card">
      <p className="eyebrow">Quiz</p>
      <h2>Preparing your questions...</h2>
      <div className="route-loading-bar" />
      <p>Your previous attempts are loading in the background.</p>
    </section>
  );
}

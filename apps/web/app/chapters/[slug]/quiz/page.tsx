import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../../../components/PilotEngagementTracker';
import QuizScoreForm from '../../../../components/QuizScoreForm';
import StudentTopbar from '../../../../components/StudentTopbar';
import { getStudentSession } from '../../../../lib/auth';
import { getChapter, getQuizContent } from '../../../../lib/course-content';
import { getChapterSubjectNavigation } from '../../../../lib/curriculum/subject-navigation';
import { isPilotChapter } from '../../../../lib/pilot';
import { parseQuizContent, slugifyQuizTopic } from '../../../../lib/quiz-content';
import { getStudentQuizAttempts } from '../../../../lib/quiz-attempts';

import { getParsedExemplarQuestions, hasExemplarQuestions } from '../../../../lib/exemplar';

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const { mode } = (await searchParams) ?? {};
  const isExemplarMode = mode === 'exemplar';

  const chapter = getChapter(slug);
  const [quizContent, session] = await Promise.all([
    getQuizContent(slug),
    getStudentSession(),
  ]);
  const isPilot = isPilotChapter(slug);
  const subjectNavigation = getChapterSubjectNavigation(slug);

  if (!chapter) {
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

  let quizQuestions = isExemplarMode
    ? getParsedExemplarQuestions(slug)
    : quizContent
      ? parseQuizContent(
          quizContent,
          weakTopicOptions.map((topic) => topic.slug),
          { strictMetadata: isPilot },
        )
      : [];

  // Fallback if exemplar questions not found for this specific chapter
  if (quizQuestions.length === 0 && quizContent) {
    quizQuestions = parseQuizContent(
      quizContent,
      weakTopicOptions.map((topic) => topic.slug),
      { strictMetadata: isPilot },
    );
  }

  if (quizQuestions.length === 0) {
    notFound();
  }

  return (
    <main className="quiz-page-shell">
      <StudentTopbar contextLabel="Chapter quiz" session={session} />

      <section className="section-shell quiz-page">
        {isPilot ? <PilotEngagementTracker chapterSlug={slug} eventType="quiz_start" surface="quiz" /> : null}

        <nav className="breadcrumb-row" aria-label="Student learning path">
          <Link href="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link href="/subjects">Subjects</Link>
          {subjectNavigation ? (
            <>
              <span>/</span>
              <Link href={subjectNavigation.href}>
                {subjectNavigation.chapterListLabel}
              </Link>
            </>
          ) : null}
          <span>/</span>
          <Link href={`/chapters/${slug}/notes`} prefetch={false}>
            {chapter.title}
          </Link>
          <span>/</span>
          <span aria-current="page">
            {isExemplarMode ? 'NCERT Exemplar Challenge' : 'Quiz'}
          </span>
        </nav>

        <div className="section-heading">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <p className="eyebrow" style={{ margin: 0 }}>{chapter.subject}</p>
              {isExemplarMode && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  🔥 NCERT Exemplar HOTS
                </span>
              )}
            </div>
            <h1>
              {chapter.title} {isExemplarMode ? 'Exemplar HOTS Challenge' : 'Quiz'}
            </h1>
          </div>
          <Link
            aria-label={`Back to ${chapter.title} chapter content`}
            className="ghost-link"
            href={`/chapters/${slug}/notes`}
            prefetch={false}
          >
            ← Chapter notes
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
      </section>
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

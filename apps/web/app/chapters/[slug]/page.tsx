import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapter, getQuizContent } from '../../../lib/course-content';
import { getStudentSession } from '../../../lib/auth';
import { getChapterHomeHref } from '../../../lib/student-navigation';

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizContent = await getQuizContent(slug);
  const chapter = getChapter(slug);
  const session = await getStudentSession();

  if (!chapter) {
    notFound();
  }

  const hasLiveNotes = chapter.lessons.some((lesson) => lesson.fileName);
  const homeHref = getChapterHomeHref(Boolean(session));

  return (
    <main>
      <nav className="topbar" aria-label="Chapter navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <Link className="nav-cta" href={homeHref}>
          Home
        </Link>
      </nav>

      <section className="chapter-hero section-shell">
        <div>
          <p className="eyebrow">{chapter.subject}</p>
          <h1>{chapter.title}</h1>
          <p className="subtext">{chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-plan">
              {hasLiveNotes ? 'Open lesson notes' : 'Start lesson plan'}
            </a>
            {hasLiveNotes ? (
              <Link className="ghost-link" href={`/chapters/${slug}/lessons/${chapter.lessons[0].slug}`}>
                Start first lesson
              </Link>
            ) : (
              <a className="ghost-link" href="#mastery">
                View mastery
              </a>
            )}
          </div>
        </div>

        <aside className="mastery-panel" id="mastery">
          <p className="eyebrow">Chapter mastery</p>
          <strong>{chapter.progress}%</strong>
          <span>{chapter.mastery}</span>
          <div className="progress-track large" aria-label={`${chapter.progress}% complete`}>
            <span style={{ width: `${chapter.progress}%` }} />
          </div>
          <p className="streak-task">Today: {chapter.streakTask}</p>
        </aside>
      </section>

      <section className="section-shell chapter-definition-grid">
        <article className="definition-card">
          <p className="eyebrow">Start here</p>
          <h2>What is a real number?</h2>
          <p className="subtext compact">
            A real number is any number that can be shown on the number line. That includes whole
            numbers, negative numbers, fractions, decimals, and numbers like √2.
          </p>
        </article>
        <article className="definition-card soft">
          <p className="eyebrow">Tiny recall</p>
          <ul>
            <li>
              <code>5</code>, <code>0</code>, <code>-3</code> → real numbers
            </li>
            <li>
              <code>3/4</code>, <code>0.25</code> → real numbers
            </li>
            <li>
              <code>√2</code>, <code>π</code> → also real numbers
            </li>
          </ul>
          <p className="definition-note">If it sits somewhere on the number line, it belongs here. Nice and simple.</p>
        </article>
      </section>

      <section className="section-shell" id="lesson-plan">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lesson path</p>
            <h2>{hasLiveNotes ? 'Simple-English notes now live.' : 'Short videos, notes, quiz checkpoints.'}</h2>
            {quizContent && (
              <Link className="button-link" href={`/chapters/${slug}/quiz`}>Take chapter quiz</Link>
            )}
          </div>
          {hasLiveNotes ? (
            <span className="section-badge">{chapter.lessons.length} notes ready for review</span>
          ) : null}
        </div>
        <div className="lesson-list">
          {chapter.lessons.map((lesson, index) => {
            const href = lesson.fileName ? `/chapters/${slug}/lessons/${lesson.slug}` : undefined;

            return (
              <article className="lesson-row" key={lesson.title}>
                <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>
                    {lesson.type} · {lesson.minutes} min
                  </p>
                  <p className="lesson-preview">{lesson.preview}</p>
                </div>
                <div className="lesson-actions">
                  <span className={lesson.free ? 'access-pill free' : 'access-pill'}>
                    {lesson.free ? 'Free' : 'Premium'}
                  </span>
                  {href ? (
                    <Link className="card-link lesson-open-link" href={href}>
                      Open notes
                    </Link>
                  ) : (
                    <span className="coming-soon-note">Coming soon</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

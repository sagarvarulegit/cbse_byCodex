import Link from 'next/link';
import { notFound } from 'next/navigation';
import PilotEngagementTracker from '../../../components/PilotEngagementTracker';
import { getChapter, getQuizContent, hasChapterPack } from '../../../lib/course-content';
import { formatMasteryLevel, getNextMasteryLabel, getStudentMastery } from '../../../lib/mastery';
import { isPilotChapter } from '../../../lib/pilot';

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizContent = await getQuizContent(slug);
  const chapter = getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const hasLessonNotes = chapter.lessons.some((lesson) => lesson.fileName);
  const hasPackNotes = hasChapterPack(slug);
  const isLive = hasLessonNotes || hasPackNotes;
  const isPilot = isPilotChapter(slug);
  const mastery = await getStudentMastery(slug);
  const chapterMastery = mastery.masteries[0];
  const activeMission = mastery.revisionMissions[0];
  const masteryScore = chapterMastery?.masteryScore ?? chapter.progress;
  const masteryLabel = chapterMastery ? formatMasteryLevel(chapterMastery.level) : chapter.mastery;

  return (
    <main>
      {isPilot ? <PilotEngagementTracker chapterSlug={slug} eventType="chapter_open" surface="chapter" /> : null}

      <nav className="topbar" aria-label="Chapter navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/subjects">Subjects</Link>
        </div>
      </nav>

      <section className="chapter-hero section-shell">
        <div>
          <p className="eyebrow">{chapter.subject}</p>
          <h1>{chapter.title}</h1>
          <p className="subtext">{chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-plan">
              {isLive ? 'Open notes' : 'Start lesson plan'}
            </a>
            {hasLessonNotes ? (
              <Link className="ghost-link" href={`/chapters/${slug}/lessons/${chapter.lessons[0].slug}`}>
                Start first lesson
              </Link>
            ) : hasPackNotes ? (
              <Link className="ghost-link" href={`/chapters/${slug}/notes`}>
                Read chapter notes
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
          <strong>{masteryScore}%</strong>
          <span>{masteryLabel}</span>
          <div className="progress-track large" aria-label={`${masteryScore}% mastered`}>
            <span style={{ width: `${masteryScore}%` }} />
          </div>
          {chapterMastery ? (
            <p className="streak-task">Next target: {getNextMasteryLabel(chapterMastery.masteryScore)}</p>
          ) : null}
          <p className="streak-task">Today: {chapter.streakTask}</p>
        </aside>
      </section>

      {activeMission ? (
        <section className="section-shell chapter-mission-callout">
          <div>
            <p className="eyebrow">Revision mission</p>
            <h2>{activeMission.chapterTitle}</h2>
            <p className="subtext compact">{activeMission.reason}</p>
          </div>
          <Link className="button-link" href={`/chapters/${slug}/quiz`}>
            Retry quiz
          </Link>
        </section>
      ) : null}

      {hasPackNotes ? (
        <section className="section-shell chapter-definition-grid">
          <article className="definition-card">
            <p className="eyebrow">Chapter notes</p>
            <h2>{chapter.title} notes are live.</h2>
            <p className="subtext compact">
              Read the complete chapter pack with goals, concept flow, exam-friendly points, common mistakes, and practice prompts.
            </p>
          </article>
          <article className="definition-card soft">
            <p className="eyebrow">Revision path</p>
            <ul>
              <li>Start with the chapter goal.</li>
              <li>Revise each concept in order.</li>
              <li>Finish with the practice and board tips.</li>
            </ul>
            <Link className="card-link" href={`/chapters/${slug}/notes`}>
              Read chapter notes
            </Link>
          </article>
        </section>
      ) : null}

      <section className="section-shell" id="lesson-plan">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lesson path</p>
            <h2>{isLive ? 'Simple-English notes now live.' : 'Short videos, notes, quiz checkpoints.'}</h2>
            {quizContent && (
              <Link className="button-link" href={`/chapters/${slug}/quiz`}>Take chapter quiz</Link>
            )}
          </div>
          {isLive ? (
            <span className="section-badge">
              {hasLessonNotes ? `${chapter.lessons.length} lesson notes ready` : 'Chapter pack ready'}
            </span>
          ) : null}
        </div>
        {hasPackNotes && !hasLessonNotes ? (
          <div className="lesson-list">
            <article className="lesson-row">
              <span className="lesson-index">01</span>
              <div>
                <h3>Complete chapter notes</h3>
                <p>Chapter pack - 15 min</p>
                <p className="lesson-preview">{chapter.summary}</p>
              </div>
              <div className="lesson-actions">
                <span className="access-pill free">Free</span>
                <Link className="card-link lesson-open-link" href={`/chapters/${slug}/notes`}>
                  Open notes
                </Link>
              </div>
            </article>
          </div>
        ) : (
          <div className="lesson-list">
          {chapter.lessons.map((lesson, index) => {
            const href = lesson.fileName ? `/chapters/${slug}/lessons/${lesson.slug}` : undefined;

            return (
              <article className="lesson-row" key={lesson.title}>
                <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>
                    {lesson.type} - {lesson.minutes} min
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
        )}
      </section>
    </main>
  );
}

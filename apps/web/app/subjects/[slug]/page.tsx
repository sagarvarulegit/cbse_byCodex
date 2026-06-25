import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterEntries, hasChapterPack } from '../../../lib/course-content';
import { requireStudentSession } from '../../../lib/auth';
import { getCurriculumSubject } from '../../../lib/curriculum/registry';
import {
  buildSubjectCatalog,
  getCurriculumSubjectChapterEntries,
  resolveCurriculumSubjectSlug,
} from '../../../lib/curriculum/subject-navigation';
import { isPilotChapter } from '../../../lib/pilot';
import { logoutAction } from '../../auth-actions';

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = resolveCurriculumSubjectSlug(slug);
  const subject = getCurriculumSubject(resolvedSlug);

  if (!subject || subject.status !== 'active' || subject.visibleInCatalog !== true) {
    notFound();
  }

  const session = await requireStudentSession();
  const chapterEntries = getChapterEntries();
  const [subjectCatalogItem] = buildSubjectCatalog([subject], chapterEntries);
  const subjectChapters = getCurriculumSubjectChapterEntries(subject, chapterEntries);

  if (!subjectCatalogItem) {
    notFound();
  }

  return (
    <main>
      <nav className="topbar" aria-label="Subject navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/subjects" className="active">
            Subjects
          </Link>
        </div>
        <form action={logoutAction} className="topbar-form">
          <button className="ghost-button" type="submit">
            Logout
          </button>
        </form>
      </nav>

      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <div className="dashboard-hero">
            <p className="eyebrow">Class 10 CBSE</p>
            <h1>{subjectCatalogItem.title} Curriculum</h1>
            <p className="subtext compact">
              Master your Class 10 {subjectCatalogItem.title} syllabus with the current subject code, assessment mode, active session, and mapped chapter routes.
            </p>
          </div>

          <div className="chapter-topline" style={{ marginTop: '1rem' }}>
            <span>Code {subjectCatalogItem.subjectCode}</span>
            <span>{subjectCatalogItem.assessmentLabel}</span>
            <span>Session {subjectCatalogItem.academicSession}</span>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Curriculum registry</p>
              <h2>Mapped platform chapters</h2>
            </div>
            <span className="section-badge">
              {subjectCatalogItem.liveCount} of {subjectCatalogItem.chapterCount} chapters live
            </span>
          </div>

          <div className="chapter-grid" aria-label={`Chapters of ${subjectCatalogItem.title}`}>
            {subjectChapters.map(([chapterSlug, chapter]) => {
              const isLive = chapter.lessons.length > 0 || hasChapterPack(chapterSlug);
              const isPilot = isPilotChapter(chapterSlug);
              return (
                <article
                  className={`chapter-card ${subjectCatalogItem.accent} ${!isLive ? 'soft' : ''}`}
                  key={chapterSlug}
                  style={!isLive ? { opacity: 0.8 } : undefined}
                >
                  <div className="chapter-topline">
                    <span>{chapter.subject}</span>
                    <strong style={!isLive ? { background: 'var(--border)', color: 'var(--muted)' } : undefined}>
                      {isPilot ? 'Free pilot' : isLive ? chapter.mastery : 'Coming soon'}
                    </strong>
                  </div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.summary}</p>

                  {isLive && chapter.progress > 0 && (
                    <div className="progress-track" aria-label={`${chapter.progress}% complete`} style={{ margin: '14px 0 10px' }}>
                      <span style={{ width: `${chapter.progress}%` }} />
                    </div>
                  )}

                  {chapter.topics && chapter.topics.length > 0 && (
                    <ul>
                      {chapter.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  )}

                  {isLive ? (
                    <Link className="card-link" href={`/chapters/${chapterSlug}`} style={{ textAlign: 'center', display: 'block', padding: '10px 0' }}>
                      {isPilot ? 'Open pilot chapter' : 'Open chapter'}
                    </Link>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        background: 'var(--card-soft)',
                        color: 'var(--muted)',
                        textAlign: 'center',
                        display: 'block',
                        padding: '10px 0',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'not-allowed',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      Coming soon
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

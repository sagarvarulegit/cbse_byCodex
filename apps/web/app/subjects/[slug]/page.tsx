import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSubjectEntries, hasChapterPack } from '../../../lib/course-content';
import { requireStudentSession } from '../../../lib/auth';
import { logoutAction } from '../../auth-actions';

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const validSlugs = [
    'mathematics',
    'science',
    'english',
    'hindi',
    'social-science',
    'health-and-physical-education'
  ];

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const session = await requireStudentSession();

  const slugMeta: Record<string, { name: string; accent: string }> = {
    'mathematics': { name: 'Mathematics', accent: 'blue' },
    'science': { name: 'Science', accent: 'green' },
    'english': { name: 'English', accent: 'blue' },
    'hindi': { name: 'Hindi', accent: 'green' },
    'social-science': { name: 'Social Science', accent: 'blue' },
    'health-and-physical-education': { name: 'Health and Physical Education', accent: 'green' },
  };

  const { name: subjectName, accent: accentColor } = slugMeta[slug];

  const subjectChapters = getSubjectEntries(slug);

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
            <h1>{subjectName} Curriculum</h1>
            <p className="subtext compact">
              Master your Class 10 {subjectName} syllabus. Open active pilot chapters to start learning in a cleaner, visual, simple-English study flow.
            </p>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Syllabus overview</p>
              <h2>All NCERT Chapters</h2>
            </div>
            <span className="section-badge">
              {subjectChapters.filter(([chapterSlug, c]) => c.lessons.length > 0 || hasChapterPack(chapterSlug)).length} of {subjectChapters.length} chapters live
            </span>
          </div>

          <div className="chapter-grid" aria-label={`Chapters of ${subjectName}`}>
            {subjectChapters.map(([chapterSlug, chapter]) => {
              const isLive = chapter.lessons.length > 0 || hasChapterPack(chapterSlug);
              return (
                <article
                  className={`chapter-card ${accentColor} ${!isLive ? 'soft' : ''}`}
                  key={chapterSlug}
                  style={!isLive ? { opacity: 0.8 } : undefined}
                >
                  <div className="chapter-topline">
                    <span>{chapter.subject}</span>
                    <strong style={!isLive ? { background: 'var(--border)', color: 'var(--muted)' } : undefined}>
                      {isLive ? chapter.mastery : 'Coming soon'}
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
                      Open chapter
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

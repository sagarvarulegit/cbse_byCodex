import Link from 'next/link';
import { getChapterEntries } from '../../lib/course-content';
import { requireStudentSession } from '../../lib/auth';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import { buildSubjectCatalog } from '../../lib/curriculum/subject-navigation';
import { logoutAction } from '../auth-actions';

export default async function SubjectsPage() {
  const session = await requireStudentSession();
  const subjects = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  return (
    <main>
      <nav className="topbar" aria-label="Subjects navigation">
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
            <h1>Your Subjects</h1>
            <p className="subtext compact">
              Select any Class {session.classLevel} subject from the current curriculum registry to browse official codes, assessment mode, active session, and live chapters.
            </p>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Course catalog</p>
              <h2>All Available Subjects</h2>
            </div>
            <span className="section-badge">
              {subjects.length} subjects in {subjects[0]?.academicSession ?? 'the active session'}
            </span>
          </div>

          <div className="chapter-grid" aria-label="Subjects list">
            {subjects.map((subject) => (
              <article className={`chapter-card ${subject.accent}`} key={subject.slug}>
                <div className="chapter-topline">
                  <span>Code {subject.subjectCode} • Class {session.classLevel}</span>
                  <strong>{subject.assessmentLabel}</strong>
                </div>
                <h3>{subject.title}</h3>
                <p>{subject.description}</p>
                <div style={{ margin: '18px 0', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 700 }}>
                  Session {subject.academicSession} • {subject.liveCount} of {subject.chapterCount} chapters live
                </div>
                <Link
                  className="card-link"
                  href={`/subjects/${subject.slug}`}
                  style={{ textAlign: 'center', display: 'block', padding: '10px 0' }}
                >
                  View Chapters
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

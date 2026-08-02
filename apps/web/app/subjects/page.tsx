import Link from 'next/link';
import StudentTopbar from '../../components/StudentTopbar';
import { getChapterEntries } from '../../lib/course-content';
import { requireStudentSession } from '../../lib/auth';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import { buildSubjectCatalog } from '../../lib/curriculum/subject-navigation';

export default async function SubjectsPage() {
  const session = await requireStudentSession();
  const subjects = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  return (
    <main>
      <StudentTopbar contextLabel="Subject library" session={session} />

      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <span aria-current="page">Subjects</span>
          </nav>

          <div className="dashboard-hero">
            <p className="eyebrow">Class 10 CBSE</p>
            <h1>Your Subjects</h1>
            <p className="subtext compact">
              Choose a Class {session.classLevel} subject to see its chapters and continue to the chapter you want to study.
            </p>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Step 1 of 3</p>
              <h2>Choose a subject</h2>
            </div>
            <span className="section-badge">
              {subjects.length} subjects in {subjects[0]?.academicSession ?? 'the active session'}
            </span>
          </div>

          <div className="chapter-grid" aria-label="Subjects list">
            {subjects.map((subject) => (
              <article
                className={`chapter-card subject-card ${subject.accent}`}
                data-subject-motif={subject.slug}
                key={subject.slug}
              >
                <div className="chapter-topline">
                  <span>Code {subject.subjectCode} • Class {session.classLevel}</span>
                  <strong>{subject.assessmentLabel}</strong>
                </div>
                <h3>{subject.title}</h3>
                <p>{subject.description}</p>
                <div className="subject-card-meta">
                  Session {subject.academicSession} • {subject.liveCount} of {subject.chapterCount} chapters live
                </div>
                <Link
                  className="card-link"
                  href={`/subjects/${subject.slug}`}
                >
                  View {subject.title} chapters
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

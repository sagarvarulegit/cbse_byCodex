import Link from 'next/link';
import { getChapterEntries, getSubjectSlug, hasChapterPack } from '../../lib/course-content';
import { requireStudentSession } from '../../lib/auth';
import { logoutAction } from '../auth-actions';

export default async function SubjectsPage() {
  const session = await requireStudentSession();

  // Dynamically group chapters into subjects
  const allEntries = getChapterEntries();
  const subjectsMap = new Map<
    string,
    { name: string; slug: string; chapterCount: number; liveCount: number; accent: string; description: string }
  >();

  for (const [_, chapter] of allEntries) {
    const subjectName = chapter.subject;
    const subjectSlug = getSubjectSlug(subjectName);

    if (!subjectsMap.has(subjectSlug)) {
      let description = '';
      let accent = 'blue';

      if (subjectSlug === 'mathematics') {
        description = 'Master Algebra, Geometry, Trigonometry, and Probability. Study using interactive board-style worked examples, step-by-step proofs, and simple-English revision notes.';
        accent = 'blue';
      } else if (subjectSlug === 'science') {
        description = 'Explore Physics, Chemistry, and Biology. Learn using visual chemical equations, diagram breakdowns of human systems, and animated physics explainers.';
        accent = 'green';
      } else if (subjectSlug === 'english') {
        description = 'Enhance your comprehension, grammar, and literature skills with curated summaries and writing guides for First Flight and Footprints Without Feet.';
        accent = 'blue';
      } else if (subjectSlug === 'hindi') {
        description = 'Improve your vocabulary, grammar, and literature knowledge for CBSE Class 10 Hindi Course B, featuring chapter summaries and translation guides.';
        accent = 'green';
      } else if (subjectSlug === 'social-science') {
        description = 'Deep dive into History, Geography, Civics, and Economics. Learn about global events, resource distribution, democratic systems, and economic indicators.';
        accent = 'blue';
      } else if (subjectSlug === 'health-and-physical-education') {
        description = 'Understand the principles of physical fitness, balanced diets, community health, and basic safety/first-aid guidelines.';
        accent = 'green';
      }

      subjectsMap.set(subjectSlug, {
        name: subjectName,
        slug: subjectSlug,
        chapterCount: 0,
        liveCount: 0,
        accent,
        description,
      });
    }

    const item = subjectsMap.get(subjectSlug)!;
    item.chapterCount += 1;
    if (chapter.lessons.length > 0 || hasChapterPack(_)) {
      item.liveCount += 1;
    }
  }

  const subjects = Array.from(subjectsMap.values());

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
              Select any of the Class {session.classLevel} subjects below to browse NCERT chapters, active pilot topics, and video-first lessons.
            </p>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Course catalog</p>
              <h2>All Available Subjects</h2>
            </div>
            <span className="section-badge">{subjects.length} subjects registered</span>
          </div>

          <div className="chapter-grid" aria-label="Subjects list">
            {subjects.map((subject) => (
              <article className={`chapter-card ${subject.accent}`} key={subject.slug}>
                <div className="chapter-topline">
                  <span>Class {session.classLevel}</span>
                  <strong>{subject.liveCount} pilot chapter live</strong>
                </div>
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <div style={{ margin: '18px 0', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 700 }}>
                  Syllabus covers {subject.chapterCount} NCERT chapters
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

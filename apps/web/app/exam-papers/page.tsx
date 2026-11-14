import Link from 'next/link';

import ExamPaperStudio from '../../components/ExamPaperStudio';
import MockTestSeriesCard, { type SubjectSeriesEntry } from '../../components/MockTestSeriesCard';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSession,
  getStudentSessionToken,
} from '../../lib/auth';
import { getAllMockTestSeries } from '../../lib/exam-papers';

const ALL_UNLOCKED_SUBJECT_SLUGS = [
  'all',
  'mathematics-standard',
  'mathematics-basic',
  'science',
  'social-science',
  'english-language-and-literature',
  'hindi-course-a',
  'hindi-course-b',
];

const GUEST_SUBJECT_SHOWCASE = [
  {
    icon: '📐',
    title: 'Mathematics (041 / 241)',
    papers: ['Paper 1 · Full Syllabus 80M', 'Paper 2 · Algebra & Trig Focus', 'Paper 3 · Geometry & Mensuration', 'Paper 4 · CBSE Sample Blueprint', 'Paper 5 · Pre-Board HOTS'],
  },
  {
    icon: '🔬',
    title: 'Science (086)',
    papers: ['Paper 1 · Full Syllabus 80M', 'Paper 2 · Physics & Ray Optics', 'Paper 3 · Reactions & Carbon', 'Paper 4 · Biology & Heredity', 'Paper 5 · Competency Case-Based'],
  },
  {
    icon: '🌍',
    title: 'Social Science (087)',
    papers: ['Paper 1 · Full Syllabus 80M', 'Paper 2 · History & Nationalism', 'Paper 3 · Geography & Map Work', 'Paper 4 · Civics & Economics', 'Paper 5 · Pre-Board Full Sim'],
  },
  {
    icon: '📚',
    title: 'English Lang & Lit (184)',
    papers: ['Paper 1 · Full Syllabus 80M', 'Paper 2 · Reading & Grammar', 'Paper 3 · First Flight Extracts', 'Paper 4 · Footprints & Analytical', 'Paper 5 · Board Final Dress Rehearsal'],
  },
];

export default async function ExamPapersPage() {
  const [token, session] = await Promise.all([
    getStudentSessionToken(),
    getStudentSession(),
  ]);

  const seriesList = session && token ? await getAllMockTestSeries(token) : null;
  const validSeriesList: SubjectSeriesEntry[] = seriesList ?? [];

  return (
    <main>
      <PilotEngagementTracker
        eventType="tool_view"
        path="/exam-papers"
        surface="exam_papers"
      />
      <StudentTopbar contextLabel="Board Mock Test Series" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href={session ? '/dashboard' : '/'}>{session ? 'Dashboard' : 'Home'}</Link>
            <span>/</span>
            <span aria-current="page">Mock Test Series</span>
          </nav>

          {/* Smart Pacing Tip so students don't burn out on a 3-hr paper when they only have 5 minutes */}
          <div
            style={{
              background: '#fff8eb',
              border: '2px solid #171513',
              borderRadius: '16px',
              padding: '14px 18px',
              marginBottom: '20px',
              boxShadow: '3px 3px 0 #171513',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '0.98rem', color: '#171513' }}>
                ⏱️ Only have 2–5 minutes right now?
              </strong>
              <span style={{ fontSize: '0.86rem', color: '#55514b' }}>
                Full 80-mark papers take 3 hours. Warm up with a fast 5-Question Chapter Sprint first!
              </span>
            </div>
            <Link
              href="/quizzes"
              style={{
                background: '#171513',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.86rem',
                padding: '9px 15px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              ⚡ Start 2-Min Chapter Sprint →
            </Link>
          </div>

          {session ? (
            <>
              {validSeriesList.length > 0 ? (
                <MockTestSeriesCard
                  seriesList={validSeriesList}
                  token={token}
                  userFullName={session.fullName}
                  userEmail={session.email || undefined}
                  unlockedSubjects={ALL_UNLOCKED_SUBJECT_SLUGS}
                />
              ) : (
                <p className="subtext compact">
                  The mock test series is being prepared. Check back soon.
                </p>
              )}

              <hr className="dashboard-rule" />
              <ExamPaperStudio token={token} />
            </>
          ) : (
            <div
              style={{
                background: '#fffdfa',
                border: '2.5px solid #171513',
                borderRadius: '22px',
                padding: '28px 24px',
                boxShadow: '5px 5px 0 #171513',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '4px 11px',
                  borderRadius: '999px',
                  border: '1.5px solid #171513',
                  marginBottom: '10px',
                }}
              >
                🎉 100% FREE FOREVER · ZERO PAYWALLS
              </span>
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.65rem, 3vw, 2.25rem)', fontWeight: 950, color: '#171513' }}>
                20 Full 80-Mark CBSE Class 10 Board Mock Papers
              </h1>
              <p style={{ margin: '0 0 22px', fontSize: '1rem', color: '#55514b', maxWidth: '720px', lineHeight: 1.55 }}>
                Official 2026–27 CBSE 38-question blueprint with 15-minute reading timer, 3-hour CBT clock, printable PDF download, and step-by-step examiner marking schemes.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                  marginBottom: '24px',
                }}
              >
                {GUEST_SUBJECT_SHOWCASE.map((sub) => (
                  <div
                    key={sub.title}
                    style={{
                      background: '#ffffff',
                      border: '2px solid #171513',
                      borderRadius: '14px',
                      padding: '16px',
                      boxShadow: '3px 3px 0 #171513',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 900, color: '#171513', marginBottom: '10px' }}>
                      {sub.icon} {sub.title}
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#44403c', lineHeight: 1.7 }}>
                      {sub.papers.map((p) => (
                        <li key={p}>
                          {p} <strong style={{ color: '#047857' }}>· FREE</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <Link
                  href="/register?next=%2Fexam-papers"
                  style={{
                    background: '#c95014',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1rem',
                    padding: '13px 24px',
                    borderRadius: '12px',
                    border: '2px solid #171513',
                    boxShadow: '3px 3px 0 #171513',
                    textDecoration: 'none',
                  }}
                >
                  🚀 Create Free Account to Launch Any Paper (15s) →
                </Link>
                <Link
                  href="/login?next=%2Fexam-papers"
                  style={{
                    background: '#ffffff',
                    color: '#171513',
                    fontWeight: 850,
                    fontSize: '0.95rem',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    border: '2px solid #171513',
                    boxShadow: '3px 3px 0 #171513',
                    textDecoration: 'none',
                  }}
                >
                  Already have an account? Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

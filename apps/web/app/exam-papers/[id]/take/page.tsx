import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const ExamPaperRunner = dynamic(() => import('../../../../components/ExamPaperRunner'));
import StudentTopbar from '../../../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../../../lib/auth';
import { getExamPaper } from '../../../../lib/exam-papers';

export default async function TakeExamPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStudentSession();
  const token = await getStudentSessionToken();
  const data = await getExamPaper(token, id);

  if (!data?.paper) {
    return (
      <main>
        <StudentTopbar contextLabel="Mock Test Paywall" session={session} />
        <section className="auth-page dashboard-page">
          <div className="dashboard-shell">
            <nav className="breadcrumb-row" aria-label="Student learning path">
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/exam-papers">Mock Test Series</Link>
              <span>/</span>
              <span aria-current="page">Locked Paper</span>
            </nav>
            <div
              className="paywall-lock-banner"
              style={{
                background: '#fff',
                border: '2px solid #171513',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                margin: '2rem 0',
                boxShadow: '4px 4px 0 #171513',
              }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔒</span>
              <h2 style={{ margin: '0.5rem 0', fontSize: '1.6rem' }}>This Mock Test Paper is Locked</h2>
              <p style={{ color: '#555', maxWidth: '500px', margin: '0.5rem auto 1.5rem', lineHeight: '1.5' }}>
                Mock Paper 1 is 100% free across all 4 subjects. Papers 2–5 require the Class 10 Board Mock Test Pass (₹199 for all 4 subjects).
              </p>
              <Link
                href="/exam-papers"
                style={{
                  display: 'inline-block',
                  background: '#171513',
                  color: '#fff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                }}
              >
                View Mock Test Series & Unlock →
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <StudentTopbar contextLabel="Take Mock Test" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/exam-papers">Mock Test Series</Link>
            <span>/</span>
            <span aria-current="page">Take test</span>
          </nav>
          <ExamPaperRunner paper={data.paper} />
        </div>
      </section>
    </main>
  );
}

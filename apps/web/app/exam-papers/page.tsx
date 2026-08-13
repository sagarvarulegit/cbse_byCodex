import Link from 'next/link';

import ExamPaperStudio from '../../components/ExamPaperStudio';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../lib/auth';

export default async function ExamPapersPage() {
  const [session, token] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
  ]);

  return (
    <main>
      <StudentTopbar contextLabel="Sample Test Papers" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <span aria-current="page">Sample Test Papers</span>
          </nav>
          <ExamPaperStudio token={token} />
        </div>
      </section>
    </main>
  );
}

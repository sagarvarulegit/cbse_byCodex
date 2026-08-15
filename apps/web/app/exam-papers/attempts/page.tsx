import Link from 'next/link';

import ExamAttemptsPanel from '../../../components/ExamAttemptsPanel';
import StudentTopbar from '../../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../../lib/auth';
import { listExamPaperAttempts } from '../../../lib/exam-papers';

export default async function ExamAttemptsPage() {
  const [session, token] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
  ]);
  const data = await listExamPaperAttempts(token);

  return (
    <main>
      <StudentTopbar contextLabel="Mock Test Attempts" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/exam-papers">Mock Test Series</Link>
            <span>/</span>
            <span aria-current="page">My attempts</span>
          </nav>
          <ExamAttemptsPanel data={data} />
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';

import ExamPaperViewer from '../../../components/ExamPaperViewer';
import StudentTopbar from '../../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../../lib/auth';
import { getExamPaper } from '../../../lib/exam-papers';

export default async function ExamPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStudentSession();
  const token = await getStudentSessionToken();
  const data = await getExamPaper(token, id);

  if (!data?.paper) {
    notFound();
  }

  return (
    <main>
      <StudentTopbar contextLabel="Sample Test Paper" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/exam-papers">Sample Test Papers</Link>
            <span>/</span>
            <span aria-current="page">Paper {data.paper.seed}</span>
          </nav>
          <ExamPaperViewer paper={data.paper} />
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';

import ExamPaperStudio from '../../components/ExamPaperStudio';
import MockTestSeriesCard from '../../components/MockTestSeriesCard';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../lib/auth';
import { getMockTestSeries } from '../../lib/exam-papers';

export default async function ExamPapersPage() {
  const [session, token] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
  ]);
  const seriesData = await getMockTestSeries(token);

  return (
    <main>
      <StudentTopbar contextLabel="Board Mock Test Series" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <span aria-current="page">Mock Test Series</span>
          </nav>

          {seriesData ? (
            <MockTestSeriesCard series={seriesData.series} papers={seriesData.papers} />
          ) : (
            <p className="subtext compact">
              The mock test series is being prepared. Check back soon.
            </p>
          )}

          <hr className="dashboard-rule" />
          <ExamPaperStudio token={token} />
        </div>
      </section>
    </main>
  );
}

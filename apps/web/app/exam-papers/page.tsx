import Link from 'next/link';

import ExamPaperStudio from '../../components/ExamPaperStudio';
import MockTestSeriesCard, { type SubjectSeriesEntry } from '../../components/MockTestSeriesCard';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
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

export default async function ExamPapersPage() {
  const token = await getStudentSessionToken();
  const [session, seriesList] = await Promise.all([
    requireStudentSession(),
    getAllMockTestSeries(token),
  ]);

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
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <span aria-current="page">Mock Test Series</span>
          </nav>

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
        </div>
      </section>
    </main>
  );
}

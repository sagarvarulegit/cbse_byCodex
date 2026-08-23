import Link from 'next/link';

import ExamPaperStudio from '../../components/ExamPaperStudio';
import MockTestSeriesCard, { type SubjectSeriesEntry } from '../../components/MockTestSeriesCard';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../lib/auth';
import { getMockTestSeries } from '../../lib/exam-papers';
import { fetchStudentEntitlements } from '../../lib/payments';

export default async function ExamPapersPage() {
  const [session, token] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
  ]);

  const [mathsData, mathsBasicData, scienceData, socialScienceData, englishData, hindiAData, hindiBData, entitlements] = await Promise.all([
    getMockTestSeries(token, 'mathematics-standard'),
    getMockTestSeries(token, 'mathematics-basic'),
    getMockTestSeries(token, 'science'),
    getMockTestSeries(token, 'social-science'),
    getMockTestSeries(token, 'english-language-and-literature'),
    getMockTestSeries(token, 'hindi-course-a'),
    getMockTestSeries(token, 'hindi-course-b'),
    fetchStudentEntitlements(token),
  ]);

  const seriesList: SubjectSeriesEntry[] = [];
  if (mathsData) {
    seriesList.push(mathsData);
  }
  if (mathsBasicData) {
    seriesList.push(mathsBasicData);
  }
  if (scienceData) {
    seriesList.push(scienceData);
  }
  if (socialScienceData) {
    seriesList.push(socialScienceData);
  }
  if (englishData) {
    seriesList.push(englishData);
  }
  if (hindiAData) {
    seriesList.push(hindiAData);
  }
  if (hindiBData) {
    seriesList.push(hindiBData);
  }

  const unlockedSubjects = entitlements?.hasAllSubjects
    ? ['all', 'mathematics-standard', 'mathematics-basic', 'science', 'social-science', 'english-language-and-literature', 'hindi-course-a', 'hindi-course-b']
    : entitlements?.unlockedSubjectSlugs ?? [];

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

          {seriesList.length > 0 ? (
            <MockTestSeriesCard
              seriesList={seriesList}
              token={token}
              userFullName={session.fullName}
              userEmail={session.email || undefined}
              unlockedSubjects={unlockedSubjects}
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

import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession } from '../../lib/auth';
import { getStudentMastery } from '../../lib/mastery';
import { buildStudyRemixDashboardModel } from '../../lib/study-remix';

const BoardReadinessPredictor = dynamic(() => import('../../components/BoardReadinessPredictor'));
const StudyRemixDashboard = dynamic(() => import('../../components/StudyRemixDashboard'));

export const metadata: Metadata = {
  title: 'CBSE Class 10 Board Score Predictor & Readiness Index (2026/27)',
  description:
    'Free AI-powered CBSE Class 10 Board Exam Score Predictor, readiness index, section-by-section vulnerability analysis, and personalized 14-day revision blueprint across Science, Maths, SST, English, and Hindi.',
};

export default async function ShortReadinessPage() {
  const session = await getStudentSession();
  const mastery = session ? await getStudentMastery() : null;
  const remixModel =
    session && mastery ? buildStudyRemixDashboardModel({ mastery, session }) : null;

  return (
    <div className="readiness-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🎯 Score Predictor"
        session={session}
        streakLabel={remixModel?.student?.streakLabel}
      />
      <main style={{ padding: '1.5rem 1rem' }}>
        <BoardReadinessPredictor
          initialSubject="science"
          isLoggedIn={Boolean(session)}
        />
        {remixModel ? (
          <div style={{ maxWidth: '1120px', margin: '3rem auto 0' }}>
            <StudyRemixDashboard model={remixModel} />
          </div>
        ) : null}
      </main>
    </div>
  );
}

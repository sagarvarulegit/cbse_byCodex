import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../../components/StudentTopbar';
import { getStudentSession } from '../../../lib/auth';

const BoardReadinessPredictor = dynamic(() => import('../../../components/BoardReadinessPredictor'));

export const metadata: Metadata = {
  title: 'CBSE Class 10 Board Score Predictor & Readiness Index (2026/27)',
  description:
    'Free AI-powered CBSE Class 10 Board Exam Score Predictor, readiness index, section-by-section vulnerability analysis, and personalized 14-day revision blueprint across Science, Maths, SST, English, and Hindi.',
};

export default async function ReadinessPredictorPage() {
  const session = await getStudentSession();

  return (
    <div className="readiness-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🎯 Score Predictor"
        session={session}
      />
      <main style={{ padding: '1.5rem 1rem' }}>
        <BoardReadinessPredictor
          initialSubject="science"
          isLoggedIn={Boolean(session)}
        />
      </main>
    </div>
  );
}

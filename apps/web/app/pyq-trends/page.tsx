import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession } from '../../lib/auth';

const PyqTrendAnalyzer = dynamic(() => import('../../components/PyqTrendAnalyzer'));

export const metadata: Metadata = {
  title: 'CBSE Class 10 PYQ Trend & Chapter Weightage Analyzer (2022-2026)',
  description:
    'Interactive 5-year CBSE Board Exam question frequency analysis, chapter weightage heatmaps, 5-mark long answer patterns, and repeated concepts for Class 10.',
};

export default async function PyqTrendsPage() {
  const session = await getStudentSession();

  return (
    <div className="pyq-trends-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="📊 Board PYQ Trends"
        session={session}
      />
      <main style={{ padding: '1.5rem 1rem' }}>
        <PyqTrendAnalyzer
          initialSubject="science"
          isLoggedIn={Boolean(session)}
        />
      </main>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ParentSummaryView from '../../components/parent-summary/ParentSummaryView';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession, getStudentSessionToken } from '../../lib/auth';
import { listExamPaperAttempts } from '../../lib/exam-papers';
import { getStudentMastery } from '../../lib/mastery';
import { getStudentMistakes } from '../../lib/mistakes';
import { buildParentSummaryModel } from '../../lib/parent-summary';
import styles from '../../components/parent-summary/parent-summary.module.css';

export const metadata: Metadata = {
  title: 'Parent Progress Summary | ChapterReady Class 10',
  description:
    'Weekly study consistency, completed NCERT chapters, quiz scores, and CBSE Board Exam readiness report for parents and guardians.',
};

export default async function ParentSummaryPage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  if (!session) {
    redirect('/login?redirect=/parent-summary');
  }

  const [mastery, attemptsData, mistakesData] = await Promise.all([
    getStudentMastery(),
    listExamPaperAttempts(token).catch(() => null),
    getStudentMistakes('active').catch(() => null),
  ]);

  const model = buildParentSummaryModel({
    session,
    mastery,
    attemptsData,
    mistakesData,
  });

  return (
    <main className={styles.page}>
      <StudentTopbar
        contextLabel="👨‍👩‍👧 Parent Progress Summary"
        session={session}
        streakLabel={model.streakDays > 0 ? `${model.streakDays}-day streak` : undefined}
      />
      <ParentSummaryView model={model} />
    </main>
  );
}

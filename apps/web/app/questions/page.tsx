import React from 'react';
import type { Metadata } from 'next';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import { getAllSeoQuestions } from '../../lib/seo-questions';
import { getStudentSession } from '../../lib/auth';
import QuestionsHubClient from './QuestionsHubClient';

export const metadata: Metadata = {
  title: 'CBSE Class 10 Question Bank (2022–2026 PYQs & Exemplar HOTS) | ChapterReady',
  description:
    'Explore 1,669+ CBSE Class 10 authentic Board exam questions and NCERT Exemplar HOTS with official step-marking value points, examiner deduction warnings, and instant Socratic AI hints from Tara.',
  alternates: {
    canonical: 'https://www.chapterready.in/questions',
  },
  openGraph: {
    title: 'CBSE Class 10 Question Bank (2022–2026 PYQs & Exemplar HOTS) | ChapterReady',
    description:
      'Search 1,669+ authentic CBSE Class 10 Board PYQs & Exemplar HOTS with official value points, step marks, and 1-click Socratic hints.',
    url: 'https://www.chapterready.in/questions',
    type: 'website',
  },
};

export default async function QuestionsDirectoryPage() {
  const [session, allQuestions] = await Promise.all([
    getStudentSession(),
    getAllSeoQuestions(),
  ]);

  return (
    <>
      <PilotEngagementTracker
        eventType="resource_open"
        path="/questions"
        surface="questions"
      />
      <QuestionsHubClient initialQuestions={allQuestions} initialSession={session} />
    </>
  );
}

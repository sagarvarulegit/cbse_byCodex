import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PilotEngagementTracker from '../../../components/PilotEngagementTracker';
import StudentTopbar from '../../../components/StudentTopbar';
import { getStudentSession } from '../../../lib/auth';

const SciWordleGame = dynamic(() => import('../../../components/games/SciWordleGame'));

export const metadata: Metadata = {
  title: 'Sci-Wordle | Daily CBSE Class 10 NCERT Science & Maths Puzzle',
  description:
    'Daily 5-letter CBSE Class 10 NCERT Science & Maths concept puzzle. Guess the scientific term in 6 tries with live color feedback and board exam revision cards.',
};

export default async function SciWordlePage() {
  const session = await getStudentSession();

  return (
    <div className="arcade-page-wrapper">
      <PilotEngagementTracker
        eventType="tool_view"
        path="/games/sci-wordle"
        surface="games"
      />
      <StudentTopbar
        contextLabel="🎮 Arcade: Sci-Wordle"
        session={session}
      />
      <main className="arcade-main-container">
        <SciWordleGame />
      </main>
    </div>
  );
}

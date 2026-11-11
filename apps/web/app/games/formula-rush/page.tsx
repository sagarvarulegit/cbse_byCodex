import React from 'react';
import dynamic from 'next/dynamic';
import PilotEngagementTracker from '../../../components/PilotEngagementTracker';
import StudentTopbar from '../../../components/StudentTopbar';
const FormulaRushGame = dynamic(() => import('../../../components/games/FormulaRushGame'));
import { getStudentSession } from '../../../lib/auth';

export const metadata = {
  title: 'Formula Rush | CBSE Class 10 Game Arcade',
  description: 'Fast-paced NCERT Maths & Science formula recall game for CBSE Class 10 board exam preparation.',
};

export default async function FormulaRushPage() {
  const session = await getStudentSession();

  return (
    <div className="arcade-page-wrapper">
      <PilotEngagementTracker
        eventType="tool_view"
        path="/games/formula-rush"
        surface="games"
      />
      <StudentTopbar
        contextLabel="🎮 Arcade: Formula Rush"
        session={session}
      />
      <main className="arcade-main-container">
        <FormulaRushGame />
      </main>
    </div>
  );
}

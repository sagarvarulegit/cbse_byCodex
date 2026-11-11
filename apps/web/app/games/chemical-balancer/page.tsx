import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PilotEngagementTracker from '../../../components/PilotEngagementTracker';
import StudentTopbar from '../../../components/StudentTopbar';
import { getStudentSession } from '../../../lib/auth';

const ChemicalBalancerGame = dynamic(
  () => import('../../../components/games/ChemicalBalancerGame')
);

export const metadata: Metadata = {
  title: 'Chemical Balancer Blitz | CBSE Class 10 Chemistry Reaction Game',
  description:
    'Fast-paced stoichiometric coefficient balancing game for CBSE Class 10 NCERT chemistry equations with live atom balance scales and board exam observations.',
};

export default async function ChemicalBalancerPage() {
  const session = await getStudentSession();

  return (
    <div className="arcade-page-wrapper">
      <PilotEngagementTracker
        eventType="tool_view"
        path="/games/chemical-balancer"
        surface="games"
      />
      <StudentTopbar
        contextLabel="🎮 Arcade: Chemical Balancer"
        session={session}
      />
      <main className="arcade-main-container">
        <ChemicalBalancerGame />
      </main>
    </div>
  );
}

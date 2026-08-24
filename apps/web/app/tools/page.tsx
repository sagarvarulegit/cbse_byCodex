import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession } from '../../lib/auth';

const ToolsHubClient = dynamic(() => import('../../components/ToolsHubClient'));

export const metadata: Metadata = {
  title: 'Study & Revision Tools Hub | CBSE Class 10 Learning Suite',
  description:
    'Explore high-yield CBSE Class 10 study tools: 5-year PYQ trend analytics, 27-chapter formula cheatsheets, virtual science labs & diagrams, active recall arcade games, and board mock simulators.',
};

export default async function ToolsPage() {
  const session = await getStudentSession();

  return (
    <div className="tools-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🛠️ Study Tools Hub"
        session={session}
      />
      <main style={{ padding: '1.5rem 1rem' }}>
        <ToolsHubClient />
      </main>
    </div>
  );
}

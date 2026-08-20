import React from 'react';
import type { Metadata } from 'next';
import StudentTopbar from '../../components/StudentTopbar';
import ActivityDiagramViewer from '../../components/ActivityDiagramViewer';
import { getStudentSession, getStudentSessionToken } from '../../lib/auth';
import { fetchStudentEntitlements, checkHasActivityDiagramPack } from '../../lib/payments';

export const metadata: Metadata = {
  title: 'NCERT Activity & Diagram Mastery Pack | CBSE Class 10 Science',
  description:
    'Complete step-by-step breakdown of all Class 10 NCERT Science activities, experimental setups, chemical reactions, diagram-labeling drills, and CBSE board exam questions.',
};

export default async function ActivitiesAndDiagramsPage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  const entitlements = token ? await fetchStudentEntitlements(token) : null;
  const isUnlocked = checkHasActivityDiagramPack(entitlements);

  return (
    <div className="activity-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🔬 NCERT Activities & Diagrams"
        session={session}
      />
      <main>
        <ActivityDiagramViewer
          isUnlocked={isUnlocked}
          token={token}
          userFullName={session?.user?.fullName}
          userEmail={session?.user?.email || undefined}
        />
      </main>
    </div>
  );
}

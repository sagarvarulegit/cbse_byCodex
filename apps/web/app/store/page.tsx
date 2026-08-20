import React from 'react';
import type { Metadata } from 'next';
import StudentTopbar from '../../components/StudentTopbar';
import StoreClientView from '../../components/StoreClientView';
import { getStudentSession, getStudentSessionToken } from '../../lib/auth';
import { fetchStudentEntitlements } from '../../lib/payments';

export const metadata: Metadata = {
  title: 'ChapterReady Store | CBSE Class 10 Board Exam Revision & Mock Packs',
  description:
    'Explore official CBSE Class 10 NCERT Activity Packs, 1-Page Formula Cheatsheets, 80-Mark Mock Papers, and Unlimited Quizzes. All products under ₹200 INR with 48-hour satisfaction guarantee.',
};

export default async function StorePage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  const entitlements = token ? await fetchStudentEntitlements(token) : null;

  return (
    <div className="store-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🛍️ ChapterReady Store"
        session={session}
      />
      <main>
        <StoreClientView
          session={session}
          token={token}
          entitlements={entitlements}
        />
      </main>
    </div>
  );
}

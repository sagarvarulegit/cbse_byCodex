import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../components/StudentTopbar';
const SciencePackLanding = dynamic(() => import('../../components/SciencePackLanding'));
import { getStudentSession, getStudentSessionToken } from '../../lib/auth';
import { fetchStudentEntitlements, checkHasSciencePack } from '../../lib/payments';

export const metadata: Metadata = {
  title: 'Class 10 Science (Ch 1–5) Board Blueprint & PYQ Pack (₹99) | ChapterReady',
  description:
    'Instant access to 10-year verified Previous Year Questions (PYQs), official CBSE step-wise marking schemes, all 13 NCERT experimental activity breakdowns, and 1-page formula cheatsheets for Chapters 1 to 5.',
};

export default async function SciencePackPage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  const entitlements = token ? await fetchStudentEntitlements(token) : null;
  const isUnlocked = checkHasSciencePack(entitlements);

  return (
    <div className="science-pack-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="🧪 Science Ch 1–5 Board Pack"
        session={session}
      />
      <main>
        <SciencePackLanding
          session={session}
          token={token}
          isUnlocked={isUnlocked}
        />
      </main>
    </div>
  );
}

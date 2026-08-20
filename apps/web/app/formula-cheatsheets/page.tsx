import React from 'react';
import type { Metadata } from 'next';
import StudentTopbar from '../../components/StudentTopbar';
import FormulaCheatsheetViewer from '../../components/FormulaCheatsheetViewer';
import { getStudentSession, getStudentSessionToken } from '../../lib/auth';
import { fetchStudentEntitlements, checkHasFormulaCheatsheetPack } from '../../lib/payments';

export const metadata: Metadata = {
  title: 'Class 10 Formula & Reaction Cheatsheets | CBSE Maths & Science',
  description:
    'Ultra-dense 1-page printable summary sheets per chapter for Class 10 Maths & Science + interactive digital flashcards for fast board exam revision.',
};

export default async function FormulaCheatsheetsPage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  const entitlements = token ? await fetchStudentEntitlements(token) : null;
  const isUnlocked = checkHasFormulaCheatsheetPack(entitlements);

  return (
    <div className="cheatsheet-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar
        contextLabel="⚡ Formula Cheatsheets"
        session={session}
      />
      <main>
        <FormulaCheatsheetViewer
          isUnlocked={isUnlocked}
          token={token}
          userFullName={session?.fullName}
          userEmail={session?.email || undefined}
        />
      </main>
    </div>
  );
}

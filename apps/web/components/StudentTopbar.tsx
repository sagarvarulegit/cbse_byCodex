import Link from 'next/link';

import { logoutAction } from '../app/auth-actions';
import type { SessionUser } from '../lib/auth';
import BrandLockup from './BrandLockup';

type StudentTopbarProps = {
  contextLabel?: string;
  session?: SessionUser | null;
  streakLabel?: string;
};

function getInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function StudentTopbar({
  contextLabel,
  session,
  streakLabel,
}: StudentTopbarProps) {
  const firstName = session?.fullName.split(/\s+/).filter(Boolean)[0] ?? 'Student';

  return (
    <header className="student-topbar">
      <Link
        aria-label="ChapterReady dashboard"
        className="student-topbar-brand"
        href={session ? '/dashboard' : '/'}
      >
        <BrandLockup compact />
      </Link>

      {contextLabel ? (
        <span className="student-topbar-context">{contextLabel}</span>
      ) : null}

      <nav aria-label="Student shortcuts" className="student-topbar-nav">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/store" style={{ fontWeight: 800, color: '#c95014' }}>🛍️ Store</Link>
        <Link href="/pyq-trends">📊 PYQ Trends</Link>
        <Link href="/activities-and-diagrams">🔬 Activities</Link>
        <Link href="/formula-cheatsheets">⚡ Formulas</Link>
        <Link href="/games">🎮 Arcade</Link>
        <Link href="/quizzes">Quizzes</Link>
        <Link href="/exam-papers">Mock Papers</Link>
        <Link href="/subjects">Subjects</Link>
        {session ? <Link href="/my-mistakes">My Mistakes</Link> : null}
      </nav>

      {session ? (
        <div className="student-topbar-tools">
          {streakLabel ? (
            <span className="student-topbar-streak">{streakLabel}</span>
          ) : null}

          <details className="student-account-menu">
            <summary aria-label={`Open ${firstName}'s student menu`}>
              <span className="student-account-avatar">
                {getInitials(session.fullName) || '10'}
              </span>
              <span className="student-account-copy">
                <strong>{firstName}</strong>
                <span>Class {session.classLevel}</span>
              </span>
              <span className="student-account-menu-label">Menu</span>
            </summary>
            <div className="student-account-popover">
              <span className="student-account-popover-heading">
                <strong>{session.fullName}</strong>
                <span>{session.email ?? `Class ${session.classLevel} student`}</span>
              </span>
              <Link href="/dashboard">Today&apos;s mix</Link>
              <Link href="/store" style={{ fontWeight: 800, color: '#c95014' }}>🛍️ ChapterReady Store</Link>
              <Link href="/activities-and-diagrams">🔬 NCERT Activities (₹99)</Link>
              <Link href="/formula-cheatsheets">⚡ Formula Cheatsheets (₹49)</Link>
              <Link href="/games">🎮 Fun &amp; Games</Link>
              <Link href="/subjects">Subjects</Link>
              <Link href="/my-mistakes">My Mistakes</Link>
              <Link href="/orders">📦 My Purchases &amp; Receipts</Link>
              <Link href="/profile">⚙️ Edit Profile &amp; Phone</Link>
              <form action={logoutAction}>
                <button type="submit">Logout</button>
              </form>
            </div>
          </details>
        </div>
      ) : (
        <nav aria-label="Student account" className="student-topbar-auth">
          <Link href="/login">Login</Link>
          <Link href="/register">Create account</Link>
        </nav>
      )}
    </header>
  );
}

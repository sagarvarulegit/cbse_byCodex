import Link from 'next/link';

import { logoutAction } from '../app/auth-actions';
import type { SessionUser } from '../lib/auth';

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
        aria-label="CBSE Sprint Study Remix dashboard"
        className="student-topbar-brand"
        href={session ? '/dashboard' : '/'}
      >
        <span className="student-topbar-mark">10</span>
        <span className="student-topbar-brand-copy">
          <strong>CBSE Sprint</strong>
          <span>Study Remix</span>
        </span>
      </Link>

      {contextLabel ? (
        <span className="student-topbar-context">{contextLabel}</span>
      ) : null}

      <nav aria-label="Student shortcuts" className="student-topbar-nav">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/subjects">Library</Link>
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
              <Link href="/subjects">Full subject library</Link>
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

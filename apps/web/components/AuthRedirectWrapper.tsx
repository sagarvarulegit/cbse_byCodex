'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSafeNextPath } from '../lib/auth-redirect';

export function AuthRedirectWrapper({
  children,
  loggedInTitle = 'Already logged in',
  loggedInDesc = 'You are already signed in. Open your student hub and continue from there.'
}: {
  children: React.ReactNode;
  loggedInTitle?: string;
  loggedInDesc?: string;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.cookie.includes('cbse_student_session')) {
      setIsLoggedIn(true);
      // Deep links (e.g. a chapter PYQ drill) land here when the session
      // expired mid-journey — continue instead of stranding the student.
      const next = new URLSearchParams(window.location.search).get('next');
      if (next) {
        router.replace(getSafeNextPath(next));
      }
    }
  }, [router]);

  if (!mounted) {
    // Show children on server/first render to allow static HTML generation
    return <>{children}</>;
  }

  if (isLoggedIn) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Student access</p>
          <h1>{loggedInTitle}</h1>
          <p className="subtext compact">{loggedInDesc}</p>
          <div className="auth-inline-actions">
            <Link className="button-link" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="ghost-link" href="/">
              Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

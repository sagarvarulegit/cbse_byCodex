'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function AuthAwareCTA({
  hrefLoggedIn,
  hrefLoggedOut,
  textLoggedIn,
  textLoggedOut,
  className,
  style
}: {
  hrefLoggedIn: string;
  hrefLoggedOut: string;
  textLoggedIn: string;
  textLoggedOut: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple check for the session cookie
    if (document.cookie.includes('cbse_student_session')) {
      setIsLoggedIn(true);
    }
  }, []);

  // Before mounting, we can show the logged-out version as a fallback,
  // or a skeleton. Since it's SSG, the server renders the logged-out version.
  const href = mounted && isLoggedIn ? hrefLoggedIn : hrefLoggedOut;
  const text = mounted && isLoggedIn ? textLoggedIn : textLoggedOut;

  return (
    <Link className={className} href={href} style={style}>
      {text}
    </Link>
  );
}

export function AuthAwareText({
  textLoggedIn,
  textLoggedOut,
  className,
}: {
  textLoggedIn: React.ReactNode;
  textLoggedOut: React.ReactNode;
  className?: string;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.cookie.includes('cbse_student_session')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <span className={className}>
      {mounted && isLoggedIn ? textLoggedIn : textLoggedOut}
    </span>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStudentSession } from '../lib/use-student-session';

export function AuthAwareCTA({
  hrefLoggedIn,
  hrefLoggedOut,
  textLoggedIn,
  textLoggedOut,
  className,
  style,
}: {
  hrefLoggedIn: string;
  hrefLoggedOut: string;
  textLoggedIn: React.ReactNode;
  textLoggedOut: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const session = useStudentSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = Boolean(session);
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
  const session = useStudentSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = Boolean(session);

  return (
    <span className={className}>
      {mounted && isLoggedIn ? textLoggedIn : textLoggedOut}
    </span>
  );
}

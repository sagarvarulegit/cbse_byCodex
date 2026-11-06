'use client';

import { useEffect, useState } from 'react';
import type { SessionUser } from './auth';

function parseSessionCookie(): SessionUser | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cbse_student_session='));

  if (!cookie) {
    return null;
  }

  const rawToken = cookie.split('=')[1];
  if (!rawToken) {
    return null;
  }

  const token = decodeURIComponent(rawToken);
  const payloadStr = token.split('.')[0];
  if (!payloadStr) {
    return null;
  }

  try {
    const base64Url = payloadStr;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);

    if (payload && payload.userId && payload.fullName) {
      return {
        id: payload.userId,
        role: payload.role,
        fullName: payload.fullName,
        classLevel: payload.classLevel ?? 10,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function useStudentSession(initialSession?: SessionUser | null): SessionUser | null {
  const [session, setSession] = useState<SessionUser | null>(() => {
    if (initialSession !== undefined) {
      return initialSession;
    }
    return parseSessionCookie();
  });

  useEffect(() => {
    if (initialSession !== undefined) {
      setSession(initialSession);
      return;
    }

    const parsed = parseSessionCookie();
    if (parsed) {
      setSession(parsed);
      return;
    }

    let isMounted = true;
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted) {
          setSession(data?.session ?? null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialSession]);

  return session;
}

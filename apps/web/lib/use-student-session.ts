'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { SessionUser } from './auth';

export function parseSessionCookie(): SessionUser | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cbse_student_session='));

  if (!cookie) {
    return null;
  }

  const rawToken = cookie.slice('cbse_student_session='.length);
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
      if (typeof payload.exp === 'number' && payload.exp <= Math.floor(Date.now() / 1000)) {
        return null;
      }
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
  const pathname = usePathname();
  const [session, setSession] = useState<SessionUser | null>(() => {
    if (initialSession !== undefined) {
      return initialSession;
    }
    return parseSessionCookie();
  });

  useEffect(() => {
    const syncSession = () => {
      const parsed = parseSessionCookie();
      if (parsed) {
        setSession((prev) =>
          prev?.id === parsed.id && prev?.fullName === parsed.fullName ? prev : parsed,
        );
        return;
      }

      if (initialSession !== undefined && initialSession !== null) {
        setSession(initialSession);
        return;
      }

      fetch('/api/auth/session', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const next = data?.session ?? null;
          setSession((prev) => {
            if (!prev && !next) return null;
            if (prev?.id === next?.id && prev?.fullName === next?.fullName) return prev;
            return next;
          });
        })
        .catch(() => {
          setSession(null);
        });
    };

    syncSession();

    const handleAuthChange = () => syncSession();
    window.addEventListener('cbse:auth-change', handleAuthChange);
    window.addEventListener('focus', handleAuthChange);

    return () => {
      window.removeEventListener('cbse:auth-change', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, [initialSession, pathname]);

  return session;
}

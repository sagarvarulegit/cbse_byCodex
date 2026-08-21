'use client';

import { useEffect, useState } from 'react';
import StudentTopbar from './StudentTopbar';
import type { SessionUser } from '../lib/auth';

export default function ClientStudentTopbar({
  contextLabel,
  streakLabel,
}: {
  contextLabel?: string;
  streakLabel?: string;
}) {
  const [session, setSession] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('cbse_student_session='));
    if (!cookie) {
      setSession(null);
      return;
    }
    const token = decodeURIComponent(cookie.split('=')[1]);
    const payloadStr = token.split('.')[0];
    if (!payloadStr) {
      setSession(null);
      return;
    }
    try {
      const base64Url = payloadStr;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      if (payload && payload.userId && payload.fullName) {
        setSession({
          id: payload.userId,
          role: payload.role,
          fullName: payload.fullName,
          classLevel: payload.classLevel ?? 10,
          email: payload.email ?? null,
          phone: payload.phone ?? null,
        });
      } else {
        setSession(null);
      }
    } catch (e) {
      setSession(null);
    }
  }, []);

  // While mounting on client, show logged-out version to match SSR
  return (
    <StudentTopbar
      contextLabel={contextLabel}
      streakLabel={streakLabel}
      session={session === undefined ? null : session}
    />
  );
}

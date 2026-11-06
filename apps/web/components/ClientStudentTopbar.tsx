'use client';

import StudentTopbar from './StudentTopbar';
import { useStudentSession } from '../lib/use-student-session';

export default function ClientStudentTopbar({
  contextLabel,
  streakLabel,
}: {
  contextLabel?: string;
  streakLabel?: string;
}) {
  const session = useStudentSession();

  return (
    <StudentTopbar
      contextLabel={contextLabel}
      streakLabel={streakLabel}
      session={session}
    />
  );
}

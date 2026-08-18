import { redirect } from 'next/navigation';

import ProfileSettingsView from '../../components/ProfileSettingsView';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSession,
  getStudentSessionToken,
} from '../../lib/auth';
import { fetchStudentProfile } from '../../lib/profile';

export default async function ProfilePage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  if (!session || !token) {
    redirect('/login?redirect=/profile');
  }

  const profile = await fetchStudentProfile(token);

  if (!profile) {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fbf8f3', paddingBottom: '4rem' }}>
      <StudentTopbar
        contextLabel="Account Profile"
        session={session}
      />
      <ProfileSettingsView
        session={session}
        token={token}
        initialProfile={profile}
      />
    </main>
  );
}

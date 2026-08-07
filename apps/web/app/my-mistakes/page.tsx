import Link from 'next/link';
import { redirect } from 'next/navigation';

import MyMistakesList from '../../components/MyMistakesList';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession } from '../../lib/auth';
import { getStudentMistakes, type MistakesPayload } from '../../lib/mistakes';

export default async function MyMistakesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const requestedStatus = (await searchParams).status;
  const status: MistakesPayload['status'] =
    requestedStatus === 'resolved' || requestedStatus === 'all'
      ? requestedStatus
      : 'active';
  const [session, payload] = await Promise.all([
    getStudentSession(),
    getStudentMistakes(status),
  ]);
  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <StudentTopbar contextLabel="Personal revision" session={session} />
      <section className="section-shell mistakes-hero">
        <nav className="breadcrumb-row" aria-label="Student learning path">
          <Link href="/dashboard">Dashboard</Link>
          <span>/</span>
          <span aria-current="page">My Mistakes</span>
        </nav>
        <p className="eyebrow">Your personal revision list</p>
        <h1>My Mistakes</h1>
        <p>
          Incorrect quiz questions, weak concepts, hint use, and missed written-answer
          marking points collect here automatically. Retry each one after three days.
        </p>
        <nav className="mistakes-filter" aria-label="Mistake list filter">
          <Link aria-current={status === 'active' ? 'page' : undefined} href="/my-mistakes">Active</Link>
          <Link aria-current={status === 'resolved' ? 'page' : undefined} href="/my-mistakes?status=resolved">Revised</Link>
          <Link aria-current={status === 'all' ? 'page' : undefined} href="/my-mistakes?status=all">All</Link>
        </nav>
      </section>
      <MyMistakesList initialItems={payload.items} status={status} />
    </main>
  );
}

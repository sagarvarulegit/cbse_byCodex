import Link from 'next/link';

import { registerAction } from '../auth-actions';
import { getStudentSession } from '../../lib/auth';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getStudentSession();
  if (session) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Student access</p>
          <h1>Account already ready</h1>
          <p className="subtext compact">You are already signed in as {session.fullName}. Open your student hub and continue learning.</p>
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

  const params = searchParams ? await searchParams : undefined;
  const error = Array.isArray(params?.error) ? params?.error[0] : params?.error;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Student onboarding</p>
        <h1>Create your free Class 10 account</h1>
        <p className="subtext compact">Join the live pilot to access clear chapter notes, visual learning flows, and a single place to return for revision.</p>
        {error ? <p className="auth-error">{error}</p> : null}
        <form action={registerAction} className="auth-form">
          <label className="auth-field">
            <span>Full name</span>
            <input name="fullName" type="text" autoComplete="name" placeholder="Student name" required />
          </label>
          <label className="auth-field">
            <span>Class / standard</span>
            <select name="classLevel" defaultValue="10" required>
              <option value="10">Class 10 (live now)</option>
            </select>
          </label>
          <label className="auth-field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" placeholder="student@example.com" required />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required />
          </label>
          <label className="auth-field">
            <span>Confirm password</span>
            <input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Type the same password again" required />
          </label>
          <button className="auth-submit" type="submit">
            Create account
          </button>
        </form>
        <p className="auth-hint">
          Already registered? <Link href="/login">Login here</Link>.
        </p>
      </section>
    </main>
  );
}

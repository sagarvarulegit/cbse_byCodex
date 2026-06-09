import Link from 'next/link';

import { loginAction } from '../auth-actions';
import { getStudentSession } from '../../lib/auth';

export default async function LoginPage({
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
          <h1>Already logged in</h1>
          <p className="subtext compact">You are signed in as {session.fullName}. Open your student hub and continue from there.</p>
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
        <p className="eyebrow">Student access</p>
        <h1>Login to open your study hub</h1>
        <p className="subtext compact">Use your registered email and password to access the live Class 10 pilot chapters from one place.</p>
        {error ? <p className="auth-error">{error}</p> : null}
        <form action={loginAction} className="auth-form">
          <label className="auth-field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" placeholder="student@example.com" required />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
          </label>
          <button className="auth-submit" type="submit">
            Login
          </button>
        </form>
        <p className="auth-hint">
          New here? <Link href="/register">Create your student account</Link>.
        </p>
      </section>
    </main>
  );
}

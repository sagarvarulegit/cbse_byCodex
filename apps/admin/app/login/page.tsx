import Link from 'next/link';

import { loginAction } from '../auth-actions';
import { getAdminSession } from '../../lib/auth';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  if (session) {
    return (
      <main className="admin-auth-page">
        <section className="admin-auth-card">
          <p className="admin-eyebrow">Admin access</p>
          <h1>Already signed in</h1>
          <p>You are logged in as {session.fullName}. Continue to the content workspace.</p>
          <div className="admin-inline-actions">
            <Link className="admin-primary-link" href="/">
              Open dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const params = searchParams ? await searchParams : undefined;
  const error = Array.isArray(params?.error) ? params?.error[0] : params?.error;

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="admin-eyebrow">Admin access</p>
        <h1>Login to manage content</h1>
        <p>Use an existing admin account to review lessons, publish updates, and check the pilot chapter pipeline.</p>
        {error ? <p className="admin-auth-error">{error}</p> : null}
        <form action={loginAction} className="admin-auth-form">
          <label>
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" placeholder="admin@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
          </label>
          <button type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}

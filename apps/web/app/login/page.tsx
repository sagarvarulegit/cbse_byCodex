import Link from 'next/link';
import { Suspense } from 'react';

import { loginAction } from '../auth-actions';
import { AuthRedirectWrapper } from '../../components/AuthRedirectWrapper';
import { LoginErrorDisplay } from './LoginErrorDisplay';

export const revalidate = false;

export default function LoginPage() {
  return (
    <AuthRedirectWrapper>
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Student access</p>
          <h1>Login to open your study hub</h1>
          <p className="subtext compact">Use your registered email and password to access the live Class 10 pilot chapters from one place.</p>
          <Suspense fallback={null}>
            <LoginErrorDisplay />
          </Suspense>
          <form action={loginAction} className="auth-form">
            <label className="auth-field">
              <span>Email address</span>
              <input name="email" type="email" autoComplete="email" placeholder="student@example.com" required />
            </label>
            <label className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Password</span>
                <Link href="/recover-account?mode=password" style={{ fontSize: '0.8125rem', color: '#c25e00', textDecoration: 'underline' }}>
                  Forgot password?
                </Link>
              </div>
              <input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            </label>
            <button className="auth-submit" type="submit">
              Login
            </button>
          </form>
          <p className="auth-hint">
            Forgot your registered email? <Link href="/recover-account?mode=find"><strong>Find your account</strong></Link>.
          </p>
          <p className="auth-hint">
            New here? <Link href="/register">Create your student account</Link>.
          </p>
          <p className="auth-hint">
            Read the <Link href="/privacy">Pilot Privacy Notice</Link>.
          </p>
        </section>
      </main>
    </AuthRedirectWrapper>
  );
}

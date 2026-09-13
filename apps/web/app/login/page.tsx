import Link from 'next/link';
import { Suspense } from 'react';

import { AuthRedirectWrapper } from '../../components/AuthRedirectWrapper';
import { LoginErrorDisplay } from './LoginErrorDisplay';
import { LoginForm } from './LoginForm';

export const revalidate = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : '/register';
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
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
          <p className="auth-hint">
            Forgot your registered email? <Link href="/recover-account?mode=find"><strong>Find your account</strong></Link>.
          </p>
          <p className="auth-hint">
            New here? <Link href={registerHref}>Create your student account</Link>.
          </p>
          <p className="auth-hint">
            Read the <Link href="/privacy">Pilot Privacy Notice</Link>.
          </p>
        </section>
      </main>
    </AuthRedirectWrapper>
  );
}

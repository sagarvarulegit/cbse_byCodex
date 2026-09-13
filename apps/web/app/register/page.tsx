import Link from 'next/link';
import { Suspense } from 'react';

import { AuthRedirectWrapper } from '../../components/AuthRedirectWrapper';
import { LoginErrorDisplay } from '../login/LoginErrorDisplay';
import { RegisterForm } from './RegisterForm';

export const revalidate = false;

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login';
  return (
    <AuthRedirectWrapper loggedInTitle="Account already ready" loggedInDesc="You are already signed in. Open your student hub and continue learning.">
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Student onboarding</p>
          <h1>Create your free Class 10 account</h1>
          <p className="subtext compact">Join the live pilot to access clear chapter notes, visual learning flows, and a single place to return for revision.</p>
          <Suspense fallback={null}>
            <LoginErrorDisplay />
          </Suspense>
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
          <p className="auth-hint">
            Already registered? <Link href={loginHref}>Login here</Link>.
          </p>
          <p className="auth-hint">
            Account data is handled under the <Link href="/privacy">Pilot Privacy Notice</Link>.
          </p>
        </section>
      </main>
    </AuthRedirectWrapper>
  );
}

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '../auth-actions';
import { initialAuthActionState } from '../auth-state';
import { useActionState, useEffect } from 'react';
import { getSafeNextPath } from '../../lib/auth-redirect';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, initialAuthActionState);

  useEffect(() => {
    if (state.ok) {
      router.push(getSafeNextPath(searchParams.get('next')));
      router.refresh();
    }
  }, [state.ok, router, searchParams]);

  return (
    <form action={formAction} className="auth-form">
      {state.error ? (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      ) : null}
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
      <button className="auth-submit" type="submit" disabled={isPending}>
        {isPending ? 'Logging in…' : 'Login'}
      </button>
    </form>
  );
}

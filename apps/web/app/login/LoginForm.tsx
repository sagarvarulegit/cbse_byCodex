'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { getSafeNextPath } from '../../lib/auth-redirect';
import { loginAction } from '../auth-actions';
import { initialAuthActionState } from '../auth-state';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, initialAuthActionState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.ok) {
      window.dispatchEvent(new Event('cbse:auth-change'));
      router.push(getSafeNextPath(searchParams.get('next')));
      router.refresh();
    }
  }, [state.ok, router, searchParams]);

  return (
    <div>
      <GoogleSignInButton mode="login" />
      <form action={formAction} className="auth-form">
        {state.error ? (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <label className="auth-field">
          <span>Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="student@example.com"
            required
          />
        </label>
        <label className="auth-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Password</span>
            <Link
              href="/recover-account?mode=password"
              style={{ fontSize: '0.8125rem', color: '#a84a08', textDecoration: 'underline' }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="auth-password-wrap">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        <button className="auth-submit" type="submit" disabled={isPending}>
          {isPending ? 'Logging in…' : 'Login to Study Hub'}
        </button>
      </form>
    </div>
  );
}

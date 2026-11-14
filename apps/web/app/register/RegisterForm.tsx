'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { getSafePostSignupPath } from '../../lib/auth-redirect';
import { registerAction } from '../auth-actions';
import { initialAuthActionState } from '../auth-state';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(registerAction, initialAuthActionState);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState('');

  useEffect(() => {
    if (state.ok) {
      window.dispatchEvent(new Event('cbse:auth-change'));
      router.push(getSafePostSignupPath(searchParams.get('next')));
      router.refresh();
    }
  }, [state.ok, router, searchParams]);

  const hasMinLen = passwordDraft.trim().length >= 8;
  const hasLetter = /[A-Za-z]/.test(passwordDraft);
  const hasNumber = /\d/.test(passwordDraft);

  return (
    <div>
      <GoogleSignInButton mode="register" />
      <form action={formAction} className="auth-form">
        {state.error ? (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <label className="auth-field">
          <span>Full name</span>
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Aarav Sharma"
            required
          />
        </label>
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
          <span>Create a password</span>
          <div className="auth-password-wrap">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters (letters & numbers)"
              value={passwordDraft}
              onChange={(e) => setPasswordDraft(e.target.value)}
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
          <div className="auth-password-rules" aria-live="polite">
            <span className={hasMinLen ? 'is-met' : ''}>{hasMinLen ? '✓' : '•'} 8+ chars</span>
            <span className={hasLetter ? 'is-met' : ''}>{hasLetter ? '✓' : '•'} Letter</span>
            <span className={hasNumber ? 'is-met' : ''}>{hasNumber ? '✓' : '•'} Number</span>
          </div>
        </label>
        <input name="classLevel" type="hidden" value="10" />
        <button className="auth-submit" type="submit" disabled={isPending}>
          {isPending ? 'Creating account…' : 'Create Free Class 10 Account →'}
        </button>
      </form>
    </div>
  );
}

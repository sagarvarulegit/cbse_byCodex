'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerAction } from '../auth-actions';
import { initialAuthActionState } from '../auth-state';
import { useActionState, useEffect } from 'react';
import { PILOT_PRIVACY_NOTICE_VERSION } from '../../lib/privacy';
import { getSafeNextPath } from '../../lib/auth-redirect';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(registerAction, initialAuthActionState);

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
        <span>Full name</span>
        <input name="fullName" type="text" autoComplete="name" placeholder="Student name" required />
      </label>
      <label className="auth-field">
        <span>Email address</span>
        <input name="email" type="email" autoComplete="email" placeholder="student@example.com" required />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters (letters & numbers)" required />
      </label>
      <input name="classLevel" type="hidden" value="10" />
      <button className="auth-submit" type="submit" disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create free Class 10 account'}
      </button>
    </form>
  );
}

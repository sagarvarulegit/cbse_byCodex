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
      <fieldset className="guardian-consent-fieldset">
        <legend>Parent or guardian permission</legend>
        <p>
          A parent or lawful guardian must complete this section for the
          controlled student pilot.
        </p>
        <label className="auth-field">
          <span>Guardian full name</span>
          <input
            autoComplete="name"
            maxLength={120}
            name="guardianFullName"
            placeholder="Parent or lawful guardian name"
            required
            type="text"
          />
        </label>
        <label className="auth-field">
          <span>Guardian email</span>
          <input
            autoComplete="email"
            name="guardianEmail"
            placeholder="guardian@example.com"
            required
            type="email"
          />
        </label>
        <label className="auth-field">
          <span>Relationship to student</span>
          <select defaultValue="" name="relationship" required>
            <option disabled value="">
              Choose relationship
            </option>
            <option value="parent">Parent</option>
            <option value="lawful_guardian">Lawful guardian</option>
          </select>
        </label>
        <label className="consent-check">
          <input name="adultConfirmed" required type="checkbox" />
          <span>
            I confirm that I am at least 18 years old and I am the
            student&apos;s parent or lawful guardian.
          </span>
        </label>
        <label className="consent-check">
          <input name="consentConfirmed" required type="checkbox" />
          <span>
            I have read the <Link href="/privacy">Pilot Privacy Notice</Link>{' '}
            and consent to the account and learning data described there.
          </span>
        </label>
        <input
          name="policyVersion"
          type="hidden"
          value={PILOT_PRIVACY_NOTICE_VERSION}
        />
        <p className="consent-disclosure">
          This MVP records a guardian self-attestation. It does not perform
          government identity verification.
        </p>
      </fieldset>
      <button className="auth-submit" type="submit" disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

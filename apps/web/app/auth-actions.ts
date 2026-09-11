'use server';

import { clearStudentSession, loginStudent, registerStudent } from '../lib/auth';
import { PILOT_PRIVACY_NOTICE_VERSION } from '../lib/privacy';
import type { AuthActionState } from './auth-state';

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  try {
    await loginStudent(email, password);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to log in right now.', ok: false };
  }

  return { error: null, ok: true };
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const classLevel = Number(formData.get('classLevel') ?? '');
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const guardianFullName = String(formData.get('guardianFullName') ?? '').trim();
  const guardianEmail = String(formData.get('guardianEmail') ?? '').trim();
  const relationship = String(formData.get('relationship') ?? '');
  const adultConfirmed = formData.get('adultConfirmed') === 'on';
  const consentConfirmed = formData.get('consentConfirmed') === 'on';

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.', ok: false };
  }

  try {
    await registerStudent(fullName, email, password, classLevel, {
      adultConfirmed,
      consentConfirmed,
      guardianEmail,
      guardianFullName,
      policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
      relationship,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to create the account right now.', ok: false };
  }

  return { error: null, ok: true };
}

export async function logoutAction() {
  await clearStudentSession();
}

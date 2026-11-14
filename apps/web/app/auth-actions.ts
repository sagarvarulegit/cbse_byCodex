'use server';

import {
  clearStudentSession,
  loginStudent,
  loginWithGoogle,
  registerStudent,
} from '../lib/auth';
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
  const classLevel = Number(formData.get('classLevel') ?? 10) || 10;
  const password = String(formData.get('password') ?? '');

  if (!fullName) {
    return { error: 'Full name is required.', ok: false };
  }
  if (!email || !email.includes('@')) {
    return { error: 'A valid email is required.', ok: false };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters with letters and numbers.', ok: false };
  }

  try {
    await registerStudent(fullName, email, password, classLevel);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to create the account right now.', ok: false };
  }

  return { error: null, ok: true };
}

export async function googleAuthAction(
  credential: string,
  classLevel = 10,
): Promise<{ error: string | null; ok: boolean; isNewUser?: boolean }> {
  const trimmed = String(credential ?? '').trim();
  if (!trimmed) {
    return { error: 'Missing Google sign-in token. Please try again.', ok: false };
  }

  try {
    const result = await loginWithGoogle(trimmed, classLevel);
    return { error: null, ok: true, isNewUser: result.isNewUser };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to sign in with Google right now.',
      ok: false,
    };
  }
}

export async function logoutAction() {
  await clearStudentSession();
}

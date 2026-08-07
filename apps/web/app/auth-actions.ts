'use server';

import { redirect } from 'next/navigation';

import { clearStudentSession, loginStudent, registerStudent } from '../lib/auth';
import { PILOT_PRIVACY_NOTICE_VERSION } from '../lib/privacy';

function buildErrorRedirect(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  try {
    await loginStudent(email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to log in right now.';
    redirect(buildErrorRedirect('/login', message));
  }

  redirect('/dashboard');
}

export async function registerAction(formData: FormData) {
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
    redirect(buildErrorRedirect('/register', 'Passwords do not match.'));
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
    const message = error instanceof Error ? error.message : 'Unable to create the account right now.';
    redirect(buildErrorRedirect('/register', message));
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  await clearStudentSession();
  redirect('/');
}

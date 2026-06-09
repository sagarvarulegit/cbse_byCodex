'use server';

import { redirect } from 'next/navigation';

import { clearStudentSession, loginStudent, registerStudent } from '../lib/auth';

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

  if (password !== confirmPassword) {
    redirect(buildErrorRedirect('/register', 'Passwords do not match.'));
  }

  try {
    await registerStudent(fullName, email, password, classLevel);
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

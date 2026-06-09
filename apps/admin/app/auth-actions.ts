'use server';

import { redirect } from 'next/navigation';

import { clearAdminSession, loginAdmin } from '../lib/auth';

function buildErrorRedirect(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  try {
    await loginAdmin(email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to log in right now.';
    redirect(buildErrorRedirect(message));
  }

  redirect('/');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/login');
}

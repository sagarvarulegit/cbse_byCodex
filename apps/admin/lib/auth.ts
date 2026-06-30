import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AdminSessionUser = {
  classLevel: number;
  email: string | null;
  fullName: string;
  id: string;
  phone: string | null;
  role: string;
};

type AuthResponse = {
  token: string;
  user: AdminSessionUser;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
const SESSION_COOKIE_NAME = 'cbse_admin_session';
const SESSION_MAX_AGE_SECONDS = 14 * 24 * 60 * 60;

async function saveSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json().catch(() => null)) as ({ message?: string } & Partial<AuthResponse>) | null;
  if (!response.ok || !data?.token || !data.user) {
    throw new Error(data?.message ?? 'Unable to log in right now.');
  }

  if (data.user.role !== 'admin') {
    throw new Error('This account does not have admin access.');
  }

  await saveSessionToken(data.token);
  return data.user;
}

export async function getAdminSession() {
  const token = await getAdminSessionToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/v1/auth/session`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: AdminSessionUser };
  if (data.user.role !== 'admin') {
    return null;
  }

  return data.user;
}

export async function getAdminSessionToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return token;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/login');
  }

  return session;
}

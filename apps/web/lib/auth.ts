import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type SessionUser = {
  classLevel: number;
  email: string | null;
  fullName: string;
  id: string;
  phone: string | null;
  role: string;
};

type AuthResponse = {
  token: string;
  user: SessionUser;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
const SESSION_COOKIE_NAME = 'cbse_student_session';
const SESSION_MAX_AGE_SECONDS = 14 * 24 * 60 * 60;

async function parseApiResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  if (!response.ok) {
    throw new Error(data?.message ?? 'Unable to complete the request.');
  }

  return data;
}

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

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function loginStudent(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({ email, password }),
  });

  const data = (await parseApiResponse(response)) as AuthResponse;
  await saveSessionToken(data.token);

  return data.user;
}

export async function registerStudent(fullName: string, email: string, password: string, classLevel: number) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({ classLevel, fullName, email, password }),
  });

  const data = (await parseApiResponse(response)) as AuthResponse;
  await saveSessionToken(data.token);

  return data.user;
}

export async function getStudentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
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

  const data = (await response.json()) as { user: SessionUser };
  return data.user;
}

export async function requireStudentSession() {
  const session = await getStudentSession();
  if (!session) {
    redirect('/login');
  }

  return session;
}

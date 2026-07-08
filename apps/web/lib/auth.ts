import { createHmac, timingSafeEqual } from 'node:crypto';
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

async function fetchAuthApi(path: string, init: RequestInit) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error(`Unable to reach the learning API at ${API_BASE_URL}. Start the API service and try again.`);
  }
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

export async function getStudentSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function loginStudent(email: string, password: string) {
  const response = await fetchAuthApi('/v1/auth/login', {
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
  const response = await fetchAuthApi('/v1/auth/register', {
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

const AUTH_SECRET = process.env.AUTH_TOKEN_SECRET ?? 'local-dev-auth-secret';

function signValue(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function verifyLocalToken(token: string): any | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = signValue(encodedPayload, AUTH_SECRET);
    const actualSignature = Buffer.from(signature, 'utf8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf8');

    if (actualSignature.length !== expectedSignatureBuffer.length) {
      return null;
    }

    if (!timingSafeEqual(actualSignature, expectedSignatureBuffer)) {
      return null;
    }

    const parsedPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (parsedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}

export async function getStudentSession() {
  const token = await getStudentSessionToken();
  if (!token) {
    return null;
  }

  const payload = verifyLocalToken(token);
  if (payload && payload.userId && payload.fullName) {
    return {
      id: payload.userId,
      role: payload.role,
      fullName: payload.fullName,
      classLevel: payload.classLevel ?? 10,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
    } as SessionUser;
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

import { UserRole } from '@prisma/client';
import type { Request } from 'express';

import { createSessionToken, readSessionToken } from './auth.js';
import { prisma } from './prisma.js';

const DEFAULT_AUTH_SESSION_DAYS = 14;

export function getAuthSecret() {
  if (process.env.AUTH_TOKEN_SECRET) {
    return process.env.AUTH_TOKEN_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-dev-auth-secret';
  }

  throw new Error('AUTH_TOKEN_SECRET is required in production.');
}

export function getAuthSessionDurationSeconds() {
  const configuredDays = Number(process.env.AUTH_SESSION_DAYS ?? DEFAULT_AUTH_SESSION_DAYS);
  if (!Number.isFinite(configuredDays) || configuredDays <= 0) {
    return DEFAULT_AUTH_SESSION_DAYS * 24 * 60 * 60;
  }

  return Math.floor(configuredDays * 24 * 60 * 60);
}

export function readBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token || null;
}

export function formatUserResponse(user: {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  profile: {
    classLevel: number;
    fullName: string;
  } | null;
}) {
  return {
    classLevel: user.profile?.classLevel ?? 10,
    email: user.email,
    fullName: user.profile?.fullName ?? 'Student',
    id: user.id,
    phone: user.phone,
    role: user.role,
  };
}

export function createUserSessionToken(user: {
  email: string | null;
  id: string;
  role: UserRole;
  profile: {
    classLevel: number;
    fullName: string;
  } | null;
}) {
  return createSessionToken(
    {
      role: user.role,
      userId: user.id,
      fullName: user.profile?.fullName ?? 'Student',
      classLevel: user.profile?.classLevel ?? 10,
      email: user.email,
    },
    getAuthSecret(),
    getAuthSessionDurationSeconds(),
  );
}

export async function getSessionUser(req: Request) {
  const token = readBearerToken(req.header('authorization'));
  if (!token) {
    return null;
  }

  const session = readSessionToken(token, getAuthSecret());
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user || user.status !== 'active') {
    return null;
  }

  return user;
}

export async function requireSessionUser(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return null;
  }

  return user;
}

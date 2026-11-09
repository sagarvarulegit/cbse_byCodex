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
  phone?: string | null;
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
      phone: user.phone ?? null,
    },
    getAuthSecret(),
    getAuthSessionDurationSeconds(),
  );
}

type ActiveSessionUser = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.user.findUnique<{
        where: { id: string };
        include: { profile: true };
      }>
    >
  >
>;

const SESSION_USER_CACHE_TTL_MS = 60 * 1000;
const MAX_SESSION_USER_CACHE_SIZE = 500;
const sessionUserCache = new Map<string, { user: ActiveSessionUser; expiresAt: number }>();
const inflightUserLookups = new Map<string, Promise<ActiveSessionUser | null>>();

export function invalidateSessionUserCache(userId?: string) {
  if (userId) {
    sessionUserCache.delete(userId);
    inflightUserLookups.delete(userId);
  } else {
    sessionUserCache.clear();
    inflightUserLookups.clear();
  }
}

function setCachedSessionUser(userId: string, user: ActiveSessionUser) {
  const now = Date.now();
  if (sessionUserCache.size >= MAX_SESSION_USER_CACHE_SIZE) {
    for (const [key, entry] of sessionUserCache.entries()) {
      if (entry.expiresAt <= now) {
        sessionUserCache.delete(key);
      }
    }
    if (sessionUserCache.size >= MAX_SESSION_USER_CACHE_SIZE) {
      const oldestKey = sessionUserCache.keys().next().value;
      if (oldestKey) {
        sessionUserCache.delete(oldestKey);
      }
    }
  }
  sessionUserCache.set(userId, {
    user,
    expiresAt: now + SESSION_USER_CACHE_TTL_MS,
  });
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

  const now = Date.now();
  const cached = sessionUserCache.get(session.userId);
  if (cached) {
    if (cached.expiresAt > now) {
      return cached.user;
    }
    sessionUserCache.delete(session.userId);
  }

  const existingInflight = inflightUserLookups.get(session.userId);
  if (existingInflight) {
    return existingInflight;
  }

  const lookupPromise = (async (): Promise<ActiveSessionUser | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { profile: true },
      });

      if (!user || user.status !== 'active') {
        return null;
      }

      setCachedSessionUser(session.userId, user);
      return user;
    } catch (error) {
      console.error('Database connection error in getSessionUser:', error);
      return null;
    } finally {
      inflightUserLookups.delete(session.userId);
    }
  })();

  inflightUserLookups.set(session.userId, lookupPromise);
  return lookupPromise;
}

export async function requireSessionUser(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return null;
  }

  return user;
}

import { UserRole } from '@prisma/client';
import cors from 'cors';
import express from 'express';

import { createSessionToken, readSessionToken, hashPassword, verifyPassword } from './lib/auth.js';
import { prisma } from './lib/prisma.js';
import { normalizeRegistrationClassLevel } from './lib/registration.js';

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const DEFAULT_AUTH_SESSION_DAYS = 14;
const MIN_PASSWORD_LENGTH = 8;

app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins, credentials: true } : undefined));
app.use(express.json());

function getAuthSecret() {
  if (process.env.AUTH_TOKEN_SECRET) {
    return process.env.AUTH_TOKEN_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-dev-auth-secret';
  }

  throw new Error('AUTH_TOKEN_SECRET is required in production.');
}

function getAuthSessionDurationSeconds() {
  const configuredDays = Number(process.env.AUTH_SESSION_DAYS ?? DEFAULT_AUTH_SESSION_DAYS);
  if (!Number.isFinite(configuredDays) || configuredDays <= 0) {
    return DEFAULT_AUTH_SESSION_DAYS * 24 * 60 * 60;
  }

  return Math.floor(configuredDays * 24 * 60 * 60);
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue || !normalizedValue.includes('@')) {
    return null;
  }

  return normalizedValue;
}

function normalizeFullName(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().replace(/\s+/g, ' ');
  if (normalizedValue.length < 2) {
    return null;
  }

  return normalizedValue;
}

function validatePassword(value: unknown) {
  if (typeof value !== 'string') {
    return 'Password is required.';
  }

  const normalizedValue = value.trim();
  if (normalizedValue.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[A-Za-z]/.test(normalizedValue) || !/\d/.test(normalizedValue)) {
    return 'Password must include at least one letter and one number.';
  }

  return null;
}

function readBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token || null;
}

function formatUserResponse(user: {
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

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cbse-api' });
});

app.post('/v1/auth/register', async (req, res) => {
  try {
    const fullName = normalizeFullName(req.body?.fullName);
    const email = normalizeEmail(req.body?.email);
    const passwordError = validatePassword(req.body?.password);
    const { classLevel, error: classLevelError } = normalizeRegistrationClassLevel(req.body?.classLevel);

    if (!fullName) {
      return res.status(400).json({ message: 'Full name must be at least 2 characters.' });
    }

    if (!email) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }

    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    if (classLevelError || classLevel === null) {
      return res.status(400).json({ message: classLevelError ?? 'Please choose your class to continue.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email.' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            classLevel,
            fullName,
          },
        },
        role: UserRole.student,
      },
      include: {
        profile: true,
      },
    });

    const token = createSessionToken(
      {
        role: user.role,
        userId: user.id,
      },
      getAuthSecret(),
      getAuthSessionDurationSeconds(),
    );

    return res.status(201).json({ token, user: formatUserResponse(user) });
  } catch (error) {
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Unable to create the account right now.' });
  }
});

app.post('/v1/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user?.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'This account is not active right now.' });
    }

    const token = createSessionToken(
      {
        role: user.role,
        userId: user.id,
      },
      getAuthSecret(),
      getAuthSessionDurationSeconds(),
    );

    return res.json({ token, user: formatUserResponse(user) });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

app.get('/v1/auth/session', async (req, res) => {
  try {
    const token = readBearerToken(req.header('authorization'));
    if (!token) {
      return res.status(401).json({ message: 'Missing session token.' });
    }

    const session = readSessionToken(token, getAuthSecret());
    if (!session) {
      return res.status(401).json({ message: 'Session has expired. Please log in again.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
      },
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Session is no longer valid.' });
    }

    return res.json({ user: formatUserResponse(user) });
  } catch (error) {
    console.error('Session lookup failed', error);
    return res.status(500).json({ message: 'Unable to validate the current session.' });
  }
});

app.post('/v1/auth/logout', (_req, res) => {
  res.status(204).send();
});

app.get('/v1/catalog/pilot', (_req, res) => {
  res.json({
    classLevel: 10,
    subjects: [
      {
        name: 'Mathematics',
        chapters: [{ title: 'Real Numbers', accessLevel: 'free-preview' }],
      },
      {
        name: 'Science',
        chapters: [{ title: 'Chemical Reactions and Equations', accessLevel: 'free-preview' }],
      },
    ],
  });
});

export default app;

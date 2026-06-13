import { UserRole } from '@prisma/client';
import { Router } from 'express';

import { hashPassword, readSessionToken, verifyPassword } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { rateLimit } from '../lib/rate-limiter.js';
import { normalizeRegistrationClassLevel } from '../lib/registration.js';
import {
  createUserSessionToken,
  formatUserResponse,
  getAuthSecret,
  readBearerToken,
} from '../lib/session.js';

const MIN_PASSWORD_LENGTH = 8;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts
  message: 'Too many registration or login attempts. Please try again after 15 minutes.',
});

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

export const authRouter = Router();

authRouter.post('/register', authLimiter, async (req, res) => {
  try {
    const fullName = normalizeFullName(req.body?.fullName);
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    const passwordError = validatePassword(password);
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

    const passwordHash = await hashPassword(password);
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

    return res.status(201).json({ token: createUserSessionToken(user), user: formatUserResponse(user) });
  } catch (error) {
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Unable to create the account right now.' });
  }
});

authRouter.post('/login', authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';

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

    return res.json({ token: createUserSessionToken(user), user: formatUserResponse(user) });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

authRouter.get('/session', async (req, res) => {
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

authRouter.post('/logout', (_req, res) => {
  res.status(204).send();
});

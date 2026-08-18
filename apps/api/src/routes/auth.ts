import { UserRole } from '@prisma/client';
import { Router } from 'express';

import { hashPassword, readSessionToken, verifyPassword } from '../lib/auth.js';
import { normalizeGuardianConsent } from '../lib/guardian-consent.js';
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
    const guardianConsent = normalizeGuardianConsent(req.body);

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

    if (!guardianConsent.data) {
      return res.status(400).json({ message: guardianConsent.error });
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
        guardianConsent: {
          create: guardianConsent.data,
        },
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

authRouter.get('/profile', async (req, res) => {
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
        guardianConsent: true,
      },
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Session is no longer valid.' });
    }

    return res.json({
      profile: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.profile?.fullName || 'Student',
        classLevel: user.profile?.classLevel || 10,
        schoolName: user.profile?.schoolName || null,
        targetExamYear: user.profile?.targetExamYear || null,
        preferredLanguage: user.profile?.preferredLanguage || 'en',
        guardianFullName: user.guardianConsent?.guardianFullName || null,
        guardianEmail: user.guardianConsent?.guardianEmail || null,
        guardianRelationship: user.guardianConsent?.relationship || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch failed', error);
    return res.status(500).json({ message: 'Unable to load profile details.' });
  }
});

authRouter.patch('/profile', async (req, res) => {
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
      include: { profile: true, guardianConsent: true },
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Session is no longer valid.' });
    }

    const {
      fullName,
      phone,
      schoolName,
      targetExamYear,
      guardianFullName,
    } = (req.body as {
      fullName?: string;
      phone?: string;
      schoolName?: string;
      targetExamYear?: number | string;
      guardianFullName?: string;
    }) || {};

    const updateUserData: Record<string, unknown> = {};
    const updateProfileData: Record<string, unknown> = {};
    const updateGuardianData: Record<string, unknown> = {};

    // 1. Phone number validation & uniqueness
    if (phone !== undefined) {
      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        updateUserData.phone = null;
      } else {
        const digitsOnly = cleanPhone.replace(/[^\d]/g, '');
        if (digitsOnly.length < 10) {
          return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number.' });
        }
        const formattedPhone = digitsOnly.length === 10 ? `+91${digitsOnly}` : `+${digitsOnly}`;

        // Check if phone number is already used by another account
        const existingPhoneUser = await prisma.user.findFirst({
          where: {
            phone: formattedPhone,
            id: { not: user.id },
          },
        });

        if (existingPhoneUser) {
          return res.status(409).json({ message: 'This phone number is already registered to another account.' });
        }

        updateUserData.phone = formattedPhone;
      }
    }

    // 2. Full Name
    if (fullName !== undefined) {
      const normalizedName = fullName.trim().replace(/\s+/g, ' ');
      if (normalizedName.length < 2) {
        return res.status(400).json({ message: 'Full name must be at least 2 characters.' });
      }
      updateProfileData.fullName = normalizedName;
    }

    // 3. School Name
    if (schoolName !== undefined) {
      updateProfileData.schoolName = schoolName.trim() || null;
    }

    // 4. Target Exam Year
    if (targetExamYear !== undefined) {
      const parsedYear = Number(targetExamYear);
      if (Number.isFinite(parsedYear) && parsedYear >= 2025 && parsedYear <= 2030) {
        updateProfileData.targetExamYear = parsedYear;
      }
    }

    // 5. Guardian Name
    if (guardianFullName !== undefined && user.guardianConsent) {
      updateGuardianData.guardianFullName = guardianFullName.trim() || user.guardianConsent.guardianFullName;
    }

    // Execute database updates in transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      if (Object.keys(updateUserData).length > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: updateUserData,
        });
      }

      if (Object.keys(updateProfileData).length > 0) {
        await tx.userProfile.upsert({
          where: { userId: user.id },
          update: updateProfileData,
          create: {
            userId: user.id,
            fullName: (updateProfileData.fullName as string) || 'Student',
            classLevel: 10,
            schoolName: (updateProfileData.schoolName as string) || null,
            targetExamYear: (updateProfileData.targetExamYear as number) || null,
          },
        });
      }

      if (Object.keys(updateGuardianData).length > 0 && user.guardianConsent) {
        await tx.guardianConsent.update({
          where: { userId: user.id },
          data: updateGuardianData,
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        include: { profile: true, guardianConsent: true },
      });
    });

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update profile.' });
    }

    // Issue refreshed session token with updated profile information
    const newToken = createUserSessionToken(updatedUser);

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      token: newToken,
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        fullName: updatedUser.profile?.fullName || 'Student',
        classLevel: updatedUser.profile?.classLevel || 10,
        schoolName: updatedUser.profile?.schoolName || null,
        targetExamYear: updatedUser.profile?.targetExamYear || null,
        preferredLanguage: updatedUser.profile?.preferredLanguage || 'en',
        guardianFullName: updatedUser.guardianConsent?.guardianFullName || null,
        guardianEmail: updatedUser.guardianConsent?.guardianEmail || null,
        guardianRelationship: updatedUser.guardianConsent?.relationship || null,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile update failed', error);
    return res.status(500).json({ message: 'Unable to update profile details.' });
  }
});

authRouter.post('/logout', (_req, res) => {
  res.status(204).send();
});

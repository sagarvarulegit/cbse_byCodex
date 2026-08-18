import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { RecoveryTokenType } from '@prisma/client';

import { hashPassword } from '../auth.js';
import { prisma } from '../prisma.js';
import { createUserSessionToken, formatUserResponse, getAuthSecret } from '../session.js';

const MIN_PASSWORD_LENGTH = 8;
const OTP_EXPIRY_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;

function signResetToken(payload: { userId: string; email: string; exp: number }, secret: string): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyResetToken(token: string, secret: string): { userId: string; email: string; exp: number } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = createHmac('sha256', secret).update(encoded).digest('base64url');
  if (sig.length !== expectedSig.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as {
      userId: string;
      email: string;
      exp: number;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Masks an email address for privacy and child safety.
 * e.g. "sagar.varule@gmail.com" -> "sa***le@gmail.com"
 * e.g. "student@domain.in" -> "st***nt@domain.in"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return '***@***.com';
  }

  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }

  const firstTwo = localPart.slice(0, 2);
  const lastTwo = localPart.slice(-2);
  return `${firstTwo}***${lastTwo}@${domain}`;
}

/**
 * Masks a phone number for privacy.
 * e.g. "+919876543210" -> "+91 98****10"
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.length < 8) {
    return '******' + digits.slice(-2);
  }
  return digits.slice(0, 4) + '****' + digits.slice(-2);
}

function hashOtp(otp: string): string {
  const secret = getAuthSecret();
  return createHash('sha256')
    .update(`${otp}:${secret}`)
    .digest('hex');
}

export function validatePassword(password: string): string | null {
  if (typeof password !== 'string') {
    return 'Password is required.';
  }

  const trimmed = password.trim();
  if (trimmed.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[A-Za-z]/.test(trimmed) || !/\d/.test(trimmed)) {
    return 'Password must contain at least one letter and one number.';
  }

  return null;
}

/**
 * Generates a secure 6-digit numeric OTP and stores its SHA-256 hash.
 */
export async function generateRecoveryOtp(
  userId: string,
  tokenType: RecoveryTokenType = RecoveryTokenType.password_reset,
): Promise<{ otp: string; expiresAt: Date }> {
  // Invalidate any previously unconsumed OTPs for this user & type
  await prisma.accountRecoveryToken.updateMany({
    where: {
      userId,
      tokenType,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  // Generate 6-digit numeric OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const tokenHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.accountRecoveryToken.create({
    data: {
      userId,
      tokenHash,
      tokenType,
      expiresAt,
    },
  });

  return { otp, expiresAt };
}

/**
 * Searches for a student account using alternative identifiers.
 */
export async function findAccountByIdentifier({
  searchType,
  query,
  extra,
}: {
  searchType: 'phone' | 'payment_order' | 'guardian_details';
  query: string;
  extra?: string;
}): Promise<{
  found: boolean;
  maskedEmail?: string;
  email?: string;
  userId?: string;
  studentName?: string;
  message?: string;
}> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { found: false, message: 'Please enter a search query.' };
  }

  if (searchType === 'phone') {
    const cleanPhone = cleanQuery.replace(/[^\d+]/g, '');
    const user = await prisma.user.findFirst({
      where: {
        phone: {
          contains: cleanPhone.slice(-10),
        },
      },
      include: { profile: true },
    });

    if (user && user.email) {
      return {
        found: true,
        maskedEmail: maskEmail(user.email),
        email: user.email,
        userId: user.id,
        studentName: user.profile?.fullName,
      };
    }
  } else if (searchType === 'payment_order') {
    // Search by Cashfree orderId, PaymentOrder id, or receipt
    const order = await prisma.paymentOrder.findFirst({
      where: {
        OR: [
          { razorpayOrderId: cleanQuery },
          { id: cleanQuery },
          { receipt: cleanQuery },
          { razorpayPaymentId: cleanQuery },
        ],
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (order && order.user?.email) {
      return {
        found: true,
        maskedEmail: maskEmail(order.user.email),
        email: order.user.email,
        userId: order.user.id,
        studentName: order.user.profile?.fullName,
      };
    }
  } else if (searchType === 'guardian_details') {
    const guardianEmail = cleanQuery.toLowerCase();
    const studentName = (extra || '').trim().toLowerCase();

    const guardianConsent = await prisma.guardianConsent.findFirst({
      where: {
        guardianEmail,
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (guardianConsent && guardianConsent.user?.email) {
      // If studentName provided, check match
      const profileName = guardianConsent.user.profile?.fullName?.toLowerCase() || '';
      if (!studentName || profileName.includes(studentName) || studentName.includes(profileName)) {
        return {
          found: true,
          maskedEmail: maskEmail(guardianConsent.user.email),
          email: guardianConsent.user.email,
          userId: guardianConsent.user.id,
          studentName: guardianConsent.user.profile?.fullName,
        };
      }
    }
  }

  return {
    found: false,
    message: 'No active ChapterReady student account found matching these details. Please double-check and try again.',
  };
}

/**
 * Validates a 6-digit OTP and generates a signed 15-minute reset session token.
 */
export async function verifyRecoveryOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<{
  success: boolean;
  resetSessionToken?: string;
  error?: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.email) {
    return { success: false, error: 'Invalid or expired recovery code.' };
  }

  const activeToken = await prisma.accountRecoveryToken.findFirst({
    where: {
      userId: user.id,
      tokenType: RecoveryTokenType.password_reset,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!activeToken) {
    return {
      success: false,
      error: 'No active recovery code found or code has expired. Please request a new code.',
    };
  }

  if (activeToken.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.accountRecoveryToken.update({
      where: { id: activeToken.id },
      data: { usedAt: new Date() },
    });
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new code.',
    };
  }

  const expectedHash = hashOtp(cleanOtp);
  if (activeToken.tokenHash !== expectedHash) {
    await prisma.accountRecoveryToken.update({
      where: { id: activeToken.id },
      data: { attempts: activeToken.attempts + 1 },
    });

    const remaining = MAX_OTP_ATTEMPTS - (activeToken.attempts + 1);
    return {
      success: false,
      error: `Incorrect recovery code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Mark token as consumed
  await prisma.accountRecoveryToken.update({
    where: { id: activeToken.id },
    data: { usedAt: new Date() },
  });

  // Issue a short-lived signed reset token (15 minutes)
  const resetSessionToken = signResetToken(
    {
      userId: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    },
    getAuthSecret(),
  );

  return {
    success: true,
    resetSessionToken,
  };
}

/**
 * Resets the user's password and issues a new student session token.
 */
export async function resetPasswordWithToken({
  email,
  resetSessionToken,
  newPassword,
}: {
  email: string;
  resetSessionToken: string;
  newPassword: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const payload = verifyResetToken(resetSessionToken, getAuthSecret());
  if (!payload) {
    throw new Error('Password reset session has expired. Please verify your recovery code again.');
  }

  if (payload.email.toLowerCase() !== normalizedEmail) {
    throw new Error('Invalid password reset token.');
  }

  const newPasswordHash = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      passwordHash: newPasswordHash,
      recoveryTokens: {
        updateMany: {
          where: { usedAt: null },
          data: { usedAt: new Date() },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const sessionToken = createUserSessionToken(updatedUser);
  const formattedUser = formatUserResponse(updatedUser);

  return {
    token: sessionToken,
    user: formattedUser,
  };
}

import { Router } from 'express';
import type { Request, Response } from 'express';

import { prisma } from '../lib/prisma.js';
import { rateLimit } from '../lib/rate-limiter.js';
import {
  findAccountByIdentifier,
  generateRecoveryOtp,
  maskEmail,
  resetPasswordWithToken,
  validatePassword,
  verifyRecoveryOtp,
} from '../lib/recovery/service.js';

const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // Max 8 recovery requests per 15 minutes
  message: 'Too many recovery attempts. Please try again after 15 minutes.',
});

export const recoveryRouter = Router();

/**
 * POST /v1/auth/recovery/forgot-password
 * Triggers a 6-digit password reset OTP to the student's registered email.
 */
recoveryRouter.post('/forgot-password', recoveryLimiter, async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (user) {
    const { otp, expiresAt } = await generateRecoveryOtp(user.id);
    console.log(`[ACCOUNT_RECOVERY] OTP for ${email} (${user.profile?.fullName || 'Student'}): ${otp} (expires ${expiresAt.toISOString()})`);
    
    // Debug helper for testing environments
    return res.json({
      success: true,
      message: `A 6-digit recovery code has been sent to ${maskEmail(email)}.`,
      maskedEmail: maskEmail(email),
      debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  }

  // To prevent user enumeration, return a positive response even if not found
  return res.json({
    success: true,
    message: `If an account exists for ${maskEmail(email)}, a 6-digit recovery code has been sent.`,
    maskedEmail: maskEmail(email),
  });
});

/**
 * POST /v1/auth/recovery/find-account
 * Locates student account using alternative identifiers (Phone, Order Reference, Guardian Email).
 */
recoveryRouter.post('/find-account', recoveryLimiter, async (req: Request, res: Response) => {
  const { searchType, query, extra } = (req.body as {
    searchType?: 'phone' | 'payment_order' | 'guardian_details';
    query?: string;
    extra?: string;
  }) || {};

  if (!searchType || !query) {
    return res.status(400).json({ message: 'Missing searchType or search query.' });
  }

  const result = await findAccountByIdentifier({
    searchType,
    query,
    extra,
  });

  if (!result.found || !result.userId || !result.email) {
    return res.status(404).json({
      success: false,
      message: result.message || 'No account found matching the provided details.',
    });
  }

  // Generate and send recovery code immediately to the discovered account
  const { otp, expiresAt } = await generateRecoveryOtp(result.userId);
  console.log(`[ACCOUNT_RECOVERY] Discovered account for ${result.studentName || 'Student'} (${result.email}): OTP is ${otp} (expires ${expiresAt.toISOString()})`);

  return res.json({
    success: true,
    found: true,
    maskedEmail: result.maskedEmail,
    email: result.email,
    studentName: result.studentName,
    message: `Account located for ${result.studentName || 'student'}. A 6-digit recovery code has been sent to ${result.maskedEmail}.`,
    debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  });
});

/**
 * POST /v1/auth/recovery/verify-otp
 * Validates the 6-digit recovery code and returns a 15-minute reset session token.
 */
recoveryRouter.post('/verify-otp', async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const otp = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 6-digit recovery code are required.' });
  }

  const result = await verifyRecoveryOtp({ email, otp });
  if (!result.success) {
    return res.status(400).json({ message: result.error || 'Invalid or expired code.' });
  }

  return res.json({
    success: true,
    message: 'Recovery code verified successfully.',
    resetSessionToken: result.resetSessionToken,
  });
});

/**
 * POST /v1/auth/recovery/reset-password
 * Resets user password using verified reset session token and logs the user in.
 */
recoveryRouter.post('/reset-password', async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const resetSessionToken =
    typeof req.body?.resetSessionToken === 'string' ? req.body.resetSessionToken.trim() : '';
  const newPassword =
    typeof req.body?.newPassword === 'string' ? req.body.newPassword.trim() : '';

  if (!email || !resetSessionToken || !newPassword) {
    return res.status(400).json({ message: 'Missing required password reset parameters.' });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const session = await resetPasswordWithToken({
      email,
      resetSessionToken,
      newPassword,
    });

    return res.json({
      success: true,
      message: 'Your password has been reset successfully. Logging you in…',
      token: session.token,
      user: session.user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Unable to reset password.',
    });
  }
});

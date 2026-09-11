import { prisma } from '../prisma.js';
import { isTestUserEmail } from '../test-users.js';
import {
  ACTIVITY_FORMULA_COMBO_PACK_KEY,
  ALL_SUBJECTS_MOCK_PACK_KEY,
  SINGLE_SUBJECT_MOCK_PASS_PREFIX,
  UNLIMITED_QUIZ_PASS_KEY,
} from './products.js';

export type UserEntitlementSummary = {
  id: string;
  productKey: string;
  subjectSlug: string | null;
  scope: string;
  status: string;
  validFrom: Date;
  validUntil: Date | null;
  isAllSubjects: boolean;
};

/**
 * Returns active entitlements for a given user.
 */
export async function getUserActiveEntitlements(
  userId: string,
): Promise<UserEntitlementSummary[]> {
  const records = await prisma.userEntitlement.findMany({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  });

  return records.map((record) => ({
    id: record.id,
    productKey: record.productKey,
    subjectSlug: record.subjectSlug,
    scope: record.scope,
    status: record.status,
    validFrom: record.validFrom,
    validUntil: record.validUntil,
    isAllSubjects: record.productKey === ALL_SUBJECTS_MOCK_PACK_KEY,
  }));
}

/**
 * Synthetic full-access entitlements for test users: every commercial pack
 * without a purchase. The combo pack covers both the activity-diagram and
 * formula-cheatsheet gates; the all-subjects pack covers mocks and quizzes.
 */
export function getTestBypassEntitlements(): UserEntitlementSummary[] {
  const now = new Date();
  const row = (productKey: string, scope: string): UserEntitlementSummary => ({
    id: `test-bypass-${productKey}`,
    productKey,
    subjectSlug: null,
    scope,
    status: 'active',
    validFrom: now,
    validUntil: null,
    isAllSubjects: productKey === ALL_SUBJECTS_MOCK_PACK_KEY,
  });

  return [
    row(ALL_SUBJECTS_MOCK_PACK_KEY, 'mock_test_series'),
    row(UNLIMITED_QUIZ_PASS_KEY, 'quiz'),
    row(ACTIVITY_FORMULA_COMBO_PACK_KEY, 'content_pack'),
  ];
}

/**
 * Checks if a student is entitled to access a specific mock test paper.
 * - Paper 1 (freeSampleNumber === 1): Always true (free sample).
 * - Papers 2..5: True if student has active all-subjects pack or matching single-subject pass.
 */
export async function checkMockPaperAccess({
  userId,
  subjectSlug,
  paperNumber,
  userEmail,
}: {
  userId?: string | null;
  subjectSlug: string;
  paperNumber: number;
  userEmail?: string | null;
}): Promise<{
  isUnlocked: boolean;
  isFreeSample: boolean;
  reason?: string;
}> {
  // Paper 1 is free for everyone (even guests)
  if (paperNumber === 1) {
    return { isUnlocked: true, isFreeSample: true };
  }

  // Test users bypass every paywall without buying anything.
  if (isTestUserEmail(userEmail)) {
    return { isUnlocked: true, isFreeSample: false };
  }

  if (!userId) {
    return {
      isUnlocked: false,
      isFreeSample: false,
      reason: 'Sign in to access premium mock test papers.',
    };
  }

  const entitlements = await getUserActiveEntitlements(userId);

  const hasAllSubjects = entitlements.some(
    (e) => e.productKey === ALL_SUBJECTS_MOCK_PACK_KEY,
  );
  if (hasAllSubjects) {
    return { isUnlocked: true, isFreeSample: false };
  }

  const hasSubjectPass = entitlements.some(
    (e) =>
      e.subjectSlug === subjectSlug ||
      e.productKey === `${SINGLE_SUBJECT_MOCK_PASS_PREFIX}-${subjectSlug}`,
  );
  if (hasSubjectPass) {
    return { isUnlocked: true, isFreeSample: false };
  }

  return {
    isUnlocked: false,
    isFreeSample: false,
    reason: 'Unlock the Mock Test Series to access Papers 2–5.',
  };
}

/**
 * Grants an active entitlement to a user upon successful payment.
 */
export async function grantEntitlement({
  userId,
  productKey,
  subjectSlug,
  paymentOrderId,
}: {
  userId: string;
  productKey: string;
  subjectSlug?: string | null;
  paymentOrderId?: string;
}) {
  const normalizedSubjectSlug =
    productKey === ALL_SUBJECTS_MOCK_PACK_KEY ? null : subjectSlug || null;

  return prisma.userEntitlement.upsert({
    where: {
      userId_productKey_subjectSlug: {
        userId,
        productKey,
        subjectSlug: normalizedSubjectSlug as string,
      },
    },
    update: {
      status: 'active',
      paymentOrderId,
      validFrom: new Date(),
    },
    create: {
      userId,
      productKey,
      subjectSlug: normalizedSubjectSlug,
      scope: 'mock_test_series',
      status: 'active',
      paymentOrderId,
    },
  });
}

/**
 * Revokes an active entitlement (e.g. after refund).
 */
export async function revokeEntitlement({
  userId,
  productKey,
  subjectSlug,
}: {
  userId: string;
  productKey: string;
  subjectSlug?: string | null;
}) {
  const normalizedSubjectSlug =
    productKey === ALL_SUBJECTS_MOCK_PACK_KEY ? null : subjectSlug || null;

  return prisma.userEntitlement.updateMany({
    where: {
      userId,
      productKey,
      subjectSlug: normalizedSubjectSlug,
    },
    data: {
      status: 'revoked',
    },
  });
}


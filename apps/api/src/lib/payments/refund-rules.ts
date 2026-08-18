import { prisma } from '../prisma.js';
import { ALL_SUBJECTS_MOCK_PACK_KEY, SINGLE_SUBJECT_MOCK_PASS_PREFIX, getSingleSubjectProductKey } from './products.js';
import { createRazorpayRefund } from './razorpay.js';
import { createCashfreeRefund } from './cashfree.js';
import { revokeEntitlement } from './entitlements.js';

export type RefundEligibilityResult = {
  isEligibleForInstantRefund: boolean;
  canSwapSubject: boolean;
  requiresAdminReview: boolean;
  orderId: string;
  amountPaise: number;
  currency: string;
  productKey: string;
  subjectSlug: string | null;
  hoursElapsed: number;
  premiumAttemptsCount: number;
  reasonCategory: 'duplicate' | 'satisfaction_guarantee' | 'manual_review' | 'already_processed';
  existingRefundRequest?: {
    id: string;
    status: string;
    createdAt: Date;
  } | null;
};

/**
 * Evaluates whether a payment order is eligible for an instant auto-refund,
 * a subject swap, or requires manual admin review.
 */
export async function evaluateRefundEligibility({
  userId,
  orderId,
}: {
  userId: string;
  orderId: string;
}): Promise<RefundEligibilityResult | null> {
  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
    include: {
      refundRequests: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!order || order.userId !== userId) {
    return null;
  }

  const existingRefund = order.refundRequests[0] || null;
  if (existingRefund && (existingRefund.status === 'processed' || existingRefund.status === 'pending')) {
    return {
      isEligibleForInstantRefund: false,
      canSwapSubject: false,
      requiresAdminReview: existingRefund.status === 'pending',
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      productKey: order.productKey,
      subjectSlug: order.subjectSlug,
      hoursElapsed: (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60),
      premiumAttemptsCount: 0,
      reasonCategory: 'already_processed',
      existingRefundRequest: {
        id: existingRefund.id,
        status: existingRefund.status,
        createdAt: existingRefund.createdAt,
      },
    };
  }

  if (order.status !== 'paid') {
    return null;
  }

  const hoursElapsed = (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60);

  // Check for duplicate payment (same user, same product, paid within 24 hours of another order)
  const otherPaidOrders = await prisma.paymentOrder.findMany({
    where: {
      userId,
      productKey: order.productKey,
      subjectSlug: order.subjectSlug,
      status: 'paid',
      id: { not: order.id },
    },
  });
  const isDuplicate = otherPaidOrders.length > 0;

  // Count premium attempts (papers with seed > first paper or number > 1)
  const userAttempts = await prisma.examPaperAttempt.findMany({
    where: {
      userId,
    },
    include: {
      examPaper: {
        select: {
          id: true,
          subjectSlug: true,
          userId: true,
          publishStatus: true,
        },
      },
    },
  });

  // Filter attempts for published series papers
  const relevantAttempts = userAttempts.filter((att) => {
    if (!att.examPaper) return false;
    const isSeries = att.examPaper.userId === null && att.examPaper.publishStatus === 'published';
    if (!isSeries) return false;
    if (order.productKey === ALL_SUBJECTS_MOCK_PACK_KEY) return true;
    return att.examPaper.subjectSlug === order.subjectSlug;
  });

  const premiumAttemptsCount = relevantAttempts.length;
  const isSingleSubject = order.productKey.startsWith(SINGLE_SUBJECT_MOCK_PASS_PREFIX);

  // Rule 1: Duplicate order -> instant refund
  if (isDuplicate) {
    return {
      isEligibleForInstantRefund: true,
      canSwapSubject: false,
      requiresAdminReview: false,
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      productKey: order.productKey,
      subjectSlug: order.subjectSlug,
      hoursElapsed,
      premiumAttemptsCount,
      reasonCategory: 'duplicate',
    };
  }

  // Rule 2: Within 48 hours AND fewer than 2 premium attempts -> Instant 100% refund
  if (hoursElapsed <= 48 && premiumAttemptsCount < 2) {
    return {
      isEligibleForInstantRefund: true,
      canSwapSubject: isSingleSubject,
      requiresAdminReview: false,
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      productKey: order.productKey,
      subjectSlug: order.subjectSlug,
      hoursElapsed,
      premiumAttemptsCount,
      reasonCategory: 'satisfaction_guarantee',
    };
  }

  // Rule 3: Single subject within 7 days -> Can swap subject
  if (isSingleSubject && hoursElapsed <= 168) {
    return {
      isEligibleForInstantRefund: false,
      canSwapSubject: true,
      requiresAdminReview: true,
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      productKey: order.productKey,
      subjectSlug: order.subjectSlug,
      hoursElapsed,
      premiumAttemptsCount,
      reasonCategory: 'manual_review',
    };
  }

  // Rule 4: Beyond 48h or high usage -> Requires Admin review
  return {
    isEligibleForInstantRefund: false,
    canSwapSubject: false,
    requiresAdminReview: true,
    orderId: order.id,
    amountPaise: order.amount,
    currency: order.currency,
    productKey: order.productKey,
    subjectSlug: order.subjectSlug,
    hoursElapsed,
    premiumAttemptsCount,
    reasonCategory: 'manual_review',
  };
}

/**
 * Executes an instant automated refund through Razorpay and revokes access.
 */
export async function executeAutoRefund({
  userId,
  orderId,
  reason,
  details,
}: {
  userId: string;
  orderId: string;
  reason: string;
  details?: string;
}) {
  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
  });

  if (!order || order.userId !== userId || order.status !== 'paid') {
    throw new Error('Order is not eligible for refund processing.');
  }

  let refundId = `rfd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  if (order.paymentGateway === 'cashfree' || !order.razorpayPaymentId) {
    const cfRefund = await createCashfreeRefund({
      orderId: order.razorpayOrderId,
      refundId,
      refundAmountPaise: order.amount,
      refundNote: reason || 'Satisfaction Guarantee Refund',
    });
    refundId = cfRefund.refundId;
  } else if (order.razorpayPaymentId) {
    const refundRes = await createRazorpayRefund({
      paymentId: order.razorpayPaymentId,
      amount: order.amount,
      notes: {
        userId,
        reason,
        autoRefund: 'true',
      },
    });
    refundId = refundRes.id;
  }

  return prisma.$transaction(async (tx) => {
    await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: 'refunded',
      },
    });

    await tx.userEntitlement.updateMany({
      where: {
        userId,
        productKey: order.productKey,
        subjectSlug: order.subjectSlug,
      },
      data: {
        status: 'revoked',
      },
    });

    return tx.refundRequest.create({
      data: {
        userId,
        paymentOrderId: order.id,
        reason,
        details,
        refundType: 'total',
        amountPaise: order.amount,
        status: 'processed',
        razorpayRefundId: refundId,
        processedAt: new Date(),
      },
    });
  });
}

/**
 * Swaps a single-subject mock pass from one subject to another for free.
 */
export async function executeSubjectSwap({
  userId,
  orderId,
  targetSubjectSlug,
}: {
  userId: string;
  orderId: string;
  targetSubjectSlug: string;
}) {
  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
  });

  if (!order || order.userId !== userId || order.status !== 'paid') {
    throw new Error('Order not found or invalid for subject swap.');
  }

  const oldSubjectSlug = order.subjectSlug;
  const newProductKey = getSingleSubjectProductKey(targetSubjectSlug);

  return prisma.$transaction(async (tx) => {
    // Revoke old entitlement
    await tx.userEntitlement.updateMany({
      where: {
        userId,
        productKey: order.productKey,
        subjectSlug: oldSubjectSlug,
      },
      data: {
        status: 'revoked',
      },
    });

    // Grant new entitlement
    await tx.userEntitlement.upsert({
      where: {
        userId_productKey_subjectSlug: {
          userId,
          productKey: newProductKey,
          subjectSlug: targetSubjectSlug,
        },
      },
      update: {
        status: 'active',
        validFrom: new Date(),
        paymentOrderId: order.id,
      },
      create: {
        userId,
        productKey: newProductKey,
        subjectSlug: targetSubjectSlug,
        scope: 'mock_test_series',
        status: 'active',
        paymentOrderId: order.id,
      },
    });

    // Update order
    await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        productKey: newProductKey,
        subjectSlug: targetSubjectSlug,
      },
    });

    // Log processed refund request of type subject_swap
    return tx.refundRequest.create({
      data: {
        userId,
        paymentOrderId: order.id,
        reason: `Subject swap from ${oldSubjectSlug} to ${targetSubjectSlug}`,
        refundType: 'subject_swap',
        amountPaise: 0,
        status: 'processed',
        processedAt: new Date(),
      },
    });
  });
}

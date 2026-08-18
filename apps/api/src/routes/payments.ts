import { Router } from 'express';
import type { Request, Response } from 'express';

import {
  findProductByKey,
  getAllAvailableProducts,
  ALL_SUBJECTS_MOCK_PACK_KEY,
} from '../lib/payments/products.js';
import {
  createRazorpayOrder,
  createRazorpayRefund,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} from '../lib/payments/razorpay.js';
import {
  createCashfreeOrder,
  fetchCashfreeOrder,
  verifyCashfreeWebhookSignature,
} from '../lib/payments/cashfree.js';
import {
  getUserActiveEntitlements,
  grantEntitlement,
  revokeEntitlement,
} from '../lib/payments/entitlements.js';
import {
  evaluateRefundEligibility,
  executeAutoRefund,
  executeSubjectSwap,
} from '../lib/payments/refund-rules.js';
import { prisma } from '../lib/prisma.js';
import { getSessionUser, requireSessionUser } from '../lib/session.js';
import { UserRole } from '@prisma/client';

export const paymentsRouter = Router();

/**
 * GET /v1/payments/products
 * Returns all available commercial packages and pricing.
 */
paymentsRouter.get('/products', async (_req: Request, res: Response) => {
  const products = getAllAvailableProducts();
  return res.json({ products });
});

/**
 * GET /v1/payments/orders
 * Returns student's orders with refund eligibility details.
 */
paymentsRouter.get('/orders', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view orders.' });
  }

  const orders = await prisma.paymentOrder.findMany({
    where: { userId: user.id },
    include: {
      refundRequests: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const ordersWithEligibility = await Promise.all(
    orders.map(async (order) => {
      const eligibility =
        order.status === 'paid'
          ? await evaluateRefundEligibility({ userId: user.id, orderId: order.id })
          : null;
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        productKey: order.productKey,
        subjectSlug: order.subjectSlug,
        status: order.status,
        receipt: order.receipt,
        createdAt: order.createdAt,
        refundRequest: order.refundRequests[0] || null,
        eligibility,
      };
    }),
  );

  return res.json({ orders: ordersWithEligibility });
});

/**
 * POST /v1/payments/refund-request
 * Allows student to initiate a refund request with auto-approval check.
 */
paymentsRouter.post('/refund-request', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to request a refund.' });
  }

  const { orderId, reason, details } = (req.body as {
    orderId?: string;
    reason?: string;
    details?: string;
  }) || {};

  if (!orderId || !reason) {
    return res.status(400).json({ message: 'Missing orderId or reason.' });
  }

  const eligibility = await evaluateRefundEligibility({ userId: user.id, orderId });
  if (!eligibility) {
    return res.status(400).json({ message: 'Order is not eligible for refund.' });
  }

  if (eligibility.isEligibleForInstantRefund) {
    try {
      const refund = await executeAutoRefund({
        userId: user.id,
        orderId,
        reason,
        details,
      });
      return res.json({
        success: true,
        status: 'processed',
        message: 'Instant refund processed successfully. The funds will reflect in your UPI/bank account in 1–3 business days.',
        refundId: refund.razorpayRefundId,
      });
    } catch (err) {
      console.error('Failed to execute auto refund:', err);
    }
  }

  const createdRequest = await prisma.refundRequest.create({
    data: {
      userId: user.id,
      paymentOrderId: orderId,
      reason,
      details,
      refundType: 'total',
      amountPaise: eligibility.amountPaise,
      status: 'pending',
    },
  });

  return res.json({
    success: true,
    status: 'pending',
    message: 'Refund request received. Our support team will review and process it within 24 hours.',
    requestId: createdRequest.id,
  });
});

/**
 * POST /v1/payments/swap-subject
 * 1-click subject exchange for single-subject passes.
 */
paymentsRouter.post('/swap-subject', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to swap subject.' });
  }

  const { orderId, targetSubjectSlug } = (req.body as {
    orderId?: string;
    targetSubjectSlug?: string;
  }) || {};

  if (!orderId || !targetSubjectSlug) {
    return res.status(400).json({ message: 'Missing orderId or targetSubjectSlug.' });
  }

  try {
    await executeSubjectSwap({
      userId: user.id,
      orderId,
      targetSubjectSlug,
    });

    return res.json({
      success: true,
      message: `Successfully swapped mock test pass to ${targetSubjectSlug}.`,
      targetSubjectSlug,
    });
  } catch (err) {
    return res.status(400).json({
      message: err instanceof Error ? err.message : 'Failed to swap subject.',
    });
  }
});

/**
 * GET /v1/payments/entitlements
 * Returns active entitlements and unlocked subjects for the signed-in student.
 */
paymentsRouter.get('/entitlements', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to check entitlements.' });
  }

  const entitlements = await getUserActiveEntitlements(user.id);
  const hasAllSubjects = entitlements.some(
    (e) => e.productKey === ALL_SUBJECTS_MOCK_PACK_KEY,
  );

  return res.json({
    entitlements,
    hasAllSubjects,
    unlockedSubjectSlugs: hasAllSubjects
      ? [
          'mathematics-standard',
          'science',
          'social-science',
          'english-language-and-literature',
        ]
      : entitlements
          .map((e) => e.subjectSlug)
          .filter((slug): slug is string => Boolean(slug)),
  });
});

/**
 * POST /v1/payments/create-order
 * Body: { productKey, subjectSlug? }
 * Creates a Cashfree order and a local PaymentOrder record.
 */
paymentsRouter.post('/create-order', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to purchase mock test papers.' });
  }

  const { productKey, subjectSlug } = (req.body as {
    productKey?: string;
    subjectSlug?: string;
  }) || {};

  if (!productKey) {
    return res.status(400).json({ message: 'Missing productKey parameter.' });
  }

  const product = findProductByKey(productKey, subjectSlug);
  if (!product) {
    return res.status(400).json({ message: `Invalid productKey: ${productKey}` });
  }

  const orderId = `order_${user.id.slice(-6)}_${Date.now().toString(36)}`;
  const receipt = `rcpt_${user.id.slice(-6)}_${Date.now().toString(36)}`;

  try {
    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      amountPaise: product.pricePaise,
      currency: product.currency,
      customerId: user.id,
      customerName: user.profile?.fullName || 'Class 10 Student',
      customerEmail: user.email || 'student@chapterready.in',
      customerPhone: '9999999999',
      orderNote: product.title,
    });

    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        userId: user.id,
        razorpayOrderId: cashfreeOrder.orderId,
        paymentGateway: 'cashfree',
        gatewayPaymentSessionId: cashfreeOrder.paymentSessionId,
        amount: product.pricePaise,
        currency: product.currency,
        productKey: product.key,
        subjectSlug: product.scope === 'single_subject' ? subjectSlug : null,
        status: 'created',
        receipt,
        notesJson: {
          productTitle: product.title,
        },
      },
    });

    return res.status(201).json({
      gateway: 'cashfree',
      orderId: cashfreeOrder.orderId,
      paymentSessionId: cashfreeOrder.paymentSessionId,
      paymentOrderId: paymentOrder.id,
      amount: cashfreeOrder.amount,
      currency: cashfreeOrder.currency,
      mode: cashfreeOrder.mode,
      product: {
        key: product.key,
        title: product.title,
        pricePaise: product.pricePaise,
      },
    });
  } catch (error) {
    console.error('Failed to create Cashfree order:', error);
    const message = error instanceof Error ? error.message : 'Failed to initiate payment.';
    return res.status(500).json({
      message: 'Failed to initiate payment. Please try again.',
      details: message,
    });
  }
});

/**
 * POST /v1/payments/verify
 * Body: { orderId, razorpayOrderId?, razorpayPaymentId?, razorpaySignature? }
 * Verifies payment status and immediately activates user entitlement.
 */
paymentsRouter.post('/verify', async (req: Request, res: Response) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to verify payment.' });
  }

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = (req.body as {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }) || {};

  const targetOrderId = orderId || razorpayOrderId;
  if (!targetOrderId) {
    return res.status(400).json({ message: 'Missing orderId parameter.' });
  }

  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId: targetOrderId },
  });

  if (!paymentOrder) {
    return res.status(404).json({ message: 'Order record not found.' });
  }

  if (paymentOrder.userId !== user.id) {
    return res.status(403).json({ message: 'Order does not belong to this user.' });
  }

  // If already paid, return success immediately
  if (paymentOrder.status === 'paid') {
    return res.json({
      success: true,
      message: 'Payment already verified.',
      productKey: paymentOrder.productKey,
      subjectSlug: paymentOrder.subjectSlug,
    });
  }

  if (paymentOrder.paymentGateway === 'cashfree') {
    const cfOrder = await fetchCashfreeOrder(targetOrderId);
    if (cfOrder.status !== 'PAID') {
      return res.status(400).json({ message: `Payment not completed yet (status: ${cfOrder.status}).` });
    }
  } else if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });
    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed: invalid signature.' });
    }
  }

  // Update order status and grant entitlement
  await prisma.$transaction(async (tx) => {
    await tx.paymentOrder.update({
      where: { id: paymentOrder.id },
      data: {
        status: 'paid',
        razorpayPaymentId: razorpayPaymentId || `cf_${targetOrderId}`,
      },
    });

    await tx.userEntitlement.upsert({
      where: {
        userId_productKey_subjectSlug: {
          userId: user.id,
          productKey: paymentOrder.productKey,
          subjectSlug: paymentOrder.subjectSlug ?? '',
        },
      },
      update: {
        status: 'active',
        paymentOrderId: paymentOrder.id,
        validFrom: new Date(),
      },
      create: {
        userId: user.id,
        productKey: paymentOrder.productKey,
        subjectSlug: paymentOrder.subjectSlug,
        scope: 'mock_test_series',
        status: 'active',
        paymentOrderId: paymentOrder.id,
      },
    });
  });

  return res.json({
    success: true,
    message: 'Payment verified and entitlement activated successfully.',
    productKey: paymentOrder.productKey,
    subjectSlug: paymentOrder.subjectSlug,
  });
});

/**
 * POST /v1/payments/cashfree-webhook
 * Cashfree asynchronous webhook handler for order payment and refunds.
 */
paymentsRouter.post('/cashfree-webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-webhook-signature'] as string | undefined;
  const timestamp = req.headers['x-webhook-timestamp'] as string | undefined;
  const rawBody = JSON.stringify(req.body);

  if (signature && timestamp) {
    const isValid = verifyCashfreeWebhookSignature({
      rawBody,
      timestamp,
      signature,
    });
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Cashfree webhook signature.' });
    }
  }

  const type = req.body?.type;
  const data = req.body?.data;
  const orderId = data?.order?.order_id || data?.order_id;

  if (type === 'PAYMENT_SUCCESS_WEBHOOK' || type === 'ORDER_PAID_SUCCESS' || data?.order?.order_status === 'PAID') {
    if (orderId) {
      const order = await prisma.paymentOrder.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (order && order.status !== 'paid') {
        await grantEntitlement({
          userId: order.userId,
          productKey: order.productKey,
          subjectSlug: order.subjectSlug,
          paymentOrderId: order.id,
        });

        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            razorpayPaymentId: data?.payment?.cf_payment_id ? String(data.payment.cf_payment_id) : `cf_${orderId}`,
          },
        });
      }
    }
  }

  return res.json({ status: 'ok' });
});

/**
 * POST /v1/payments/admin/refund
 * Admin-only endpoint to process a refund and revoke entitlement.
 */
paymentsRouter.post('/admin/refund', async (req: Request, res: Response) => {
  const user = await getSessionUser(req);
  if (!user || user.role !== UserRole.admin) {
    return res.status(403).json({ message: 'Admin authorization required.' });
  }

  const { orderId, reason } = (req.body as {
    orderId?: string;
    reason?: string;
  }) || {};

  if (!orderId) {
    return res.status(400).json({ message: 'Missing orderId parameter.' });
  }

  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return res.status(404).json({ message: 'Payment order not found.' });
  }

  if (order.status !== 'paid' || !order.razorpayPaymentId) {
    return res.status(400).json({ message: 'Order is not in paid status.' });
  }

  try {
    const refundRes = await createRazorpayRefund({
      paymentId: order.razorpayPaymentId,
      amount: order.amount,
      notes: {
        reason: reason || 'admin_initiated_refund',
        userId: order.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: 'refunded',
        },
      });

      await tx.userEntitlement.updateMany({
        where: {
          userId: order.userId,
          productKey: order.productKey,
          subjectSlug: order.subjectSlug,
        },
        data: {
          status: 'revoked',
        },
      });
    });

    return res.json({
      success: true,
      message: 'Refund issued and entitlement revoked successfully.',
      refundId: refundRes.id,
    });
  } catch (err) {
    console.error('Failed to issue refund:', err);
    return res.status(500).json({ message: 'Failed to issue refund on Razorpay gateway.' });
  }
});

/**
 * POST /v1/payments/webhook
 * Razorpay asynchronous webhook handler for payment.captured, order.paid, and refund.processed.
 */
paymentsRouter.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'];
  if (typeof signature !== 'string') {
    return res.status(400).json({ message: 'Missing webhook signature.' });
  }

  const rawBody = JSON.stringify(req.body);
  const isValid = verifyRazorpayWebhookSignature({
    rawBody,
    signature,
  });

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid webhook signature.' });
  }

  const event = req.body?.event as string;
  const payload = req.body?.payload;

  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = payload?.payment?.entity;
    const orderId = paymentEntity?.order_id || payload?.order?.entity?.id;
    const paymentId = paymentEntity?.id;

    if (orderId) {
      const order = await prisma.paymentOrder.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (order && order.status !== 'paid') {
        await grantEntitlement({
          userId: order.userId,
          productKey: order.productKey,
          subjectSlug: order.subjectSlug,
          paymentOrderId: order.id,
        });

        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            razorpayPaymentId: paymentId || order.razorpayPaymentId,
          },
        });
      }
    }
  } else if (event === 'refund.processed' || event === 'payment.refunded') {
    const paymentEntity = payload?.payment?.entity || payload?.refund?.entity;
    const paymentId = paymentEntity?.payment_id || paymentEntity?.id;

    if (paymentId) {
      const order = await prisma.paymentOrder.findFirst({
        where: { razorpayPaymentId: paymentId },
      });

      if (order && order.status !== 'refunded') {
        await revokeEntitlement({
          userId: order.userId,
          productKey: order.productKey,
          subjectSlug: order.subjectSlug,
        });

        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: {
            status: 'refunded',
          },
        });
      }
    }
  }

  return res.json({ status: 'ok' });
});

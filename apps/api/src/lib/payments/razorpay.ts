import { createHmac } from 'node:crypto';

export type CreateOrderParams = {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
};

export class RazorpayConfigError extends Error {
  constructor(message = 'Razorpay credentials are not configured.') {
    super(message);
    this.name = 'RazorpayConfigError';
  }
}

export class RazorpayApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'RazorpayApiError';
    this.statusCode = statusCode;
  }
}

export function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // If running in development/test without live credentials, provide safe dummy test credentials
    if (process.env.NODE_ENV !== 'production') {
      return {
        keyId: keyId || 'rzp_test_placeholder_key',
        keySecret: keySecret || 'placeholder_secret',
      };
    }
    throw new RazorpayConfigError();
  }

  return { keyId, keySecret };
}

/**
 * Creates an order with Razorpay via their REST API.
 * Uses native fetch + HTTP Basic Auth.
 */
export async function createRazorpayOrder(
  params: CreateOrderParams,
  injectedFetch: typeof fetch = fetch,
): Promise<RazorpayOrderResponse> {
  const { keyId, keySecret } = getRazorpayCredentials();

  // Simulated test mode when using placeholder keys
  if (keyId.startsWith('rzp_test_placeholder')) {
    return {
      id: `order_sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      status: 'created',
      keyId,
    };
  }

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await injectedFetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new RazorpayApiError(
      `Razorpay order creation failed (${response.status}): ${errorText}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };

  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    receipt: data.receipt,
    status: data.status,
    keyId,
  };
}

/**
 * Verifies the Razorpay payment signature using HMAC SHA-256.
 * Expected signature = hmac_sha256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secretOverride,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secretOverride?: string;
}): boolean {
  let secret = secretOverride;
  if (!secret) {
    const creds = getRazorpayCredentials();
    secret = creds.keySecret;
  }

  // If using placeholder secret in local dev test mode, accept matching simulation signature
  if (secret === 'placeholder_secret' && signature === `sim_sig_${orderId}_${paymentId}`) {
    return true;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Verifies an incoming Razorpay webhook signature.
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
  webhookSecret,
}: {
  rawBody: string;
  signature: string;
  webhookSecret?: string;
}): boolean {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

export type CreateRefundParams = {
  paymentId: string;
  amount?: number; // in paise (optional, defaults to full amount)
  notes?: Record<string, string>;
};

export type RazorpayRefundResponse = {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
};

/**
 * Creates a refund with Razorpay.
 */
export async function createRazorpayRefund(
  params: CreateRefundParams,
  injectedFetch: typeof fetch = fetch,
): Promise<RazorpayRefundResponse> {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (keyId.startsWith('rzp_test_placeholder')) {
    return {
      id: `rfd_sim_${Date.now()}`,
      paymentId: params.paymentId,
      amount: params.amount || 19900,
      currency: 'INR',
      status: 'processed',
    };
  }

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await injectedFetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(params.paymentId)}/refund`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        ...(params.amount ? { amount: params.amount } : {}),
        notes: params.notes || {},
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new RazorpayApiError(
      `Razorpay refund failed (${response.status}): ${errorText}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    id: string;
    payment_id: string;
    amount: number;
    currency: string;
    status: string;
  };

  return {
    id: data.id,
    paymentId: data.payment_id,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
  };
}


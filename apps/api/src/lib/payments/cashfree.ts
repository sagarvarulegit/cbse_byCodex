import { createHmac } from 'node:crypto';

export type CreateCashfreeOrderParams = {
  orderId: string;
  amountPaise: number;
  currency?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl?: string;
  notifyUrl?: string;
  orderNote?: string;
};

export type CashfreeOrderResponse = {
  orderId: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  status: string;
  mode: 'production' | 'sandbox';
};

export type CashfreeRefundParams = {
  orderId: string;
  refundId: string;
  refundAmountPaise: number;
  refundNote?: string;
};

export type CashfreeRefundResponse = {
  refundId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
};

export class CashfreeConfigError extends Error {
  constructor(message = 'Cashfree credentials are not configured.') {
    super(message);
    this.name = 'CashfreeConfigError';
  }
}

export class CashfreeApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'CashfreeApiError';
    this.statusCode = statusCode;
  }
}

export function getCashfreeCredentials(): {
  appId: string;
  secretKey: string;
  mode: 'production' | 'sandbox';
  baseUrl: string;
} {
  const appId = process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || '';
  const secretKey = process.env.CASHFREE_SECRET_KEY || '';
  const explicitMode = process.env.CASHFREE_MODE as 'production' | 'sandbox' | undefined;
  const mode: 'production' | 'sandbox' =
    explicitMode || (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox');

  const baseUrl =
    mode === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

  if (!appId || !secretKey) {
    if (mode === 'production') {
      throw new CashfreeConfigError(
        'Cashfree production credentials missing: CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be configured.',
      );
    }
    return {
      appId: appId || 'cf_placeholder_app_id',
      secretKey: secretKey || 'placeholder_secret',
      mode,
      baseUrl,
    };
  }

  return { appId, secretKey, mode, baseUrl };
}

/**
 * Creates an order in Cashfree PG via REST API.
 * Returns payment_session_id used for client-side popup checkout.
 */
export async function createCashfreeOrder(
  params: CreateCashfreeOrderParams,
  injectedFetch: typeof fetch = fetch,
): Promise<CashfreeOrderResponse> {
  const { appId, secretKey, mode, baseUrl } = getCashfreeCredentials();

  // Simulated fallback only in non-production environments with placeholder keys
  if (appId.startsWith('cf_placeholder')) {
    if (mode === 'production') {
      throw new CashfreeConfigError('Cannot use simulated Cashfree keys in production mode.');
    }
    return {
      orderId: params.orderId,
      paymentSessionId: `session_sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: params.amountPaise,
      currency: params.currency || 'INR',
      status: 'ACTIVE',
      mode,
    };
  }

  const response = await injectedFetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
    },
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.amountPaise / 100,
      order_currency: params.currency || 'INR',
      customer_details: {
        customer_id: params.customerId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50),
        customer_name: params.customerName || 'Class 10 Student',
        customer_email: params.customerEmail || 'student@chapterready.in',
        customer_phone: params.customerPhone || '9999999999',
      },
      order_meta: {
        return_url:
          params.returnUrl ||
          'https://www.chapterready.in/exam-papers?order_id={order_id}',
        notify_url:
          params.notifyUrl ||
          'https://cbse-bycodex-api.vercel.app/v1/payments/cashfree-webhook',
      },
      order_note: params.orderNote || 'ChapterReady CBSE Class 10 Mock Pass',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new CashfreeApiError(
      `Cashfree order creation failed (${response.status}): ${errorText}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    order_id: string;
    payment_session_id: string;
    order_amount: number;
    order_currency: string;
    order_status: string;
  };

  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    amount: Math.round(data.order_amount * 100),
    currency: data.order_currency,
    status: data.order_status,
    mode,
  };
}

/**
 * Fetches order details and status from Cashfree.
 */
export async function fetchCashfreeOrder(
  orderId: string,
  injectedFetch: typeof fetch = fetch,
): Promise<{ orderId: string; status: 'PAID' | 'ACTIVE' | 'EXPIRED' | string; amount: number; currency: string }> {
  const { appId, secretKey, baseUrl } = getCashfreeCredentials();

  if (appId.startsWith('cf_placeholder')) {
    return {
      orderId,
      status: 'PAID',
      amount: 19900,
      currency: 'INR',
    };
  }

  const response = await injectedFetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new CashfreeApiError(
      `Failed to fetch Cashfree order (${response.status}): ${errorText}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    order_id: string;
    order_status: string;
    order_amount: number;
    order_currency: string;
  };

  return {
    orderId: data.order_id,
    status: data.order_status,
    amount: Math.round(data.order_amount * 100),
    currency: data.order_currency,
  };
}

/**
 * Initiates a refund for an order in Cashfree.
 */
export async function createCashfreeRefund(
  params: CashfreeRefundParams,
  injectedFetch: typeof fetch = fetch,
): Promise<CashfreeRefundResponse> {
  const { appId, secretKey, baseUrl } = getCashfreeCredentials();

  if (appId.startsWith('cf_placeholder')) {
    return {
      refundId: params.refundId,
      orderId: params.orderId,
      amount: params.refundAmountPaise,
      currency: 'INR',
      status: 'SUCCESS',
    };
  }

  const response = await injectedFetch(`${baseUrl}/orders/${encodeURIComponent(params.orderId)}/refunds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
    },
    body: JSON.stringify({
      refund_amount: params.refundAmountPaise / 100,
      refund_id: params.refundId,
      refund_note: params.refundNote || 'ChapterReady Satisfaction Guarantee Refund',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new CashfreeApiError(
      `Cashfree refund failed (${response.status}): ${errorText}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    refund_id: string;
    order_id: string;
    refund_amount: number;
    refund_currency: string;
    refund_status: string;
  };

  return {
    refundId: data.refund_id,
    orderId: data.order_id,
    amount: Math.round(data.refund_amount * 100),
    currency: data.refund_currency,
    status: data.refund_status,
  };
}

/**
 * Verifies incoming Cashfree webhook signature.
 */
export function verifyCashfreeWebhookSignature({
  rawBody,
  timestamp,
  signature,
  secretKeyOverride,
}: {
  rawBody: string;
  timestamp: string;
  signature: string;
  secretKeyOverride?: string;
}): boolean {
  let secretKey = secretKeyOverride;
  if (!secretKey) {
    const creds = getCashfreeCredentials();
    secretKey = creds.secretKey;
  }

  if (!secretKey || secretKey === 'placeholder_secret') {
    return true;
  }

  const expectedSignature = createHmac('sha256', secretKey)
    .update(timestamp + rawBody)
    .digest('base64');

  return expectedSignature === signature;
}

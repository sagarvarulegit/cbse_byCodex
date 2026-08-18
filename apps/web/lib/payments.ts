export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return 'https://cbse-bycodex-api.vercel.app';
  }
  return 'http://localhost:4000';
}

export const ALL_SUBJECTS_MOCK_PACK_KEY = 'cbse10-all-subjects-mock-pack';

export type PaymentProduct = {
  key: string;
  title: string;
  description: string;
  pricePaise: number;
  originalPricePaise: number;
  currency: string;
  scope: 'all_subjects' | 'single_subject';
  includedSubjects: string[];
  paperCount: number;
  badge?: string;
};

export type StudentEntitlementsResponse = {
  entitlements: Array<{
    id: string;
    productKey: string;
    subjectSlug: string | null;
    scope: string;
    status: string;
    validFrom: string;
    validUntil: string | null;
    isAllSubjects: boolean;
  }>;
  hasAllSubjects: boolean;
  unlockedSubjectSlugs: string[];
};

export type CreateOrderResponse = {
  gateway?: 'cashfree' | 'razorpay';
  orderId: string;
  paymentSessionId?: string;
  paymentOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  mode?: 'production' | 'sandbox';
  product: {
    key: string;
    title: string;
    pricePaise: number;
  };
};

export type VerifyPaymentResponse = {
  success: boolean;
  message: string;
  productKey?: string;
  subjectSlug?: string | null;
};

async function apiFetch<T>(
  token: string | null,
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorBody.message || `API request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`API fetch failed for ${path}:`, error);
    return null;
  }
}

// In-memory caches for high performance and reduced DB load
let cachedProducts: { data: PaymentProduct[]; timestamp: number } | null = null;
const entitlementsCache = new Map<string, { data: StudentEntitlementsResponse; timestamp: number }>();
const ordersCache = new Map<string, { data: StudentOrder[]; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function invalidatePaymentsCache(token?: string | null) {
  if (token) {
    entitlementsCache.delete(token);
    ordersCache.delete(token);
  } else {
    entitlementsCache.clear();
    ordersCache.clear();
  }
}

export async function fetchPaymentProducts(): Promise<PaymentProduct[]> {
  const now = Date.now();
  if (cachedProducts && now - cachedProducts.timestamp < 3600 * 1000) {
    return cachedProducts.data;
  }

  const data = await apiFetch<{ products: PaymentProduct[] }>(null, '/v1/payments/products');
  const products = data?.products || [];
  if (products.length > 0) {
    cachedProducts = { data: products, timestamp: now };
  }
  return products;
}

export async function fetchStudentEntitlements(
  token: string | null,
): Promise<StudentEntitlementsResponse | null> {
  if (!token) return null;

  const now = Date.now();
  const cached = entitlementsCache.get(token);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const data = await apiFetch<StudentEntitlementsResponse>(token, '/v1/payments/entitlements');
  if (data) {
    entitlementsCache.set(token, { data, timestamp: now });
  }
  return data;
}

export async function createPaymentOrder(
  token: string | null,
  productKey: string,
  subjectSlug?: string,
): Promise<CreateOrderResponse | null> {
  return apiFetch<CreateOrderResponse>(token, '/v1/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ productKey, subjectSlug }),
  });
}

export async function verifyPayment(
  token: string | null,
  payload: {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  },
): Promise<VerifyPaymentResponse | null> {
  const res = await apiFetch<VerifyPaymentResponse>(token, '/v1/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res?.success) {
    invalidatePaymentsCache(token);
  }

  return res;
}

export type StudentOrder = {
  id: string;
  orderId?: string;
  paymentGateway?: string;
  paymentId?: string | null;
  amount: number;
  currency: string;
  productKey: string;
  subjectSlug: string | null;
  status: string;
  receipt: string;
  createdAt: string;
  refundRequest: {
    id: string;
    status: string;
    reason: string;
    createdAt: string;
  } | null;
  eligibility: {
    isEligibleForInstantRefund: boolean;
    canSwapSubject: boolean;
    requiresAdminReview: boolean;
    reasonCategory: string;
    hoursElapsed: number;
    premiumAttemptsCount: number;
  } | null;
};

export async function fetchStudentOrders(
  token: string | null,
): Promise<StudentOrder[]> {
  if (!token) return [];

  const now = Date.now();
  const cached = ordersCache.get(token);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const data = await apiFetch<{ orders: StudentOrder[] }>(token, '/v1/payments/orders');
  const orders = data?.orders || [];
  if (orders.length > 0) {
    ordersCache.set(token, { data: orders, timestamp: now });
  }
  return orders;
}

export async function submitRefundRequest(
  token: string | null,
  payload: {
    orderId: string;
    reason: string;
    details?: string;
  },
): Promise<{ success: boolean; status: string; message: string; refundId?: string } | null> {
  const res = await apiFetch<{ success: boolean; status: string; message: string; refundId?: string }>(token, '/v1/payments/refund-request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res?.success) {
    invalidatePaymentsCache(token);
  }

  return res;
}

export async function swapSubjectPass(
  token: string | null,
  payload: {
    orderId: string;
    targetSubjectSlug?: string;
    newSubjectSlug?: string;
  },
): Promise<{ success: boolean; message: string } | null> {
  const targetSubject = payload.targetSubjectSlug || payload.newSubjectSlug;
  const res = await apiFetch<{ success: boolean; message: string }>(token, '/v1/payments/swap-subject', {
    method: 'POST',
    body: JSON.stringify({ orderId: payload.orderId, targetSubjectSlug: targetSubject }),
  });

  if (res?.success) {
    invalidatePaymentsCache(token);
  }

  return res;
}

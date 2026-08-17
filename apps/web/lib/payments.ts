function getApiBaseUrl(): string {
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
  orderId: string;
  paymentOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
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

export async function fetchPaymentProducts(): Promise<PaymentProduct[]> {
  const data = await apiFetch<{ products: PaymentProduct[] }>(null, '/v1/payments/products');
  return data?.products || [];
}

export async function fetchStudentEntitlements(
  token: string | null,
): Promise<StudentEntitlementsResponse | null> {
  return apiFetch<StudentEntitlementsResponse>(token, '/v1/payments/entitlements');
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
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
): Promise<VerifyPaymentResponse | null> {
  return apiFetch<VerifyPaymentResponse>(token, '/v1/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type StudentOrder = {
  id: string;
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
  const data = await apiFetch<{ orders: StudentOrder[] }>(token, '/v1/payments/orders');
  return data?.orders || [];
}

export async function submitRefundRequest(
  token: string | null,
  payload: {
    orderId: string;
    reason: string;
    details?: string;
  },
): Promise<{ success: boolean; status: string; message: string; refundId?: string } | null> {
  return apiFetch(token, '/v1/payments/refund-request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function swapSubjectPass(
  token: string | null,
  payload: {
    orderId: string;
    targetSubjectSlug: string;
  },
): Promise<{ success: boolean; message: string } | null> {
  return apiFetch(token, '/v1/payments/swap-subject', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


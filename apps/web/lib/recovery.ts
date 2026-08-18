import { getApiBaseUrl } from './payments';

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  maskedEmail?: string;
  debugOtp?: string;
};

export type FindAccountResponse = {
  success: boolean;
  found: boolean;
  email?: string;
  maskedEmail?: string;
  studentName?: string;
  message: string;
  debugOtp?: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  resetSessionToken?: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string | null;
    fullName: string;
    classLevel: number;
    role: string;
  };
};

async function postApi<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export async function requestForgotPasswordOtp(email: string): Promise<ForgotPasswordResponse> {
  return postApi<ForgotPasswordResponse>('/v1/auth/recovery/forgot-password', { email });
}

export async function findAccountByIdentifier({
  searchType,
  query,
  extra,
}: {
  searchType: 'phone' | 'payment_order' | 'guardian_details';
  query: string;
  extra?: string;
}): Promise<FindAccountResponse> {
  return postApi<FindAccountResponse>('/v1/auth/recovery/find-account', {
    searchType,
    query,
    extra,
  });
}

export async function verifyRecoveryOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> {
  return postApi<VerifyOtpResponse>('/v1/auth/recovery/verify-otp', { email, otp });
}

export async function resetPasswordWithToken({
  email,
  resetSessionToken,
  newPassword,
}: {
  email: string;
  resetSessionToken: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  return postApi<ResetPasswordResponse>('/v1/auth/recovery/reset-password', {
    email,
    resetSessionToken,
    newPassword,
  });
}

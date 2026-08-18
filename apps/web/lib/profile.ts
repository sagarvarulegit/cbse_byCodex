import { getApiBaseUrl } from './payments';

export type StudentProfileDetails = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  classLevel: number;
  schoolName: string | null;
  targetExamYear: number | null;
  preferredLanguage: string;
  guardianFullName: string | null;
  guardianEmail: string | null;
  guardianRelationship: string | null;
  createdAt: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phone?: string;
  schoolName?: string;
  targetExamYear?: number;
  guardianFullName?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
  token: string;
  profile: StudentProfileDetails;
};

export async function fetchStudentProfile(
  token: string | null,
): Promise<StudentProfileDetails | null> {
  if (!token) return null;

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { profile: StudentProfileDetails };
    return data.profile;
  } catch (err) {
    console.error('fetchStudentProfile error:', err);
    return null;
  }
}

export async function updateStudentProfile(
  token: string | null,
  payload: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  if (!token) throw new Error('Not authenticated');

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/v1/auth/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  // Update local auth token so client session stays updated
  if (data.token && typeof window !== 'undefined') {
    try {
      localStorage.setItem('cbse_auth_token', data.token);
      document.cookie = `cbse_auth_token=${data.token}; path=/; max-age=1209600; SameSite=Lax`;
    } catch {
      // ignore
    }
  }

  return data as UpdateProfileResponse;
}

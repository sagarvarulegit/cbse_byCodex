import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to load your mock test attempts.' },
      { status: 401 },
    );
  }

  const requestUrl = new URL(request.url);
  const params = new URLSearchParams();
  const paperId = requestUrl.searchParams.get('paperId');
  if (paperId) {
    params.set('paperId', paperId);
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/exam-papers/attempts?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { attempts: [] }, {
    status: response.status,
  });
}

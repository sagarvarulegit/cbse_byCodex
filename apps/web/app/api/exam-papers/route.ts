import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET() {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to load your mock test papers.' },
      { status: 401 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/v1/exam-papers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);

  return NextResponse.json(data ?? { papers: [] }, {
    status: response.status,
  });
}

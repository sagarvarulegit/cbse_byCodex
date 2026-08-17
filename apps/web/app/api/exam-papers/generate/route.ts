import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to generate a sample test paper.' },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: 'Invalid paper-generation payload.' },
      { status: 400 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/v1/exam-papers/generate`, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const data = await response.json().catch(() => null);

  return NextResponse.json(data ?? { message: 'Paper generation failed.' }, {
    status: response.status,
  });
}

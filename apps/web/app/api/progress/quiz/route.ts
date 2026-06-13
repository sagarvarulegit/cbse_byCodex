import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to save quiz progress.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid quiz progress payload.' }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/v1/progress/quiz`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
}

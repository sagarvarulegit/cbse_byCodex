import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to save your mock test attempt.' },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: 'Invalid exam-paper attempt payload.' },
      { status: 400 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/v1/exam-papers/${id}/attempt`, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { saved: response.ok }, {
    status: response.status,
  });
}

import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET() {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Sign in to view your chats.' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE_URL}/v1/tutor/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { conversations: [] }, { status: response.status });
}

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Sign in to start a chat with Tara.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid conversation payload.' }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/v1/tutor/conversations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { conversation: null }, { status: response.status });
}

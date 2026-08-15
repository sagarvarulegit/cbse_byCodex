import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Sign in to view your chat.' }, { status: 401 });
  }

  const { id } = await params;
  const response = await fetch(`${API_BASE_URL}/v1/tutor/conversations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { conversation: null }, { status: response.status });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Sign in to delete a chat.' }, { status: 401 });
  }

  const { id } = await params;
  const response = await fetch(`${API_BASE_URL}/v1/tutor/conversations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { deleted: false }, { status: response.status });
}

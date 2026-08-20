import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = await getStudentSessionToken();
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid update payload.' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/feedback/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      },
    );

    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json({ message: 'Unable to update feedback right now.' }, { status: 500 });
  }
}

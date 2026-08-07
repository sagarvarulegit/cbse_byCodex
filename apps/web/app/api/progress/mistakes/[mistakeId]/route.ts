import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ mistakeId: string }> },
) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to update My Mistakes.' }, { status: 401 });
  }
  const { mistakeId } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid mistake update.' }, { status: 400 });
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/progress/mistakes/${encodeURIComponent(mistakeId)}`,
    {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  );
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
}

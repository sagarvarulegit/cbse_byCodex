import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to view Exam Ready.' }, { status: 401 });
  }
  const incoming = new URL(request.url);
  const chapterSlug = incoming.searchParams.get('chapterSlug');
  const target = new URL('/v1/progress/exam-readiness', API_BASE_URL);
  if (chapterSlug) {
    target.searchParams.set('chapterSlug', chapterSlug);
  }
  const response = await fetch(target, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { message: 'Unable to load Exam Ready.' }, { status: response.status });
}

export async function PATCH(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to update Exam Ready.' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid Exam Ready update.' }, { status: 400 });
  }
  const response = await fetch(`${API_BASE_URL}/v1/progress/exam-readiness`, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
}

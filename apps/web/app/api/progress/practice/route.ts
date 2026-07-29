import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to load written-practice attempts.' },
      { status: 401 },
    );
  }

  const requestUrl = new URL(request.url);
  const params = new URLSearchParams();
  const chapterSlug = requestUrl.searchParams.get('chapterSlug');
  const practiceItemId = requestUrl.searchParams.get('practiceItemId');
  if (chapterSlug) {
    params.set('chapterSlug', chapterSlug);
  }
  if (practiceItemId) {
    params.set('practiceItemId', practiceItemId);
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/progress/practice-attempts?${params.toString()}`,
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

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json(
      { message: 'Sign in to sync written-practice attempts.' },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: 'Invalid written-practice payload.' },
      { status: 400 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/v1/progress/practice`, {
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

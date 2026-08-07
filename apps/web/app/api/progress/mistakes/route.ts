import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to view My Mistakes.' }, { status: 401 });
  }

  const incoming = new URL(request.url);
  const target = new URL('/v1/progress/mistakes', API_BASE_URL);
  for (const name of ['chapterSlug', 'status']) {
    const value = incoming.searchParams.get(name);
    if (value) {
      target.searchParams.set(name, value);
    }
  }
  const response = await fetch(target, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { items: [] }, { status: response.status });
}

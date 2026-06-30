import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';
import { EMPTY_QUIZ_ATTEMPT_HISTORY } from '../../../../lib/quiz-attempts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to view quiz attempts.' }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const chapterSlug = requestUrl.searchParams.get('chapterSlug');
  const targetUrl = new URL('/v1/progress/quiz-attempts', API_BASE_URL);
  if (chapterSlug) {
    targetUrl.searchParams.set('chapterSlug', chapterSlug);
  }

  const response = await fetch(targetUrl, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? EMPTY_QUIZ_ATTEMPT_HISTORY, { status: response.status });
}

import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid feedback payload.' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
  } catch (error) {
    console.error('Error forwarding feedback to API:', error);
    return NextResponse.json({ message: 'Unable to send feedback right now.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  const { searchParams } = new URL(request.url);

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const query = searchParams.toString();
    const url = query ? `${API_BASE_URL}/v1/feedback?${query}` : `${API_BASE_URL}/v1/feedback`;
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { items: [] }, { status: response.status });
  } catch (error) {
    console.error('Error fetching feedback from API:', error);
    return NextResponse.json({ message: 'Unable to load feedback right now.' }, { status: 500 });
  }
}

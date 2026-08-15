import { getStudentSessionToken } from '../../../../../../lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

/**
 * POST /api/tutor/conversations/:id/messages
 * Forwards the multipart form (question + files) or JSON body to the API and
 * streams the SSE response back to the browser.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getStudentSessionToken();
  if (!token) {
    return new Response(JSON.stringify({ message: 'Sign in to chat with Tara.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = await params;
  const contentType = request.headers.get('content-type') ?? '';
  const isMultipart = contentType.includes('multipart/form-data');

  const path = isMultipart
    ? `/v1/tutor/conversations/${id}/messages`
    : `/v1/tutor/conversations/${id}/messages-json`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit;
  if (isMultipart) {
    // Pass the FormData through so fetch sets the multipart boundary correctly.
    body = await request.formData();
  } else {
    headers['Content-Type'] = 'application/json';
    body = await request.arrayBuffer();
  }

  const upstream = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body,
    cache: 'no-store',
  });

  if (!upstream.ok || !upstream.body) {
    const data = await upstream.json().catch(() => null);
    return new Response(JSON.stringify(data ?? { message: 'Chat failed.' }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream the SSE body through.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

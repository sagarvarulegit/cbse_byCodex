import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type LessonVideoPayload = {
  lesson: {
    accessLevel: string;
    chapterId: string;
    chapterSlug: string;
    id: string;
    subjectId: string;
    title: string;
    topicId: string;
  };
  video: {
    durationSeconds: number | null;
    embedUrl: string;
    expiresAt: number | null;
    id: string;
    playbackUrl: string;
    processingStatus: string;
    provider: string;
    providerVideoId: string;
    thumbnailUrl: string;
  };
};

export async function resolveLessonVideoStatus(loadVideo: () => Promise<Response>) {
  let response: Response;

  try {
    response = await loadVideo();
  } catch {
    return { status: 'not-configured' as const, video: null };
  }

  if (response.status === 401) {
    return { status: 'login-required' as const, video: null };
  }

  if (response.status === 404) {
    return { status: 'not-configured' as const, video: null };
  }

  if (!response.ok) {
    return { status: 'error' as const, video: null };
  }

  const video = (await response.json()) as LessonVideoPayload;
  return { status: 'ready' as const, video };
}

export async function getLessonVideo(chapterSlug: string, lessonSlug: string) {
  const token = await getStudentSessionToken();

  return resolveLessonVideoStatus(() =>
    fetch(
      `${API_BASE_URL}/v1/lessons/by-slug/${encodeURIComponent(chapterSlug)}/${encodeURIComponent(lessonSlug)}/video`,
      {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
    ),
  );
}

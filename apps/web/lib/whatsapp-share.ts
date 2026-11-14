import { trackAnalyticsEvent } from './analytics';

export const PRODUCTION_ORIGIN = 'https://www.chapterready.in';

export function buildWhatsAppShareUrl(message: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

export function buildChallengeUrl(
  pathname: string,
  params: Record<string, string | number | undefined | null> = {},
): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value).trim());
    }
  }

  const qs = search.toString();
  return `${PRODUCTION_ORIGIN}${cleanPath}${qs ? `?${qs}` : ''}`;
}

export function openWhatsAppChallenge(options: {
  message: string;
  surface: string;
  chapterSlug?: string;
}): void {
  const { message, surface, chapterSlug } = options;

  trackAnalyticsEvent('whatsapp_challenge_share', {
    surface,
    chapter_slug: chapterSlug ?? undefined,
  });

  if (typeof window === 'undefined') return;

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(message).catch(() => undefined);
  }

  const whatsappUrl = buildWhatsAppShareUrl(message);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

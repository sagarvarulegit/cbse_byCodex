export const DEFAULT_POST_AUTH_PATH = '/dashboard';
export const DEFAULT_POST_SIGNUP_PATH = '/dashboard?welcome=1';

export function getSafeNextPath(value: string | null | undefined): string {
  if (!value) {
    return DEFAULT_POST_AUTH_PATH;
  }

  const trimmed = value.trim();
  if (
    trimmed.length < 2 ||
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes('\\') ||
    /[\s<>]/.test(trimmed)
  ) {
    return DEFAULT_POST_AUTH_PATH;
  }

  return trimmed;
}

export function getSafePostSignupPath(value: string | null | undefined): string {
  const safeNext = getSafeNextPath(value);

  // If no specific path was requested, or it fell back to default auth path or
  // the legacy Chapter 1 (Real Numbers) redirect, route to the post-signup
  // welcome choice modal on /dashboard?welcome=1.
  if (
    !value ||
    safeNext === DEFAULT_POST_AUTH_PATH ||
    safeNext === '/chapters/real-numbers' ||
    safeNext === '/chapters/real-numbers/notes'
  ) {
    return DEFAULT_POST_SIGNUP_PATH;
  }

  const notesMatch = safeNext.match(/^\/chapters\/([a-z0-9-]+)\/notes(?:\?.*)?$/);
  if (notesMatch) {
    return `/chapters/${notesMatch[1]}`;
  }

  return safeNext;
}

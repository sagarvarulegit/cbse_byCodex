export const DEFAULT_POST_AUTH_PATH = '/dashboard';
export const DEFAULT_POST_SIGNUP_PATH = '/chapters/real-numbers';

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

  // If no specific path was requested or it fell back to default auth path,
  // route to the Quick Win Choice Screen on the Real Numbers chapter hub.
  if (!value || safeNext === DEFAULT_POST_AUTH_PATH) {
    return DEFAULT_POST_SIGNUP_PATH;
  }

  // Re-route the previous flow (Signup -> Chapter Notes /chapters/real-numbers/notes)
  // to the chapter hub Quick Win Choice Screen instead.
  if (safeNext === '/chapters/real-numbers/notes') {
    return DEFAULT_POST_SIGNUP_PATH;
  }

  const notesMatch = safeNext.match(/^\/chapters\/([a-z0-9-]+)\/notes(?:\?.*)?$/);
  if (notesMatch) {
    return `/chapters/${notesMatch[1]}`;
  }

  return safeNext;
}

export const DEFAULT_POST_AUTH_PATH = '/dashboard';

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

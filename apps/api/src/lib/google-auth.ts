import { createPublicKey, type JsonWebKey, verify as cryptoVerify } from 'node:crypto';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const VALID_GOOGLE_ISSUERS = new Set([
  'accounts.google.com',
  'https://accounts.google.com',
]);
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CLOCK_SKEW_SECONDS = 60;

export type GoogleJwk = JsonWebKey & {
  kid?: string;
  alg?: string;
  use?: string;
};

export type GoogleJwksResponse = {
  keys?: GoogleJwk[];
};

export type VerifiedGoogleIdentity = {
  email: string;
  fullName: string;
  googleSub: string;
  pictureUrl: string | null;
};

export class GoogleAuthConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleAuthConfigError';
  }
}

export class GoogleAuthTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleAuthTokenError';
  }
}

let cachedJwks: { keys: GoogleJwk[]; expiresAt: number } | null = null;

export function clearGoogleJwksCache() {
  cachedJwks = null;
}

export function getConfiguredGoogleClientIds(env: NodeJS.ProcessEnv = process.env): string[] {
  const raw = [env.GOOGLE_CLIENT_ID, env.NEXT_PUBLIC_GOOGLE_CLIENT_ID]
    .filter((val): val is string => typeof val === 'string' && val.trim().length > 0)
    .join(',');

  const unique = new Set(
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

  return Array.from(unique);
}

async function defaultFetchGoogleJwks(): Promise<GoogleJwk[]> {
  const response = await fetch(GOOGLE_JWKS_URL, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google signing keys (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as GoogleJwksResponse;
  if (!Array.isArray(data?.keys) || data.keys.length === 0) {
    throw new Error('Google JWKS response contained no signing keys.');
  }

  return data.keys;
}

async function resolveSigningJwk(
  kid: string,
  jwksFetcher: () => Promise<GoogleJwk[]>,
): Promise<GoogleJwk | null> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) {
    const cachedMatch = cachedJwks.keys.find((k) => k.kid === kid);
    if (cachedMatch) {
      return cachedMatch;
    }
  }

  // Fetch fresh keys (initial fetch or key rotation)
  const freshKeys = await jwksFetcher();
  cachedJwks = {
    keys: freshKeys,
    expiresAt: Date.now() + JWKS_CACHE_TTL_MS,
  };

  return freshKeys.find((k) => k.kid === kid) ?? null;
}

function decodeBase64UrlJson<T>(segment: string): T {
  try {
    const raw = Buffer.from(segment, 'base64url').toString('utf8');
    return JSON.parse(raw) as T;
  } catch {
    throw new GoogleAuthTokenError('Malformed Google ID token.');
  }
}

export function deriveStudentFullName(
  payloadName: unknown,
  givenName: unknown,
  email: string,
): string {
  for (const candidate of [payloadName, givenName]) {
    if (typeof candidate === 'string') {
      const cleaned = candidate.trim().replace(/\s+/g, ' ');
      if (cleaned.length >= 2) {
        return cleaned.slice(0, 80);
      }
    }
  }

  const emailLocal = email
    .split('@')[0]
    ?.replace(/[._-]+/g, ' ')
    .replace(/\d+/g, '')
    .trim()
    .replace(/\s+/g, ' ');

  if (emailLocal && emailLocal.length >= 2) {
    return emailLocal
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .slice(0, 80);
  }

  return 'Class 10 Student';
}

export async function verifyGoogleIdToken(
  credential: string,
  options?: {
    allowedClientIds?: string[];
    jwksFetcher?: () => Promise<GoogleJwk[]>;
    nowSeconds?: number;
  },
): Promise<VerifiedGoogleIdentity> {
  const allowedClientIds = options?.allowedClientIds ?? getConfiguredGoogleClientIds();
  if (allowedClientIds.length === 0) {
    throw new GoogleAuthConfigError(
      'Google Sign-In is not configured on the server yet. Please use email and password.',
    );
  }

  if (typeof credential !== 'string' || credential.trim().length < 20) {
    throw new GoogleAuthTokenError('Missing Google credential token.');
  }

  const segments = credential.trim().split('.');
  if (segments.length !== 3) {
    throw new GoogleAuthTokenError('Invalid Google credential format.');
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = decodeBase64UrlJson<{ alg?: string; kid?: string; typ?: string }>(
    headerSegment,
  );

  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid.trim()) {
    throw new GoogleAuthTokenError('Unsupported Google token signing algorithm.');
  }

  const jwksFetcher = options?.jwksFetcher ?? defaultFetchGoogleJwks;
  const signingJwk = await resolveSigningJwk(header.kid, jwksFetcher);
  if (!signingJwk) {
    throw new GoogleAuthTokenError('Unable to match Google signing key.');
  }

  const publicKey = createPublicKey({
    key: signingJwk,
    format: 'jwk',
  });

  const signedContent = Buffer.from(`${headerSegment}.${payloadSegment}`, 'utf8');
  const signatureBuffer = Buffer.from(signatureSegment, 'base64url');
  const signatureValid = cryptoVerify(
    'RSA-SHA256',
    signedContent,
    publicKey,
    signatureBuffer,
  );

  if (!signatureValid) {
    throw new GoogleAuthTokenError('Invalid Google ID token signature.');
  }

  const payload = decodeBase64UrlJson<{
    iss?: string;
    aud?: string | string[];
    sub?: string;
    email?: string;
    email_verified?: boolean | string;
    name?: string;
    given_name?: string;
    picture?: string;
    exp?: number;
    iat?: number;
  }>(payloadSegment);

  if (!payload.iss || !VALID_GOOGLE_ISSUERS.has(payload.iss)) {
    throw new GoogleAuthTokenError('Invalid Google token issuer.');
  }

  const audiences = Array.isArray(payload.aud)
    ? payload.aud
    : typeof payload.aud === 'string'
      ? [payload.aud]
      : [];
  const matchesClientId = audiences.some((aud) => allowedClientIds.includes(aud));
  if (!matchesClientId) {
    throw new GoogleAuthTokenError('Google token client ID mismatch.');
  }

  const nowSeconds = options?.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp + CLOCK_SKEW_SECONDS <= nowSeconds) {
    throw new GoogleAuthTokenError('Google sign-in token has expired. Please try again.');
  }

  if (typeof payload.iat === 'number' && payload.iat - CLOCK_SKEW_SECONDS > nowSeconds + 300) {
    throw new GoogleAuthTokenError('Google token timestamp is invalid.');
  }

  const emailVerified =
    payload.email_verified === true || payload.email_verified === 'true';
  const normalizedEmail =
    typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!normalizedEmail || !normalizedEmail.includes('@') || !emailVerified) {
    throw new GoogleAuthTokenError('A verified Google email address is required.');
  }

  if (typeof payload.sub !== 'string' || !payload.sub.trim()) {
    throw new GoogleAuthTokenError('Missing Google account identifier.');
  }

  const fullName = deriveStudentFullName(
    payload.name,
    payload.given_name,
    normalizedEmail,
  );

  return {
    email: normalizedEmail,
    fullName,
    googleSub: payload.sub.trim(),
    pictureUrl: typeof payload.picture === 'string' ? payload.picture : null,
  };
}

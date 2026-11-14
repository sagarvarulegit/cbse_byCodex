import assert from 'node:assert/strict';
import { createSign, generateKeyPairSync } from 'node:crypto';
import test from 'node:test';

import {
  clearGoogleJwksCache,
  deriveStudentFullName,
  getConfiguredGoogleClientIds,
  GoogleAuthConfigError,
  GoogleAuthTokenError,
  type GoogleJwk,
  verifyGoogleIdToken,
} from './google-auth.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const exportedJwk = publicKey.export({ format: 'jwk' }) as GoogleJwk;
const testJwk: GoogleJwk = {
  ...exportedJwk,
  kid: 'test-google-kid-1',
  alg: 'RS256',
  use: 'sig',
};

function signTestJwt(
  payload: Record<string, unknown>,
  headerOverrides?: Record<string, unknown>,
) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'test-google-kid-1',
    ...headerOverrides,
  };
  const headerB64 = Buffer.from(JSON.stringify(header), 'utf8').toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signingInput = `${headerB64}.${payloadB64}`;

  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signatureB64 = signer.sign(privateKey).toString('base64url');

  return `${signingInput}.${signatureB64}`;
}

test('verifyGoogleIdToken accepts a valid RS256 Google ID token and normalizes identity', async () => {
  clearGoogleJwksCache();
  const now = 1_800_000_000;
  const token = signTestJwt({
    iss: 'https://accounts.google.com',
    aud: 'test-client-id.apps.googleusercontent.com',
    sub: 'google-user-12345',
    email: '  Aarav.Student@Gmail.com ',
    email_verified: true,
    name: '  Aarav   Sharma ',
    picture: 'https://lh3.googleusercontent.com/a/avatar',
    iat: now - 30,
    exp: now + 3600,
  });

  const identity = await verifyGoogleIdToken(token, {
    allowedClientIds: ['test-client-id.apps.googleusercontent.com'],
    jwksFetcher: async () => [testJwk],
    nowSeconds: now,
  });

  assert.equal(identity.email, 'aarav.student@gmail.com');
  assert.equal(identity.fullName, 'Aarav Sharma');
  assert.equal(identity.googleSub, 'google-user-12345');
  assert.equal(identity.pictureUrl, 'https://lh3.googleusercontent.com/a/avatar');
});

test('verifyGoogleIdToken rejects tampered payload signatures', async () => {
  const now = 1_800_000_000;
  const validToken = signTestJwt({
    iss: 'https://accounts.google.com',
    aud: 'test-client-id.apps.googleusercontent.com',
    sub: 'google-user-12345',
    email: 'victim@gmail.com',
    email_verified: true,
    iat: now - 10,
    exp: now + 3600,
  });

  const [headerSeg, , sigSeg] = validToken.split('.');
  const forgedPayloadSeg = Buffer.from(
    JSON.stringify({
      iss: 'https://accounts.google.com',
      aud: 'test-client-id.apps.googleusercontent.com',
      sub: 'attacker-999',
      email: 'admin@chapterready.in',
      email_verified: true,
      iat: now - 10,
      exp: now + 3600,
    }),
    'utf8',
  ).toString('base64url');

  await assert.rejects(
    () =>
      verifyGoogleIdToken(`${headerSeg}.${forgedPayloadSeg}.${sigSeg}`, {
        allowedClientIds: ['test-client-id.apps.googleusercontent.com'],
        jwksFetcher: async () => [testJwk],
        nowSeconds: now,
      }),
    GoogleAuthTokenError,
  );
});

test('verifyGoogleIdToken rejects wrong audience, expired tokens, unverified email, and unconfigured server', async () => {
  const now = 1_800_000_000;

  // Missing client ID config
  await assert.rejects(
    () =>
      verifyGoogleIdToken('a.b.c', {
        allowedClientIds: [],
        jwksFetcher: async () => [testJwk],
        nowSeconds: now,
      }),
    GoogleAuthConfigError,
  );

  // Wrong audience
  const wrongAudToken = signTestJwt({
    iss: 'https://accounts.google.com',
    aud: 'some-other-app.apps.googleusercontent.com',
    sub: 'u1',
    email: 'student@gmail.com',
    email_verified: true,
    iat: now - 10,
    exp: now + 3600,
  });
  await assert.rejects(
    () =>
      verifyGoogleIdToken(wrongAudToken, {
        allowedClientIds: ['expected-client.apps.googleusercontent.com'],
        jwksFetcher: async () => [testJwk],
        nowSeconds: now,
      }),
    /client ID mismatch/i,
  );

  // Expired token
  const expiredToken = signTestJwt({
    iss: 'https://accounts.google.com',
    aud: 'expected-client.apps.googleusercontent.com',
    sub: 'u1',
    email: 'student@gmail.com',
    email_verified: true,
    iat: now - 7200,
    exp: now - 600,
  });
  await assert.rejects(
    () =>
      verifyGoogleIdToken(expiredToken, {
        allowedClientIds: ['expected-client.apps.googleusercontent.com'],
        jwksFetcher: async () => [testJwk],
        nowSeconds: now,
      }),
    /expired/i,
  );

  // Unverified email
  const unverifiedEmailToken = signTestJwt({
    iss: 'https://accounts.google.com',
    aud: 'expected-client.apps.googleusercontent.com',
    sub: 'u1',
    email: 'student@gmail.com',
    email_verified: false,
    iat: now - 10,
    exp: now + 3600,
  });
  await assert.rejects(
    () =>
      verifyGoogleIdToken(unverifiedEmailToken, {
        allowedClientIds: ['expected-client.apps.googleusercontent.com'],
        jwksFetcher: async () => [testJwk],
        nowSeconds: now,
      }),
    /verified Google email/i,
  );
});

test('deriveStudentFullName and getConfiguredGoogleClientIds handle fallbacks cleanly', () => {
  assert.equal(deriveStudentFullName('  Diya Verma ', undefined, 'diya@gmail.com'), 'Diya Verma');
  assert.equal(deriveStudentFullName('', 'Rohan', 'rohan99@gmail.com'), 'Rohan');
  assert.equal(
    deriveStudentFullName(undefined, undefined, 'ananya.kapoor2011@gmail.com'),
    'Ananya Kapoor',
  );

  const ids = getConfiguredGoogleClientIds({
    GOOGLE_CLIENT_ID: 'web-id.apps.googleusercontent.com, android-id.apps.googleusercontent.com',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'web-id.apps.googleusercontent.com',
  });
  assert.deepEqual(ids, [
    'web-id.apps.googleusercontent.com',
    'android-id.apps.googleusercontent.com',
  ]);
});

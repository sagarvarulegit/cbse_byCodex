import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import type { UserRole } from '@prisma/client';

const scrypt = promisify(scryptCallback);
const PASSWORD_KEY_LENGTH = 64;

type SessionTokenPayloadInput = {
  role: UserRole;
  userId: string;
  fullName?: string;
  classLevel?: number;
  email?: string | null;
  phone?: string | null;
};

export type SessionTokenPayload = SessionTokenPayloadInput & {
  exp: number;
};

function signValue(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString('base64url')}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, encodedHash] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !encodedHash) {
    return false;
  }

  const actualHash = Buffer.from(encodedHash, 'base64url');
  const derivedKey = (await scrypt(password, salt, actualHash.length)) as Buffer;

  if (derivedKey.length !== actualHash.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, actualHash);
}

export function createSessionToken(payload: SessionTokenPayloadInput, secret: string, expiresInSeconds: number) {
  const tokenPayload: SessionTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function readSessionToken(token: string, secret: string): SessionTokenPayload | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload, secret);
  const actualSignature = Buffer.from(signature, 'utf8');
  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf8');

  if (actualSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(actualSignature, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionTokenPayload;
    if (
      typeof parsedPayload.userId !== 'string' ||
      typeof parsedPayload.role !== 'string' ||
      typeof parsedPayload.exp !== 'number'
    ) {
      return null;
    }

    if (parsedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}

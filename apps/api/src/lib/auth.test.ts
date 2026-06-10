import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createSessionToken,
  hashPassword,
  readSessionToken,
  verifyPassword,
} from './auth.js';

test('hashPassword creates a verifiable password hash', async () => {
  const hashed = await hashPassword('Topper@123');

  assert.notEqual(hashed, 'Topper@123');
  assert.equal(await verifyPassword('Topper@123', hashed), true);
});

test('verifyPassword rejects the wrong password', async () => {
  const hashed = await hashPassword('Topper@123');

  assert.equal(await verifyPassword('Wrong@123', hashed), false);
});

test('createSessionToken signs a payload that readSessionToken can recover', () => {
  const token = createSessionToken(
    {
      userId: 'user_123',
      role: 'student',
    },
    'secret-key',
    60,
  );

  assert.deepEqual(readSessionToken(token, 'secret-key'), {
    exp: readSessionToken(token, 'secret-key')?.exp,
    role: 'student',
    userId: 'user_123',
  });
});

test('readSessionToken rejects tampered tokens', () => {
  const token = createSessionToken(
    {
      userId: 'user_123',
      role: 'student',
    },
    'secret-key',
    60,
  );

  const parts = token.split('.');
  parts[0] = Buffer.from(JSON.stringify({ userId: 'admin_1', role: 'admin', exp: 9999999999 })).toString(
    'base64url',
  );

  assert.equal(readSessionToken(parts.join('.'), 'secret-key'), null);
});

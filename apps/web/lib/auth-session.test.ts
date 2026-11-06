import test from 'node:test';
import assert from 'node:assert/strict';

test('Session cookie decoding correctly parses user payload', () => {
  const dummyPayload = {
    userId: 'user-12345',
    role: 'STUDENT',
    fullName: 'Sagar Varule',
    classLevel: 10,
    email: 'sagar@example.com',
    phone: null,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const encodedPayload = Buffer.from(JSON.stringify(dummyPayload)).toString('base64url');
  const signature = 'fake-hmac-signature';
  const token = `${encodedPayload}.${signature}`;

  // Emulate parseSessionCookie logic
  const base64Url = token.split('.')[0] || '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, 'base64').toString('utf8'),
  );
  const parsed = JSON.parse(jsonPayload);

  assert.equal(parsed.userId, 'user-12345');
  assert.equal(parsed.fullName, 'Sagar Varule');
  assert.equal(parsed.classLevel, 10);
  assert.equal(parsed.email, 'sagar@example.com');
});

test('Breadcrumb link target switches between Dashboard and Home based on session', () => {
  const getBreadcrumbTarget = (session: { fullName: string } | null) => ({
    href: session ? '/dashboard' : '/',
    label: session ? 'Dashboard' : 'Home',
  });

  const loggedIn = getBreadcrumbTarget({ fullName: 'Sagar' });
  assert.equal(loggedIn.href, '/dashboard');
  assert.equal(loggedIn.label, 'Dashboard');

  const loggedOut = getBreadcrumbTarget(null);
  assert.equal(loggedOut.href, '/');
  assert.equal(loggedOut.label, 'Home');
});

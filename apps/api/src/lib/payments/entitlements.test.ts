import assert from 'node:assert/strict';
import { test } from 'node:test';

import { checkMockPaperAccess } from './entitlements.js';

test('checkMockPaperAccess allows Paper 1 as free sample for everyone', async () => {
  const resultGuest = await checkMockPaperAccess({
    userId: null,
    subjectSlug: 'mathematics-standard',
    paperNumber: 1,
  });
  assert.equal(resultGuest.isUnlocked, true);
  assert.equal(resultGuest.isFreeSample, true);

  const resultUser = await checkMockPaperAccess({
    userId: 'user_123',
    subjectSlug: 'science',
    paperNumber: 1,
  });
  assert.equal(resultUser.isUnlocked, true);
  assert.equal(resultUser.isFreeSample, true);
});

test('checkMockPaperAccess blocks Papers 2..5 for unauthenticated guests', async () => {
  const result = await checkMockPaperAccess({
    userId: null,
    subjectSlug: 'mathematics-standard',
    paperNumber: 2,
  });
  assert.equal(result.isUnlocked, false);
  assert.equal(result.isFreeSample, false);
  assert.ok(result.reason?.includes('Sign in'));
});

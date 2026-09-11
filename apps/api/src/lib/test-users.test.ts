import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getTestUserEmails, isTestUserEmail } from './test-users.js';

test('getTestUserEmails parses comma-separated allowlist', () => {
  process.env.TEST_USER_EMAILS = ' TestUser@ChapterReady.in ,qa@example.com,,';
  assert.deepEqual(getTestUserEmails(), ['testuser@chapterready.in', 'qa@example.com']);
  delete process.env.TEST_USER_EMAILS;
});

test('getTestUserEmails is empty when unconfigured', () => {
  delete process.env.TEST_USER_EMAILS;
  assert.deepEqual(getTestUserEmails(), []);
});

test('isTestUserEmail matches case-insensitively', () => {
  process.env.TEST_USER_EMAILS = 'testuser@chapterready.in';
  try {
    assert.equal(isTestUserEmail('TestUser@ChapterReady.in'), true);
    assert.equal(isTestUserEmail('other@example.com'), false);
    assert.equal(isTestUserEmail(null), false);
    assert.equal(isTestUserEmail(undefined), false);
  } finally {
    delete process.env.TEST_USER_EMAILS;
  }
});

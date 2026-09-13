import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_POST_AUTH_PATH, getSafeNextPath } from './auth-redirect';

test('Safe next path keeps drill anchors and chapter URLs', () => {
  assert.equal(
    getSafeNextPath('/chapters/life-processes/notes#board-exam-drill'),
    '/chapters/life-processes/notes#board-exam-drill',
  );
  assert.equal(getSafeNextPath('/dashboard'), '/dashboard');
  assert.equal(getSafeNextPath('/chapters/heredity/quiz?mode=timed'), '/chapters/heredity/quiz?mode=timed');
});

test('Safe next path falls back for missing or external destinations', () => {
  assert.equal(getSafeNextPath(null), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath(''), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('https://evil.example/phish'), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('//evil.example/phish'), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('/\\evil.example'), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('/dashboard\\evil'), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('javascript:alert(1)'), DEFAULT_POST_AUTH_PATH);
  assert.equal(getSafeNextPath('/notes with space'), DEFAULT_POST_AUTH_PATH);
});

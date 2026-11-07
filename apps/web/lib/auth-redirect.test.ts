import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_POST_AUTH_PATH,
  DEFAULT_POST_SIGNUP_PATH,
  getSafeNextPath,
  getSafePostSignupPath,
} from './auth-redirect';

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

test('Post-signup path re-routes previous flow from notes to Quick Win Choice Screen / Chapter Hub', () => {
  // Missing or empty redirects land on Real Numbers chapter hub
  assert.equal(getSafePostSignupPath(null), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath(''), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath('/dashboard'), DEFAULT_POST_SIGNUP_PATH);

  // The previous flow: Signup -> /chapters/real-numbers/notes re-routes to /chapters/real-numbers
  assert.equal(
    getSafePostSignupPath('/chapters/real-numbers/notes'),
    DEFAULT_POST_SIGNUP_PATH,
  );

  // Any other chapter notes link re-routes to its chapter hub
  assert.equal(
    getSafePostSignupPath('/chapters/chemical-reactions-and-equations/notes'),
    '/chapters/chemical-reactions-and-equations',
  );

  // Specific explicit hubs or exam papers remain intact
  assert.equal(getSafePostSignupPath('/chapters/real-numbers'), '/chapters/real-numbers');
  assert.equal(getSafePostSignupPath('/exam-papers'), '/exam-papers');

  // Dangerous or malicious links fall back safely to DEFAULT_POST_SIGNUP_PATH
  assert.equal(getSafePostSignupPath('https://evil.example/phish'), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath('//evil.example/phish'), DEFAULT_POST_SIGNUP_PATH);
});

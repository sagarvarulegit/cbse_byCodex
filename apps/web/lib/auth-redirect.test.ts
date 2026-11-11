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

test('Post-signup path routes new registrations to the Dashboard Welcome Choice Modal unless an explicit tool/chapter was requested', () => {
  assert.equal(DEFAULT_POST_SIGNUP_PATH, '/dashboard?welcome=1');

  // Missing or empty redirects land on /dashboard?welcome=1
  assert.equal(getSafePostSignupPath(null), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath(''), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath('/dashboard'), DEFAULT_POST_SIGNUP_PATH);

  // Legacy Chapter 1 (Real Numbers) redirects re-route to /dashboard?welcome=1
  assert.equal(
    getSafePostSignupPath('/chapters/real-numbers/notes'),
    DEFAULT_POST_SIGNUP_PATH,
  );
  assert.equal(
    getSafePostSignupPath('/chapters/real-numbers'),
    DEFAULT_POST_SIGNUP_PATH,
  );

  // Any other chapter notes link re-routes to its chapter hub
  assert.equal(
    getSafePostSignupPath('/chapters/chemical-reactions-and-equations/notes'),
    '/chapters/chemical-reactions-and-equations',
  );

  // Specific explicit high-value tools or exam papers remain intact
  assert.equal(getSafePostSignupPath('/tools'), '/tools');
  assert.equal(getSafePostSignupPath('/formula-cheatsheets'), '/formula-cheatsheets');
  assert.equal(getSafePostSignupPath('/pyq-trends'), '/pyq-trends');
  assert.equal(getSafePostSignupPath('/exam-papers'), '/exam-papers');

  // Dangerous or malicious links fall back safely to DEFAULT_POST_SIGNUP_PATH
  assert.equal(getSafePostSignupPath('https://evil.example/phish'), DEFAULT_POST_SIGNUP_PATH);
  assert.equal(getSafePostSignupPath('//evil.example/phish'), DEFAULT_POST_SIGNUP_PATH);
});

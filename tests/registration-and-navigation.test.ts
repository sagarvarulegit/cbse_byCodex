import assert from 'node:assert/strict';
import test from 'node:test';

import { getChapterHomeHref } from '../apps/web/lib/student-navigation.ts';
import { normalizeRegistrationClassLevel, PILOT_CLASS_LEVEL } from '../apps/api/src/lib/registration.ts';

test('normalizeRegistrationClassLevel accepts the current pilot class', () => {
  assert.deepEqual(normalizeRegistrationClassLevel(String(PILOT_CLASS_LEVEL)), {
    classLevel: PILOT_CLASS_LEVEL,
    error: null,
  });
});

test('normalizeRegistrationClassLevel rejects a missing class selection', () => {
  assert.deepEqual(normalizeRegistrationClassLevel(''), {
    classLevel: null,
    error: 'Please choose your class to continue.',
  });
});

test('normalizeRegistrationClassLevel rejects unsupported classes before the wider rollout', () => {
  assert.deepEqual(normalizeRegistrationClassLevel('9'), {
    classLevel: null,
    error: 'Class 10 registrations are live right now. Classes 1 to 9 are coming soon.',
  });
});

test('getChapterHomeHref sends signed-in students to the dashboard', () => {
  assert.equal(getChapterHomeHref(true), '/dashboard');
});

test('getChapterHomeHref keeps anonymous visitors on the portal home page', () => {
  assert.equal(getChapterHomeHref(false), '/');
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeGuardianConsent,
  PILOT_PRIVACY_NOTICE_VERSION,
} from './guardian-consent.js';

test('normalizes a complete self-attested pilot guardian consent', () => {
  const result = normalizeGuardianConsent({
    adultConfirmed: true,
    consentConfirmed: true,
    guardianEmail: ' Parent@Example.com ',
    guardianFullName: '  Pilot   Parent  ',
    policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
    relationship: 'parent',
  });

  assert.deepEqual(result, {
    data: {
      guardianEmail: 'parent@example.com',
      guardianFullName: 'Pilot Parent',
      policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
      relationship: 'parent',
      verificationStatus: 'self_attested',
    },
    error: null,
  });
});

test('rejects missing guardian confirmation or a stale notice version', () => {
  const missingConfirmation = normalizeGuardianConsent({
    adultConfirmed: true,
    consentConfirmed: false,
    guardianEmail: 'parent@example.com',
    guardianFullName: 'Pilot Parent',
    policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
    relationship: 'parent',
  });
  const staleNotice = normalizeGuardianConsent({
    adultConfirmed: true,
    consentConfirmed: true,
    guardianEmail: 'parent@example.com',
    guardianFullName: 'Pilot Parent',
    policyVersion: '2026-01-01',
    relationship: 'lawful_guardian',
  });

  assert.equal(missingConfirmation.data, null);
  assert.match(missingConfirmation.error, /confirm adulthood, consent/i);
  assert.equal(staleNotice.data, null);
  assert.match(staleNotice.error, /current privacy notice/i);
});

test('rejects malformed guardian identity fields', () => {
  const invalidEmail = normalizeGuardianConsent({
    adultConfirmed: true,
    consentConfirmed: true,
    guardianEmail: 'not-an-email',
    guardianFullName: 'Pilot Parent',
    policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
    relationship: 'parent',
  });

  assert.equal(invalidEmail.data, null);
  assert.match(invalidEmail.error, /valid guardian email/i);
});

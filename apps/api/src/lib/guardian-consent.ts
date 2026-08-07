export const PILOT_PRIVACY_NOTICE_VERSION = '2026-08-04';

export const GUARDIAN_RELATIONSHIPS = ['parent', 'lawful_guardian'] as const;

export type GuardianRelationship = (typeof GUARDIAN_RELATIONSHIPS)[number];

export type NormalizedGuardianConsent = {
  guardianEmail: string;
  guardianFullName: string;
  policyVersion: string;
  relationship: GuardianRelationship;
  verificationStatus: 'self_attested';
};

type NormalizeGuardianConsentResult =
  | { data: NormalizedGuardianConsent; error: null }
  | { data: null; error: string };

function normalizeName(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length >= 2 && normalized.length <= 120 ? normalized : null;
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (
    !normalized ||
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    return null;
  }

  return normalized;
}

function normalizeRelationship(value: unknown): GuardianRelationship | null {
  return GUARDIAN_RELATIONSHIPS.includes(value as GuardianRelationship)
    ? (value as GuardianRelationship)
    : null;
}

export function normalizeGuardianConsent(
  value: unknown,
): NormalizeGuardianConsentResult {
  const body =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  if (!body) {
    return {
      data: null,
      error: 'A parent or lawful guardian must complete the consent section.',
    };
  }

  const guardianFullName = normalizeName(body.guardianFullName);
  const guardianEmail = normalizeEmail(body.guardianEmail);
  const relationship = normalizeRelationship(body.relationship);
  const adultConfirmed = body.adultConfirmed === true;
  const consentConfirmed = body.consentConfirmed === true;
  const policyVersionAccepted =
    body.policyVersion === PILOT_PRIVACY_NOTICE_VERSION;

  if (!guardianFullName) {
    return {
      data: null,
      error: 'Guardian name must be between 2 and 120 characters.',
    };
  }

  if (!guardianEmail) {
    return { data: null, error: 'A valid guardian email is required.' };
  }

  if (!relationship) {
    return {
      data: null,
      error: 'Choose parent or lawful guardian as the relationship.',
    };
  }

  if (!adultConfirmed || !consentConfirmed || !policyVersionAccepted) {
    return {
      data: null,
      error:
        'The guardian must confirm adulthood, consent, and the current privacy notice.',
    };
  }

  return {
    data: {
      guardianEmail,
      guardianFullName,
      policyVersion: PILOT_PRIVACY_NOTICE_VERSION,
      relationship,
      verificationStatus: 'self_attested',
    },
    error: null,
  };
}

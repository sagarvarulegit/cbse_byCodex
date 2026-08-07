export const PILOT_PRIVACY_NOTICE_VERSION = '2026-08-04';

export function getPrivacyContactEmail() {
  const email = process.env.PRIVACY_CONTACT_EMAIL?.trim();
  return email || null;
}

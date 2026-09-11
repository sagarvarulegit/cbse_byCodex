/**
 * Test-user bypass.
 *
 * Full-access accounts used for manual QA of the whole platform without
 * buying anything. Membership is driven by the TEST_USER_EMAILS environment
 * variable (comma-separated, case-insensitive), so the bypass only exists
 * where it is explicitly configured and can be revoked by clearing the var.
 */
export function getTestUserEmails(): string[] {
  return (process.env.TEST_USER_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

export function isTestUserEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return getTestUserEmails().includes(email.trim().toLowerCase());
}

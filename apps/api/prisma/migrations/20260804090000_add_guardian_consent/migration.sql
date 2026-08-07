-- Record the guardian attestation used by the controlled Class 10 pilot.
-- The status is deliberately self_attested; identity verification is a later compliance gate.

CREATE TABLE "GuardianConsent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "guardianFullName" TEXT NOT NULL,
  "guardianEmail" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "policyVersion" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL DEFAULT 'self_attested',
  "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "GuardianConsent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GuardianConsent_userId_key" ON "GuardianConsent"("userId");
CREATE INDEX "GuardianConsent_policyVersion_consentedAt_idx" ON "GuardianConsent"("policyVersion", "consentedAt");

ALTER TABLE "GuardianConsent"
ADD CONSTRAINT "GuardianConsent_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Guardian consent for minor students (KR PIPA / IN DPDP §9).

CREATE TYPE "GuardianConsentMethod" AS ENUM ('KR_PASS', 'KR_EMAIL_OTP', 'IN_EMAIL_OTP');
CREATE TYPE "GuardianConsentStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED');

ALTER TABLE "User" ADD COLUMN "birthDate" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "guardianConsentVerifiedAt" TIMESTAMP(3);

CREATE TABLE "GuardianConsentRequest" (
    "id" TEXT NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "method" "GuardianConsentMethod" NOT NULL,
    "status" "GuardianConsentStatus" NOT NULL DEFAULT 'PENDING',
    "parentName" TEXT,
    "parentEmail" TEXT,
    "parentPhone" TEXT,
    "policyVersion" TEXT NOT NULL,
    "providerRef" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "requestIp" TEXT,
    "requestUa" TEXT,
    "verifyIp" TEXT,
    "verifyUa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardianConsentRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuardianConsentToken" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuardianConsentToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GuardianConsentRequest_studentUserId_key" ON "GuardianConsentRequest"("studentUserId");
CREATE INDEX "GuardianConsentRequest_status_createdAt_idx" ON "GuardianConsentRequest"("status", "createdAt");
CREATE UNIQUE INDEX "GuardianConsentToken_tokenHash_key" ON "GuardianConsentToken"("tokenHash");
CREATE INDEX "GuardianConsentToken_requestId_expiresAt_idx" ON "GuardianConsentToken"("requestId", "expiresAt");

ALTER TABLE "GuardianConsentRequest" ADD CONSTRAINT "GuardianConsentRequest_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuardianConsentToken" ADD CONSTRAINT "GuardianConsentToken_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "GuardianConsentRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Parent-child link approval flow (P0 security fix)

CREATE TYPE "ParentLinkStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED');

ALTER TYPE "SecurityEventType" ADD VALUE 'PARENT_LINK_REQUESTED';
ALTER TYPE "SecurityEventType" ADD VALUE 'PARENT_LINK_APPROVED';
ALTER TYPE "SecurityEventType" ADD VALUE 'PARENT_LINK_REJECTED';
ALTER TYPE "SecurityEventType" ADD VALUE 'PARENT_LINK_REVOKED';

CREATE TABLE "ParentChildLink" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT NOT NULL,
    "childUserId" TEXT NOT NULL,
    "status" "ParentLinkStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentChildLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ParentLinkApprovalToken" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentLinkApprovalToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ParentChildLink_parentUserId_childUserId_key" ON "ParentChildLink"("parentUserId", "childUserId");
CREATE INDEX "ParentChildLink_childUserId_status_idx" ON "ParentChildLink"("childUserId", "status");
CREATE INDEX "ParentChildLink_parentUserId_status_idx" ON "ParentChildLink"("parentUserId", "status");

CREATE UNIQUE INDEX "ParentLinkApprovalToken_tokenHash_key" ON "ParentLinkApprovalToken"("tokenHash");
CREATE INDEX "ParentLinkApprovalToken_linkId_expiresAt_idx" ON "ParentLinkApprovalToken"("linkId", "expiresAt");

ALTER TABLE "ParentChildLink" ADD CONSTRAINT "ParentChildLink_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentChildLink" ADD CONSTRAINT "ParentChildLink_childUserId_fkey" FOREIGN KEY ("childUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentLinkApprovalToken" ADD CONSTRAINT "ParentLinkApprovalToken_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "ParentChildLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Grandfather existing direct parent→child mappings as already approved.
INSERT INTO "ParentChildLink" ("id", "parentUserId", "childUserId", "status", "approvedAt", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    p."id",
    p."childOfUserId",
    'APPROVED'::"ParentLinkStatus",
    NOW(),
    NOW(),
    NOW()
FROM "User" p
WHERE p."role" = 'PARENT'
  AND p."childOfUserId" IS NOT NULL
ON CONFLICT ("parentUserId", "childUserId") DO NOTHING;
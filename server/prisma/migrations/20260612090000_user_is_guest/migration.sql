-- Try-first guest accounts (zero-PII). Cleared on /auth/guest/upgrade.
ALTER TABLE "User" ADD COLUMN "isGuest" BOOLEAN NOT NULL DEFAULT false;

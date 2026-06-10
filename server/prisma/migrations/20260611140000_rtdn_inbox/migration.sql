-- Wave 2: durable RTDN inbox (replaces Redis-only idempotency as source of truth)
CREATE TYPE "RtdnInboxStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'RETRYABLE', 'ORPHAN', 'DEAD');

CREATE TABLE "RtdnInbox" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "status" "RtdnInboxStatus" NOT NULL DEFAULT 'RECEIVED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "payloadHash" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "notificationKind" TEXT,
    "purchaseToken" TEXT,
    "lastError" TEXT,
    "leaseUntil" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RtdnInbox_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RtdnInbox_messageId_key" ON "RtdnInbox"("messageId");
CREATE INDEX "RtdnInbox_status_receivedAt_idx" ON "RtdnInbox"("status", "receivedAt");
CREATE INDEX "RtdnInbox_purchaseToken_idx" ON "RtdnInbox"("purchaseToken");
CREATE INDEX "RtdnInbox_status_leaseUntil_idx" ON "RtdnInbox"("status", "leaseUntil");
CREATE INDEX "Subscription_orderId_idx" ON "Subscription"("orderId");
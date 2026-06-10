-- Wave 1: server acknowledge tracking + linked purchase token (separate from orderId)
ALTER TABLE "Subscription" ADD COLUMN "linkedPurchaseToken" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "acknowledgedAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "acknowledgementState" TEXT;
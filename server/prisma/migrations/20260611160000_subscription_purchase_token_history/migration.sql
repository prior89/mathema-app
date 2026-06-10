-- Wave 3: purchase token history for upgrade/downgrade RTDN resolution
CREATE TABLE "SubscriptionPurchaseToken" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "purchaseToken" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "linkedFromToken" TEXT,
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPurchaseToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SubscriptionPurchaseToken_purchaseToken_key" ON "SubscriptionPurchaseToken"("purchaseToken");
CREATE INDEX "SubscriptionPurchaseToken_subscriptionId_idx" ON "SubscriptionPurchaseToken"("subscriptionId");
CREATE INDEX "SubscriptionPurchaseToken_linkedFromToken_idx" ON "SubscriptionPurchaseToken"("linkedFromToken");

ALTER TABLE "SubscriptionPurchaseToken" ADD CONSTRAINT "SubscriptionPurchaseToken_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
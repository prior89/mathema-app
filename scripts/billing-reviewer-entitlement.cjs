'use strict';

const { PrismaClient } = require('@prisma/client');

const REVIEW_PRODUCT_ID = 'premium_review';
const REVIEW_EXPIRY = new Date('2035-01-01T00:00:00.000Z');

async function main() {
  const email = process.env.REVIEWER_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error('REVIEWER_EMAIL is required');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) throw new Error('Reviewer user was not found');

    const existing = await prisma.subscription.findUnique({ where: { userId: user.id } });
    if (existing && existing.productId !== REVIEW_PRODUCT_ID) {
      throw new Error(
        `Refusing to replace a non-review subscription (${existing.productId}) on the reviewer account`,
      );
    }

    const now = new Date();
    const subscription = await prisma.$transaction(async (tx) => {
      const row = await tx.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          productId: REVIEW_PRODUCT_ID,
          purchaseToken: `review:${user.id}`,
          status: 'ACTIVE',
          startTime: now,
          expiryTime: REVIEW_EXPIRY,
          autoRenewing: false,
          acknowledgedAt: now,
          acknowledgementState: 'ACKNOWLEDGED',
        },
        update: {
          status: 'ACTIVE',
          expiryTime: REVIEW_EXPIRY,
          autoRenewing: false,
          acknowledgedAt: now,
          acknowledgementState: 'ACKNOWLEDGED',
        },
      });

      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: row.id,
          eventType: 'review.entitlement.upsert',
          payload: {
            productId: REVIEW_PRODUCT_ID,
            expiryTime: REVIEW_EXPIRY.toISOString(),
            purpose: 'google_play_review',
          },
        },
      });
      return row;
    });

    process.stdout.write(
      JSON.stringify({
        ok: true,
        productId: subscription.productId,
        status: subscription.status,
        expiryTime: subscription.expiryTime.toISOString(),
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

'use strict';

const { PrismaClient } = require('@prisma/client');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const prisma = new PrismaClient();
  try {
    const [count, grouped, latest] = await Promise.all([
      prisma.rtdnInbox.count(),
      prisma.rtdnInbox.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.rtdnInbox.findMany({
        orderBy: { receivedAt: 'desc' },
        take: 5,
        select: {
          status: true,
          notificationKind: true,
          attempts: true,
          receivedAt: true,
          processedAt: true,
          lastError: true,
        },
      }),
    ]);

    process.stdout.write(
      JSON.stringify({
        count,
        statuses: Object.fromEntries(grouped.map((row) => [row.status, row._count._all])),
        latest,
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

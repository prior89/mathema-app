import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const total = await prisma.problem.count();
  const mismatch = await prisma.problem.count({ where: { conceptMismatch: true } });
  const mismatchByStatus = await prisma.problem.groupBy({
    by: ['qualityStatus'],
    where: { conceptMismatch: true },
    _count: true,
  });
  console.log(`Total problems: ${total}`);
  console.log(`conceptMismatch=true: ${mismatch}`);
  console.log('Breakdown by qualityStatus:');
  for (const row of mismatchByStatus) {
    console.log(`  ${row.qualityStatus ?? 'NULL'}: ${row._count}`);
  }
  await prisma.$disconnect();
})();

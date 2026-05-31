import { PrismaClient } from '@prisma/client';
(async () => {
  const p = new PrismaClient();
  const users = await p.user.findMany({
    where: { country: 'KR' },
    select: { id: true, email: true, name: true, gradeLevel: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  console.log(`KR users: ${users.length}`);
  for (const u of users) {
    const cnt = await p.attempt.count({
      where: { userId: u.id, context: { in: ['STUDY', 'PRACTICE'] } },
    });
    const krCnt = await p.attempt.count({
      where: {
        userId: u.id,
        context: { in: ['STUDY', 'PRACTICE'] },
        problem: { koreanConceptLessonId: { not: null } },
      },
    });
    console.log(
      `  ${u.email.padEnd(40)} ${u.name?.padEnd(12) ?? ''} grade=${u.gradeLevel ?? '-'}  attempts=${cnt}  KR=${krCnt}  created=${u.createdAt.toISOString().slice(0, 10)}`,
    );
  }
  await p.$disconnect();
})();

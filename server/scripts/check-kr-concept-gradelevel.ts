import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const total = await prisma.concept.count();
  const withGrade = await prisma.concept.count({ where: { gradeLevel: { not: null } } });
  console.log(`Concept total: ${total}, with gradeLevel: ${withGrade}`);

  const grades = await prisma.concept.findMany({
    where: { gradeLevel: { not: null } },
    select: { gradeLevel: true },
    distinct: ['gradeLevel'],
  });
  console.log('gradeLevel values:', grades.map((g) => g.gradeLevel));

  // Sample first 3 concepts at each KR grade if any
  for (const lvl of grades.map((g) => g.gradeLevel)) {
    const sample = await prisma.concept.findMany({
      where: { gradeLevel: lvl as any },
      select: { code: true, name: true },
      take: 3,
      orderBy: { code: 'asc' },
    });
    console.log(`  ${lvl}: ${sample.map((s) => s.code).join(', ')}`);
  }
  await prisma.$disconnect();
})();

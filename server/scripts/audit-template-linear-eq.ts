import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const all = await prisma.problem.findMany({
    where: { source: { startsWith: 'template:linear-eq:v1' } },
    select: {
      id: true, source: true, body: true, qualityStatus: true, answer: true,
      steps: { select: { choices: { select: { text: true, isCorrect: true, distractorErrorCode: true } } } },
    },
  });
  console.log(`Template rows in DB: ${all.length}`);
  let bad = 0;
  let approvedCount = 0;
  for (const r of all) {
    const correctCount = r.steps[0]?.choices.filter((c) => c.isCorrect).length ?? 0;
    if (correctCount !== 1) bad++;
    if (r.qualityStatus === 'APPROVED') approvedCount++;
  }
  console.log(`Correct=1 rows: ${all.length - bad} / ${all.length}`);
  console.log(`qualityStatus=APPROVED: ${approvedCount}`);
  console.log('\nFirst 5 examples:');
  for (const r of all.slice(0, 5)) {
    console.log(`  ${r.source}`);
    console.log(`    body: ${r.body}`);
    console.log(`    answer: ${r.answer}`);
    const choices = r.steps[0]?.choices ?? [];
    for (const c of choices) {
      console.log(`      ${c.isCorrect ? '✓' : '✗'} ${c.text}  ${c.distractorErrorCode ?? ''}`);
    }
  }
  await prisma.$disconnect();
})();

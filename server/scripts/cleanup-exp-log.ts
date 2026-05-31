import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const exp = await prisma.koreanConceptLesson.findUnique({ where: { chapterCode: 'K-G11-ALG-CH01-EXP-LOG' } });
  if (!exp) { console.log('EXP-LOG lesson missing'); return; }
  const probs = await prisma.problem.findMany({ where: { koreanConceptLessonId: exp.id }, select: { id: true } });
  if (probs.length === 0) { console.log('no problems to clean'); return; }
  const ids = probs.map((p) => p.id);
  await prisma.attempt.deleteMany({ where: { problemId: { in: ids } } });
  await prisma.wrongNote.deleteMany({ where: { problemId: { in: ids } } });
  const res = await prisma.problem.deleteMany({ where: { id: { in: ids } } });
  await prisma.koreanConceptLesson.update({
    where: { id: exp.id },
    data: { masterySetProblemIds: [], masterySetCuratedAt: null },
  });
  console.log('cleaned', res.count, 'EXP-LOG single-step problems');
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

/**
 * Inspect a single Korean problem's DB state (steps + choices + isCorrect).
 * Usage: npx ts-node --transpile-only scripts/inspect-kr-problem.ts <chapterCode> [problemIdx 1-based]
 */
import { PrismaClient } from '@prisma/client';

async function main() {
  const [code, idxStr] = process.argv.slice(2);
  if (!code) {
    console.error('Usage: inspect-kr-problem.ts <chapterCode> [problemIdx 1-based]');
    process.exit(1);
  }
  const idx = idxStr ? parseInt(idxStr, 10) : null;
  const prisma = new PrismaClient();

  const lesson = await prisma.koreanConceptLesson.findUnique({
    where: { chapterCode: code },
    select: { id: true, titleKo: true, masterySetProblemIds: true },
  });
  if (!lesson) { console.error(`No lesson for ${code}`); process.exit(1); }

  const problems = await prisma.problem.findMany({
    where: { koreanConceptLessonId: lesson.id, koreanConceptLessonId: { not: null } },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      body: true,
      concept: true,
      difficulty: true,
      steps: {
        orderBy: { stepIndex: 'asc' },
        select: {
          stepIndex: true,
          stepType: true,
          prompt: true,
          choices: {
            orderBy: { choiceIndex: 'asc' },
            select: { choiceIndex: true, text: true, isCorrect: true, distractorErrorCode: true },
          },
        },
      },
    },
  });
  // Filter to mastery 3-step pool only
  const mastery = problems.filter((p) => p.steps.length === 3);

  console.log(`\n${code} — ${lesson.titleKo}`);
  console.log(`Mastery problems in DB: ${mastery.length}\n`);
  console.log(`Mastery set order (from lesson.masterySetProblemIds):`);
  lesson.masterySetProblemIds.forEach((id, i) => {
    const p = mastery.find((q) => q.id === id);
    console.log(`  ${(i + 1).toString().padStart(2)}. ${id}  ${p ? p.concept : '(MISSING)'}  ${p ? p.body.slice(0, 60) : ''}`);
  });

  const target = idx ? lesson.masterySetProblemIds[idx - 1] : null;
  const targetProblems = target ? mastery.filter((p) => p.id === target) : mastery;

  for (const p of targetProblems) {
    console.log(`\n========================================`);
    console.log(`Problem id: ${p.id}`);
    console.log(`Concept: ${p.concept}  Difficulty: ${p.difficulty}`);
    console.log(`Body: ${p.body}`);
    for (const s of p.steps) {
      console.log(`\n  Step ${s.stepIndex} (${s.stepType}) — ${s.prompt}`);
      for (const c of s.choices) {
        const mark = c.isCorrect ? '✓' : ' ';
        console.log(`    ${mark} [#${c.choiceIndex}] ${c.text}${c.distractorErrorCode ? ` (${c.distractorErrorCode})` : ''}`);
      }
    }
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Skip masterySetProblemIds select because the column is missing from DB.
  const lesson = await prisma.conceptLesson.findFirst({
    where: { ncertClass: 'CLASS_11', chapterNumber: 4 },
    select: { id: true, chapterCode: true, titleEn: true },
  });
  if (!lesson) {
    console.log('No lesson for 11/4');
    return;
  }
  console.log(`Lesson: ${lesson.chapterCode} (${lesson.titleEn})  id=${lesson.id}`);

  const allMapped = await prisma.problem.count({ where: { conceptLessonId: lesson.id } });
  console.log(`Problems mapped to this lesson: ${allMapped}`);

  const poolMatch = await prisma.problem.count({
    where: {
      conceptLessonId: lesson.id,
      steps: { some: { stepIndex: 1 } },
      AND: [
        { steps: { some: { stepIndex: 2 } } },
        { steps: { some: { stepIndex: 3 } } },
      ],
    },
  });
  console.log(`Pool (all 3 steps present): ${poolMatch}`);

  console.log(`\nProblem matching screen body fragment:`);
  const screenProblems = await prisma.problem.findMany({
    where: {
      conceptLessonId: lesson.id,
      body: { contains: '\\frac{1}{5}+i \\frac{2}{5}' },
    },
    select: {
      id: true,
      source: true,
      body: true,
      steps: {
        select: {
          stepIndex: true,
          stepType: true,
          choices: { select: { choiceIndex: true, isCorrect: true, text: true } },
        },
      },
    },
  });
  console.log(`  Matches: ${screenProblems.length}`);
  for (const p of screenProblems) {
    console.log(`  --- id=${p.id} source="${p.source}"`);
    console.log(`  body: ${p.body.slice(0, 120)}`);
    for (const s of p.steps.sort((a, b) => a.stepIndex - b.stepIndex)) {
      const correctChoices = s.choices.filter((c) => c.isCorrect);
      console.log(
        `    step ${s.stepIndex} (${s.stepType}): ${s.choices.length} choices, correct=${correctChoices.length}` +
          (correctChoices.length === 1 ? ` → ${correctChoices[0].text.slice(0, 80)}` : correctChoices.length === 0 ? ' [NO ANSWER MARKED]' : ' [MULTIPLE marked correct]'),
      );
      for (const c of s.choices.sort((a, b) => a.choiceIndex - b.choiceIndex)) {
        console.log(`        ${String.fromCharCode(64 + c.choiceIndex)}${c.isCorrect ? '*' : ' '} ${c.text.slice(0, 90)}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const IDS = [
  '634bc62a-ef2b-4623-bc19-035e973c1b28', // cylinder volume + unit conversion
  '5217fe19-a067-4e6e-8125-6b0956e25a61', // trapezium area
  'd0a5f5b1-c052-49ef-bc8f-066cbc814e59', // unknown topic, "classic and clear"
  '19010845-2b24-4468-8f0c-fe3d587720f8', // adding rational numbers — easy to verify
  'f97980ae-ed84-44f2-ae73-da27e9eed2f3', // Bayes theorem
];

async function main() {
  const prisma = new PrismaClient();
  for (const id of IDS) {
    const p = await prisma.problem.findUnique({
      where: { id },
      include: {
        conceptLesson: {
          select: { ncertClass: true, chapterNumber: true, titleEn: true, chapterCode: true },
        },
        steps: {
          orderBy: { stepIndex: 'asc' },
          select: {
            stepIndex: true,
            stepType: true,
            prompt: true,
            choices: {
              orderBy: { choiceIndex: 'asc' },
              select: { choiceIndex: true, isCorrect: true, text: true },
            },
          },
        },
      },
    });
    if (!p) {
      console.log(`=== ${id} NOT FOUND ===\n`);
      continue;
    }
    console.log(`========================================`);
    console.log(`id: ${id}`);
    console.log(
      `chapter: ${p.conceptLesson?.chapterCode ?? '<unmapped>'} ${p.conceptLesson?.titleEn ?? ''}`,
    );
    console.log(`difficulty: ${p.difficulty} (level ${p.difficultyLevel})`);
    console.log(`answer field: ${p.answer}`);
    console.log(``);
    console.log(`### body`);
    console.log(p.body);
    console.log(``);
    for (const s of p.steps) {
      console.log(`### step ${s.stepIndex} (${s.stepType}) — ${s.prompt}`);
      for (const c of s.choices) {
        const marker = c.isCorrect ? '✓' : ' ';
        console.log(`  [${c.choiceIndex}] ${marker} ${c.text}`);
      }
      console.log('');
    }
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

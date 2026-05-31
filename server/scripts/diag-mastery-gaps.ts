import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.problem.count();
  console.log(`Total Problem rows: ${total}`);

  const lessons = await prisma.conceptLesson.findMany({
    where: { ncertClass: { in: ['CLASS_11', 'CLASS_12'] } },
    select: {
      id: true,
      ncertClass: true,
      chapterNumber: true,
      chapterCode: true,
      titleEn: true,
    },
    orderBy: [{ ncertClass: 'asc' }, { chapterNumber: 'asc' }],
  });

  type Row = {
    cls: string;
    ch: number;
    title: string;
    n: number;
    multiStep: number;
    emptyAnswer: number;
    noAnswerStepCorrect: number;
  };
  const rows: Row[] = [];

  for (const l of lessons) {
    const problems = await prisma.problem.findMany({
      where: { conceptLessonId: l.id },
      select: {
        id: true,
        answer: true,
        steps: {
          select: {
            stepIndex: true,
            stepType: true,
            choices: { select: { isCorrect: true } },
          },
        },
      },
    });
    const n = problems.length;
    let multiStep = 0;
    let emptyAnswer = 0;
    let noAnswerStepCorrect = 0;
    for (const p of problems) {
      const hasStep1 = p.steps.some((s) => s.stepIndex === 1);
      const hasStep2 = p.steps.some((s) => s.stepIndex === 2);
      const hasStep3 = p.steps.some((s) => s.stepIndex === 3);
      if (hasStep1 && hasStep2 && hasStep3) multiStep++;
      if (!p.answer || p.answer.trim() === '') emptyAnswer++;
      const answerStep =
        p.steps.find((s) => s.stepType === 'ANSWER') ??
        p.steps.find((s) => s.stepIndex === 3);
      if (!answerStep || !answerStep.choices.some((c) => c.isCorrect)) {
        noAnswerStepCorrect++;
      }
    }
    rows.push({
      cls: l.ncertClass,
      ch: l.chapterNumber,
      title: l.titleEn,
      n,
      multiStep,
      emptyAnswer,
      noAnswerStepCorrect,
    });
  }

  const header = ['Cls', 'Ch', 'Title', 'N', 'MultiStep', 'EmptyAns', 'NoCorrAns', 'EmptyPct', 'NoCorrPct'];
  console.log(header.join('\t'));
  for (const r of rows) {
    const emptyPct = r.n ? ((r.emptyAnswer / r.n) * 100).toFixed(1) : '0.0';
    const noCorrPct = r.n ? ((r.noAnswerStepCorrect / r.n) * 100).toFixed(1) : '0.0';
    console.log(
      [r.cls.replace('CLASS_', ''), r.ch, r.title, r.n, r.multiStep, r.emptyAnswer, r.noAnswerStepCorrect, `${emptyPct}%`, `${noCorrPct}%`].join('\t'),
    );
  }

  const shortlist = rows.filter((r) => r.n <= 20 || r.noAnswerStepCorrect / Math.max(1, r.n) >= 0.3 || r.emptyAnswer / Math.max(1, r.n) >= 0.3);
  console.log(`\nChapters failing Mastery gate (n<=20 OR null>=30%): ${shortlist.length}`);
  for (const r of shortlist) {
    const emptyPct = r.n ? ((r.emptyAnswer / r.n) * 100).toFixed(0) : '0';
    const noCorrPct = r.n ? ((r.noAnswerStepCorrect / r.n) * 100).toFixed(0) : '0';
    console.log(`  ${r.cls.replace('CLASS_', '')}/${r.ch} ${r.title}: n=${r.n} multiStep=${r.multiStep} emptyAns=${r.emptyAnswer}(${emptyPct}%) noCorrAns=${r.noAnswerStepCorrect}(${noCorrPct}%)`);
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

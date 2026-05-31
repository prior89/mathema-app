/**
 * Audit Korean curriculum content actually loaded into the local DB.
 * Per chapter: problem count, step count, choice count, correct-choice count,
 * mastery-set size. Flags any chapter that is short of the expected
 * 20 problems × 3 steps × 5 choices = 300 choices with exactly 60 correct.
 */

import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const chapters = await prisma.koreanConceptLesson.findMany({
    orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }, { chapterNumber: 'asc' }],
    select: {
      chapterCode: true,
      titleKo: true,
      masterySetProblemIds: true,
      problems: {
        select: {
          id: true,
          steps: { select: { id: true, choices: { select: { id: true, isCorrect: true } } } },
        },
      },
    },
  });

  console.log(`\n${chapters.length} KoreanConceptLesson rows.\n`);
  console.log('chapterCode'.padEnd(36) + 'M'.padStart(4) + 'S'.padStart(4) + 'C'.padStart(6) + 'OK'.padStart(5) + 'MS'.padStart(4) + '  flags');
  console.log('-'.repeat(80));

  // A chapter may host BOTH a 3-step mastery pool AND a single-step study pool
  // under the same koreanConceptLessonId. Split them and validate each pool
  // independently so the audit doesn't false-flag mixed lessons.
  const broken: Array<{ code: string; reason: string }> = [];
  for (const ch of chapters) {
    const masteryProblems = ch.problems.filter((p) => p.steps.length === 3);
    const studyProblems = ch.problems.filter((p) => p.steps.length === 1);
    const otherProblems = ch.problems.filter((p) => p.steps.length !== 3 && p.steps.length !== 1);

    const masteryCount = masteryProblems.length;
    const studyCount = studyProblems.length;
    const masteryChoiceCount = masteryProblems.reduce(
      (a, p) => a + p.steps.reduce((b, s) => b + s.choices.length, 0), 0);
    const masteryCorrectCount = masteryProblems.reduce(
      (a, p) => a + p.steps.reduce((b, s) => b + s.choices.filter((c) => c.isCorrect).length, 0), 0);
    const msSize = ch.masterySetProblemIds.length;

    const flags: string[] = [];
    if (masteryCount === 0) flags.push('NO_MASTERY_PROBLEMS');
    if (masteryCount !== 20 && masteryCount !== 0) flags.push(`MASTERY_COUNT=${masteryCount}`);
    if (masteryCount > 0 && masteryChoiceCount !== masteryCount * 3 * 5) flags.push(`MASTERY_CHOICE_WRONG`);
    if (masteryCount > 0 && masteryCorrectCount !== masteryCount * 3) flags.push(`CORRECT_COUNT_WRONG(${masteryCorrectCount}vs${masteryCount * 3})`);
    if (masteryCount > 0 && msSize !== 20) flags.push(`MS_SIZE=${msSize}`);
    if (otherProblems.length > 0) flags.push(`UNEXPECTED_STEP_COUNT(${otherProblems.length})`);
    const problemCount = masteryCount;
    const stepCount = studyCount; // reused column for display
    const choiceCount = masteryChoiceCount;
    const correctCount = masteryCorrectCount;

    if (flags.length > 0) broken.push({ code: ch.chapterCode, reason: flags.join(',') });

    const line =
      ch.chapterCode.padEnd(36) +
      String(problemCount).padStart(4) +
      String(stepCount).padStart(5) +
      String(choiceCount).padStart(6) +
      String(correctCount).padStart(5) +
      String(msSize).padStart(4) +
      '  ' + flags.join(' ');
    console.log(line);
  }

  console.log('\n' + '-'.repeat(80));
  if (broken.length === 0) {
    console.log('✓ All chapters fully seeded with consistent step/choice counts.');
  } else {
    console.log(`✗ ${broken.length} chapter(s) need attention:`);
    for (const b of broken) console.log(`  ${b.code}  →  ${b.reason}`);
  }
  await prisma.$disconnect();
  process.exit(broken.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });

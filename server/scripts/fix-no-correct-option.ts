/**
 * fix-no-correct-option.ts
 *
 * Repairs ProblemStep rows where no choice has isCorrect=true by matching
 * Problem.answer (and formula fallback) against choice text using the same
 * mathAnswersEqual rules as attempts.repository.
 *
 * Also strips NO_CORRECT_OPTION from qualityCriticalFlags when every step
 * ends up with exactly one correct choice.
 *
 * Usage:
 *   npx ts-node scripts/fix-no-correct-option.ts --dry-run
 *   npx ts-node scripts/fix-no-correct-option.ts --dry-run --limit 50
 *   npx ts-node scripts/fix-no-correct-option.ts --apply
 */

import { PrismaClient, QualityStatus } from '@prisma/client';
import { mathAnswersEqual } from '../src/common/utils/normalize-math-answer';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const apply = args.includes('--apply');
if (!dryRun && !apply) {
  console.error('Must pass --dry-run or --apply.');
  process.exit(2);
}
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : null;

const prisma = new PrismaClient();

type FixPlan = {
  problemId: string;
  chapterRef: string;
  stepId: string;
  stepIndex: number;
  choiceId: string;
  choiceText: string;
  answer: string;
};

function stripNoCorrectFlag(flags: string[]): string[] {
  return flags.filter((f) => f !== 'NO_CORRECT_OPTION');
}

function allStepsHaveOneCorrect(
  steps: { choices: { isCorrect: boolean }[] }[],
): boolean {
  return steps.every((s) => s.choices.filter((c) => c.isCorrect).length === 1);
}

async function main() {
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}\n`);

  const problems = await prisma.problem.findMany({
    where: {
      OR: [
        { qualityCriticalFlags: { has: 'NO_CORRECT_OPTION' } },
        {
          steps: {
            some: {
              choices: { none: { isCorrect: true } },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      answer: true,
      formula: true,
      qualityCriticalFlags: true,
      qualityStatus: true,
      conceptLesson: { select: { chapterCode: true } },
      koreanConceptLesson: { select: { chapterCode: true } },
      steps: {
        orderBy: { stepIndex: 'asc' },
        select: {
          id: true,
          stepIndex: true,
          stepType: true,
          choices: {
            orderBy: { choiceIndex: 'asc' },
            select: { id: true, text: true, isCorrect: true },
          },
        },
      },
    },
    ...(limit ? { take: limit } : {}),
  });

  console.log(`Candidate problems: ${problems.length}\n`);

  const plans: FixPlan[] = [];
  let skippedNoAnswer = 0;
  let skippedAmbiguous = 0;
  let skippedAlreadyOk = 0;

  for (const p of problems) {
    const chapterRef =
      p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? '(unmapped)';

    for (const step of p.steps) {
      const correctCount = step.choices.filter((c) => c.isCorrect).length;
      if (correctCount === 1) continue;
      if (correctCount > 1) continue;

      const expected =
        step.stepType === 'ANSWER' || step.stepIndex === p.steps.length
          ? p.answer
          : p.answer;
      if (!expected?.trim()) {
        skippedNoAnswer++;
        continue;
      }

      const matches = step.choices.filter(
        (c) =>
          mathAnswersEqual(expected, c.text) ||
          (p.formula ? mathAnswersEqual(p.formula, c.text) : false),
      );

      if (matches.length !== 1) {
        skippedAmbiguous++;
        continue;
      }

      plans.push({
        problemId: p.id,
        chapterRef,
        stepId: step.id,
        stepIndex: step.stepIndex,
        choiceId: matches[0].id,
        choiceText: matches[0].text.slice(0, 60),
        answer: expected.slice(0, 60),
      });
    }

    if (
      p.steps.every((s) => s.choices.filter((c) => c.isCorrect).length === 1) &&
      !p.qualityCriticalFlags.includes('NO_CORRECT_OPTION')
    ) {
      skippedAlreadyOk++;
    }
  }

  console.log(`Fixable step(s): ${plans.length}`);
  console.log(`Skipped — no answer: ${skippedNoAnswer}`);
  console.log(`Skipped — ambiguous/no match: ${skippedAmbiguous}`);
  console.log(`Already OK (no flag): ${skippedAlreadyOk}\n`);

  for (const plan of plans.slice(0, 30)) {
    console.log(
      `  [${plan.chapterRef}] pid=${plan.problemId} step=${plan.stepIndex} ` +
        `choice=${plan.choiceId.slice(0, 8)}… "${plan.choiceText}" ← answer "${plan.answer}"`,
    );
  }
  if (plans.length > 30) console.log(`  … and ${plans.length - 30} more`);

  if (dryRun || plans.length === 0) {
    await prisma.$disconnect();
    return;
  }

  const touchedProblems = new Set<string>();
  for (const plan of plans) {
    await prisma.problemChoice.update({
      where: { id: plan.choiceId },
      data: { isCorrect: true },
    });
    touchedProblems.add(plan.problemId);
  }

  let flagsCleared = 0;
  let statusBumped = 0;

  for (const pid of touchedProblems) {
    const fresh = await prisma.problem.findUnique({
      where: { id: pid },
      select: {
        qualityCriticalFlags: true,
        qualityStatus: true,
        steps: { select: { choices: { select: { isCorrect: true } } } },
      },
    });
    if (!fresh || !allStepsHaveOneCorrect(fresh.steps)) continue;

    const nextFlags = stripNoCorrectFlag(fresh.qualityCriticalFlags);
    if (nextFlags.length === fresh.qualityCriticalFlags.length) continue;

    let nextStatus: QualityStatus | undefined;
    if (
      fresh.qualityStatus === 'EXCLUDED' &&
      nextFlags.length === 0
    ) {
      nextStatus = 'USABLE';
      statusBumped++;
    }

    await prisma.problem.update({
      where: { id: pid },
      data: {
        qualityCriticalFlags: nextFlags,
        ...(nextStatus ? { qualityStatus: nextStatus } : {}),
      },
    });
    flagsCleared++;
  }

  console.log(`\nApplied ${plans.length} choice fix(es) across ${touchedProblems.size} problem(s).`);
  console.log(`Cleared NO_CORRECT_OPTION on ${flagsCleared} problem(s); status bumped on ${statusBumped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
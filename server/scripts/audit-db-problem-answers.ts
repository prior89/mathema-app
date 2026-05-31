/**
 * Audit DB-level Problem.ProblemStep.ProblemChoice integrity.
 *
 * Scope: ALL problems in DB — KR (koreanConceptLessonId set), IN (conceptLessonId set), legacy (neither).
 *
 * Defects flagged:
 *   - NO_CORRECT     : step has 0 correct choices  ("답이 없는 문제")
 *   - MULTI_CORRECT  : step has 2+ correct choices ("답이 여러 개")
 *   - WRONG_COUNT    : step has < 4 or > 5 choices (spec says 5)
 *   - EMPTY_TEXT     : a choice has empty text
 *
 * Run: npx ts-node --transpile-only scripts/audit-db-problem-answers.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Defect = {
  problemId: string;
  source: string;
  curriculum: 'KR' | 'IN' | 'LEGACY';
  chapterRef: string;
  stepIndex: number;
  stepType: string;
  kind: 'NO_CORRECT' | 'MULTI_CORRECT' | 'WRONG_COUNT' | 'EMPTY_TEXT';
  detail: string;
};

async function main() {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      source: true,
      body: true,
      conceptLessonId: true,
      koreanConceptLessonId: true,
      conceptLesson: { select: { chapterCode: true } },
      koreanConceptLesson: { select: { chapterCode: true } },
      steps: {
        select: {
          stepIndex: true,
          stepType: true,
          choices: { select: { text: true, isCorrect: true, choiceIndex: true } },
        },
        orderBy: { stepIndex: 'asc' },
      },
    },
  });

  console.log(`Loaded ${problems.length} problems from DB.\n`);

  const defects: Defect[] = [];

  for (const p of problems) {
    const curriculum: Defect['curriculum'] = p.koreanConceptLessonId
      ? 'KR'
      : p.conceptLessonId
        ? 'IN'
        : 'LEGACY';
    const chapterRef =
      p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? '(unmapped)';

    for (const step of p.steps) {
      const correctCount = step.choices.filter((c) => c.isCorrect).length;
      const count = step.choices.length;

      if (count < 4 || count > 5) {
        defects.push({
          problemId: p.id,
          source: p.source,
          curriculum,
          chapterRef,
          stepIndex: step.stepIndex,
          stepType: step.stepType,
          kind: 'WRONG_COUNT',
          detail: `${count} choices (expected 5)`,
        });
      }
      if (correctCount === 0) {
        defects.push({
          problemId: p.id,
          source: p.source,
          curriculum,
          chapterRef,
          stepIndex: step.stepIndex,
          stepType: step.stepType,
          kind: 'NO_CORRECT',
          detail: `0 correct (choices: ${step.choices
            .map((c) => `${c.choiceIndex}${c.isCorrect ? 'T' : 'F'}`)
            .join(',')})`,
        });
      } else if (correctCount > 1) {
        defects.push({
          problemId: p.id,
          source: p.source,
          curriculum,
          chapterRef,
          stepIndex: step.stepIndex,
          stepType: step.stepType,
          kind: 'MULTI_CORRECT',
          detail: `${correctCount} correct`,
        });
      }
      for (const c of step.choices) {
        if (!c.text || c.text.trim() === '') {
          defects.push({
            problemId: p.id,
            source: p.source,
            curriculum,
            chapterRef,
            stepIndex: step.stepIndex,
            stepType: step.stepType,
            kind: 'EMPTY_TEXT',
            detail: `choice ${c.choiceIndex} empty`,
          });
        }
      }
    }
  }

  if (defects.length === 0) {
    console.log('✓ No defects. Every step has exactly 1 correct out of 5.');
    return;
  }

  // Summary by curriculum × kind
  const tally = new Map<string, number>();
  for (const d of defects) {
    const k = `${d.curriculum}__${d.kind}`;
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  console.log(`✗ Found ${defects.length} defect(s).\n`);
  console.log('Summary (curriculum × kind):');
  for (const [k, n] of [...tally.entries()].sort()) {
    const [cur, kind] = k.split('__');
    console.log(`  ${cur.padEnd(7)} ${kind.padEnd(15)} ${n}`);
  }
  console.log();

  // Distinct problem ids
  const distinctProblems = new Set(defects.map((d) => d.problemId));
  console.log(`Distinct problems affected: ${distinctProblems.size}\n`);

  // Top chapters
  const byChapter = new Map<string, number>();
  for (const d of defects) {
    const k = `${d.curriculum} ${d.chapterRef}`;
    byChapter.set(k, (byChapter.get(k) ?? 0) + 1);
  }
  console.log('Top chapters by defect count:');
  for (const [k, n] of [...byChapter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${n.toString().padStart(4)}  ${k}`);
  }
  console.log();

  // Concrete examples — first 30 of NO_CORRECT
  const noCorrect = defects.filter((d) => d.kind === 'NO_CORRECT');
  if (noCorrect.length > 0) {
    console.log(`--- NO_CORRECT examples (showing first ${Math.min(30, noCorrect.length)} of ${noCorrect.length}) ---`);
    for (const d of noCorrect.slice(0, 30)) {
      console.log(
        `  [${d.curriculum} ${d.chapterRef}] problem=${d.problemId} step=${d.stepIndex}(${d.stepType})`,
      );
      console.log(`    source: ${d.source}`);
    }
    console.log();
  }

  const multi = defects.filter((d) => d.kind === 'MULTI_CORRECT');
  if (multi.length > 0) {
    console.log(`--- MULTI_CORRECT examples (showing first ${Math.min(30, multi.length)} of ${multi.length}) ---`);
    for (const d of multi.slice(0, 30)) {
      console.log(
        `  [${d.curriculum} ${d.chapterRef}] problem=${d.problemId} step=${d.stepIndex}(${d.stepType}) ${d.detail}`,
      );
      console.log(`    source: ${d.source}`);
    }
    console.log();
  }

  const wrongCount = defects.filter((d) => d.kind === 'WRONG_COUNT');
  if (wrongCount.length > 0) {
    console.log(`--- WRONG_COUNT examples (showing first ${Math.min(20, wrongCount.length)} of ${wrongCount.length}) ---`);
    for (const d of wrongCount.slice(0, 20)) {
      console.log(`  [${d.curriculum} ${d.chapterRef}] ${d.problemId} step ${d.stepIndex} ${d.detail}`);
    }
    console.log();
  }

  const empty = defects.filter((d) => d.kind === 'EMPTY_TEXT');
  if (empty.length > 0) {
    console.log(`--- EMPTY_TEXT examples (showing first ${Math.min(20, empty.length)} of ${empty.length}) ---`);
    for (const d of empty.slice(0, 20)) {
      console.log(`  [${d.curriculum} ${d.chapterRef}] ${d.problemId} step ${d.stepIndex} ${d.detail}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

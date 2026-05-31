/**
 * Audit: does the option marked isCorrect=true actually match Problem.answer?
 *
 * The user reports "답없는 문제들이 있어" — even though every step has exactly
 * one isCorrect=true, the marked option may not be the mathematically correct
 * answer. We can't run a CAS in TS, but we CAN compare the option's text
 * against the source-of-truth Problem.answer (and against ProblemStep.prompt
 * containing the answer hint for 3-stage problems).
 *
 * Heuristic: normalize whitespace + strip $...$ + strip common LaTeX wrappers,
 * then check substring containment in BOTH directions. If the marked option
 * shares no token overlap with answer, flag for human review.
 *
 * Run: npx ts-node --transpile-only scripts/audit-answer-vs-correct-option.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Strip $...$ delimiters, \dfrac → /, \cdot → *, remove spaces, lowercase. */
function normalize(s: string): string {
  return s
    .replace(/\$/g, '')
    .replace(/\\dfrac/g, '\\frac')
    .replace(/\\left|\\right/g, '')
    .replace(/\\\\/g, '')
    .replace(/[\s,]/g, '')
    .toLowerCase();
}

/** Extract a likely "final answer" token from a free-text answer string. */
function looseTokens(s: string): Set<string> {
  const norm = normalize(s);
  const set = new Set<string>();
  // Split on operators/punctuation; keep numeric+latex tokens of length >= 2.
  for (const tok of norm.split(/[=+\-*/()\[\]{}<>;:.]+/)) {
    if (tok.length >= 1) set.add(tok);
  }
  set.add(norm);
  return set;
}

function tokensOverlap(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const ta = looseTokens(a);
  const tb = looseTokens(b);
  for (const t of ta) if (t.length >= 2 && tb.has(t)) return true;
  return false;
}

type Suspect = {
  problemId: string;
  source: string;
  curriculum: 'KR' | 'IN' | 'LEGACY';
  chapterRef: string;
  stepIndex: number;
  stepType: string;
  answer: string;
  correctOptionText: string;
  hint?: string;
};

async function main() {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      source: true,
      answer: true,
      formula: true,
      conceptLessonId: true,
      koreanConceptLessonId: true,
      conceptLesson: { select: { chapterCode: true } },
      koreanConceptLesson: { select: { chapterCode: true } },
      steps: {
        select: {
          stepIndex: true,
          stepType: true,
          prompt: true,
          choices: { select: { text: true, isCorrect: true } },
        },
      },
    },
  });

  console.log(`Loaded ${problems.length} problems.\n`);

  const suspects: Suspect[] = [];
  let answerMissing = 0;

  for (const p of problems) {
    const curriculum: Suspect['curriculum'] = p.koreanConceptLessonId
      ? 'KR'
      : p.conceptLessonId
        ? 'IN'
        : 'LEGACY';
    const chapterRef =
      p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? '(unmapped)';

    if (!p.answer || p.answer.trim() === '') {
      answerMissing++;
      continue;
    }

    // We compare against the FINAL step (ANSWER stage for 3-stage, or the single
    // step for Study). Concept/Process steps have their own per-stage answers.
    const finalStep = p.steps
      .slice()
      .sort((a, b) => a.stepIndex - b.stepIndex)
      .pop();
    if (!finalStep) continue;

    const correct = finalStep.choices.find((c) => c.isCorrect);
    if (!correct) continue;

    if (!tokensOverlap(p.answer, correct.text)) {
      // Try also matching against formula (sometimes the answer key is there).
      if (p.formula && tokensOverlap(p.formula, correct.text)) continue;
      suspects.push({
        problemId: p.id,
        source: p.source,
        curriculum,
        chapterRef,
        stepIndex: finalStep.stepIndex,
        stepType: finalStep.stepType,
        answer: p.answer.slice(0, 80),
        correctOptionText: correct.text.slice(0, 80),
      });
    }
  }

  console.log(`Problems with empty Problem.answer: ${answerMissing}\n`);
  console.log(`Suspects (correct option text doesn't match Problem.answer): ${suspects.length}\n`);

  const byCur = new Map<string, number>();
  for (const s of suspects) byCur.set(s.curriculum, (byCur.get(s.curriculum) ?? 0) + 1);
  console.log('By curriculum:');
  for (const [k, v] of [...byCur.entries()].sort()) console.log(`  ${k.padEnd(7)} ${v}`);
  console.log();

  const byCh = new Map<string, number>();
  for (const s of suspects) {
    const k = `${s.curriculum} ${s.chapterRef}`;
    byCh.set(k, (byCh.get(k) ?? 0) + 1);
  }
  console.log('Top chapters by suspect count:');
  for (const [k, n] of [...byCh.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${n.toString().padStart(4)}  ${k}`);
  }
  console.log();

  console.log('--- First 40 suspect examples ---');
  for (const s of suspects.slice(0, 40)) {
    console.log(
      `  [${s.curriculum} ${s.chapterRef}] step=${s.stepIndex}(${s.stepType})`,
    );
    console.log(`    answer : ${s.answer}`);
    console.log(`    correct: ${s.correctOptionText}`);
    console.log(`    pid    : ${s.problemId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

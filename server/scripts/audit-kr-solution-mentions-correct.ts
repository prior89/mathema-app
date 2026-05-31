/**
 * KR-only audit: does the solution string mention the isCorrect option's text?
 *
 * For Korean code-source problem pools (Mastery + Study), check that the
 * solution narrative contains the marked-correct option's text. If not,
 * the correct-marking is suspect.
 *
 * Run: npx ts-node --transpile-only scripts/audit-kr-solution-mentions-correct.ts
 */
import { KOREAN_PROBLEMS, KOREAN_STUDY_PROBLEMS } from '../src/common/curriculum/korean-problems';

function norm(s: string): string {
  let r = s;
  r = r.replace(/\$/g, '');
  r = r.replace(/\\dfrac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}/g, '($1)/($2)');
  r = r.replace(/\\frac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}/g, '($1)/($2)');
  r = r.replace(/\\left|\\right/g, '');
  r = r.replace(/\\cdot/g, '*');
  r = r.replace(/\\times/g, '*');
  r = r.replace(/\\pi\b/g, 'pi');
  r = r.replace(/\\sqrt/g, 'sqrt');
  r = r.replace(/\\geq|\\ge\b/g, '>=');
  r = r.replace(/\\leq|\\le\b/g, '<=');
  r = r.replace(/\\neq|\\ne\b/g, '!=');
  r = r.replace(/\\infty/g, 'inf');
  // Strip Korean unit/text suffixes (개, 명, 각형, cm, kg, kmh, ...)
  r = r.replace(/\\text\s*\{[^}]*\}/g, '');
  r = r.replace(/[가-힣]+/g, '');
  // Strip remaining LaTeX backslash commands
  r = r.replace(/\\[a-zA-Z]+/g, '');
  // Strip braces, brackets, parens, spaces, punctuation
  r = r.replace(/[\s,.{}\[\]()°]/g, '');
  return r.toLowerCase();
}

type Suspect = {
  pool: 'MASTERY' | 'STUDY';
  chapterCode: string;
  problemIndex: number;
  difficulty: string;
  concept: string;
  stem: string;
  stepIndex?: number;
  stepType?: string;
  correctOptionText: string;
  solutionSnippet: string;
};

const suspects: Suspect[] = [];

// Mastery (3-step)
for (const [code, chapter] of Object.entries(KOREAN_PROBLEMS)) {
  chapter.problems.forEach((p, i) => {
    p.steps.forEach((step) => {
      const correct = step.options.find((o) => o.isCorrect);
      if (!correct) return;
      const solutionN = norm(step.solution ?? '');
      const optionN = norm(correct.text);
      if (!optionN || !solutionN) return;
      // If option text is a single character/digit, skip (too noisy).
      if (optionN.length < 2) return;
      if (!solutionN.includes(optionN)) {
        suspects.push({
          pool: 'MASTERY',
          chapterCode: code,
          problemIndex: i,
          difficulty: p.difficulty,
          concept: p.concept,
          stem: p.stem.slice(0, 70),
          stepIndex: step.stepIndex,
          stepType: step.stepType,
          correctOptionText: correct.text.slice(0, 60),
          solutionSnippet: (step.solution ?? '').slice(0, 80),
        });
      }
    });
  });
}

// Study (single-step)
for (const [code, chapter] of Object.entries(KOREAN_STUDY_PROBLEMS)) {
  chapter.problems.forEach((p, i) => {
    const correct = p.options.find((o) => o.isCorrect);
    if (!correct) return;
    const solutionN = norm(p.solution ?? '');
    const optionN = norm(correct.text);
    if (!optionN || !solutionN) return;
    if (optionN.length < 2) return;
    if (!solutionN.includes(optionN)) {
      suspects.push({
        pool: 'STUDY',
        chapterCode: code,
        problemIndex: i,
        difficulty: p.difficulty,
        concept: p.concept,
        stem: p.stem.slice(0, 70),
        correctOptionText: correct.text.slice(0, 60),
        solutionSnippet: (p.solution ?? '').slice(0, 80),
      });
    }
  });
}

console.log(`\nTotal suspects (correct option text NOT in solution): ${suspects.length}\n`);

const byCh = new Map<string, number>();
for (const s of suspects) {
  const k = `${s.pool} ${s.chapterCode}`;
  byCh.set(k, (byCh.get(k) ?? 0) + 1);
}
console.log('Top suspect chapters:');
for (const [k, n] of [...byCh.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
  console.log(`  ${n.toString().padStart(4)}  ${k}`);
}
console.log();

console.log('--- First 50 suspects ---');
for (const s of suspects.slice(0, 50)) {
  const label = s.stepType ? `step=${s.stepIndex}(${s.stepType})` : 'single';
  console.log(`  [${s.pool} ${s.chapterCode} #${s.problemIndex} ${s.difficulty} ${s.concept}] ${label}`);
  console.log(`    stem    : ${s.stem}`);
  console.log(`    correct : ${s.correctOptionText}`);
  console.log(`    soln    : ${s.solutionSnippet}`);
}

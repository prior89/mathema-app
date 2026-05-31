/**
 * Audit Korean curriculum problem data integrity.
 *
 * For every KoreanChapterProblems × every problem × every step,
 * check that the 5 options contain EXACTLY one isCorrect:true.
 *
 * - 0 correct → 답이 없는 문제 (user-reported 2026-05-27)
 * - 2+ correct → ambiguous answer
 * - prompt/text empty → empty step
 *
 * Run: npx ts-node --transpile-only scripts/audit-korean-correct-options.ts
 */

import { KOREAN_PROBLEMS, KOREAN_STUDY_PROBLEMS } from '../src/common/curriculum/korean-problems';

type Issue = {
  chapterCode: string;
  problemIndex: number;        // 0-based
  difficulty: string;
  concept: string;
  stem: string;
  stepType?: string;
  kind: 'no-correct' | 'multi-correct' | 'empty-prompt' | 'empty-option' | 'duplicate-option-key';
  detail: string;
};

const issues: Issue[] = [];

function auditOptions(
  chapterCode: string,
  problemIndex: number,
  difficulty: string,
  concept: string,
  stem: string,
  stepType: string | undefined,
  options: ReadonlyArray<{ key: string; text: string; isCorrect: boolean }>,
) {
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (correctCount === 0) {
    issues.push({
      chapterCode, problemIndex, difficulty, concept, stem, stepType,
      kind: 'no-correct',
      detail: `correct option count = 0 (options: ${options.map((o) => `${o.key}[${o.isCorrect ? 'T' : 'F'}]`).join(', ')})`,
    });
  } else if (correctCount > 1) {
    issues.push({
      chapterCode, problemIndex, difficulty, concept, stem, stepType,
      kind: 'multi-correct',
      detail: `correct option count = ${correctCount}`,
    });
  }
  const keys = new Set<string>();
  for (const o of options) {
    if (keys.has(o.key)) {
      issues.push({
        chapterCode, problemIndex, difficulty, concept, stem, stepType,
        kind: 'duplicate-option-key',
        detail: `key '${o.key}' duplicated`,
      });
    }
    keys.add(o.key);
    if (!o.text || o.text.trim() === '') {
      issues.push({
        chapterCode, problemIndex, difficulty, concept, stem, stepType,
        kind: 'empty-option',
        detail: `option ${o.key} has empty text`,
      });
    }
  }
}

console.log(`\n=== Mastery 3-step pool (${Object.keys(KOREAN_PROBLEMS).length} chapters) ===\n`);
for (const [code, chapter] of Object.entries(KOREAN_PROBLEMS)) {
  if (chapter.problems.length !== 20) {
    console.warn(`! ${code} has ${chapter.problems.length} problems (expected 20)`);
  }
  chapter.problems.forEach((p, i) => {
    if (!p.stem || p.stem.trim() === '') {
      issues.push({
        chapterCode: code, problemIndex: i, difficulty: p.difficulty, concept: p.concept,
        stem: p.stem, kind: 'empty-prompt', detail: 'stem is empty',
      });
    }
    p.steps.forEach((step) => {
      if (!step.prompt || step.prompt.trim() === '') {
        issues.push({
          chapterCode: code, problemIndex: i, difficulty: p.difficulty, concept: p.concept,
          stem: p.stem, stepType: step.stepType,
          kind: 'empty-prompt', detail: 'step prompt is empty',
        });
      }
      auditOptions(code, i, p.difficulty, p.concept, p.stem, step.stepType, step.options);
    });
  });
}

console.log(`\n=== Study single-step pool (${Object.keys(KOREAN_STUDY_PROBLEMS).length} chapters) ===\n`);
for (const [code, chapter] of Object.entries(KOREAN_STUDY_PROBLEMS)) {
  chapter.problems.forEach((p, i) => {
    auditOptions(code, i, p.difficulty, p.concept, p.stem, 'ANSWER', p.options);
  });
}

if (issues.length === 0) {
  console.log('\n✓ All 0 issues. Every step has exactly one correct option.\n');
  process.exit(0);
}

const grouped = new Map<string, Issue[]>();
for (const it of issues) {
  const k = it.chapterCode;
  if (!grouped.has(k)) grouped.set(k, []);
  grouped.get(k)!.push(it);
}

console.log(`\n✗ Found ${issues.length} issue(s) across ${grouped.size} chapter(s):\n`);
for (const [code, list] of [...grouped.entries()].sort()) {
  console.log(`\n--- ${code}  (${list.length} issue${list.length === 1 ? '' : 's'}) ---`);
  for (const it of list) {
    const stepLabel = it.stepType ? ` step=${it.stepType}` : '';
    const stemSnip = it.stem.length > 60 ? it.stem.slice(0, 60) + '…' : it.stem;
    console.log(`  [#${it.problemIndex} ${it.difficulty} ${it.concept}]${stepLabel}  ${it.kind}: ${it.detail}`);
    console.log(`    stem: ${stemSnip}`);
  }
}

console.log(`\nSummary by kind:`);
const byKind = new Map<string, number>();
for (const it of issues) byKind.set(it.kind, (byKind.get(it.kind) ?? 0) + 1);
for (const [k, n] of [...byKind.entries()].sort()) console.log(`  ${k}: ${n}`);

process.exit(1);

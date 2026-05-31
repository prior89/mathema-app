/**
 * Audit Problem.qualityCriticalFlags — LLM-graded "no correct option / multiple correct / mismatch".
 *
 * Run: npx ts-node --transpile-only scripts/audit-quality-flags.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const all = await prisma.problem.findMany({
    select: {
      id: true,
      source: true,
      conceptLessonId: true,
      koreanConceptLessonId: true,
      qualityStatus: true,
      qualityCriticalFlags: true,
      qualityScore: true,
      conceptLesson: { select: { chapterCode: true } },
      koreanConceptLesson: { select: { chapterCode: true } },
    },
  });

  console.log(`Total problems: ${all.length}\n`);

  // Curriculum breakdown
  const cur = { KR: 0, IN: 0, LEGACY: 0 };
  for (const p of all) {
    if (p.koreanConceptLessonId) cur.KR++;
    else if (p.conceptLessonId) cur.IN++;
    else cur.LEGACY++;
  }
  console.log(`By curriculum: KR=${cur.KR}  IN=${cur.IN}  LEGACY=${cur.LEGACY}\n`);

  // Quality status breakdown
  const qs = new Map<string, number>();
  for (const p of all) {
    qs.set(p.qualityStatus ?? 'NULL', (qs.get(p.qualityStatus ?? 'NULL') ?? 0) + 1);
  }
  console.log('qualityStatus distribution:');
  for (const [k, v] of [...qs.entries()].sort()) console.log(`  ${k.padEnd(12)} ${v}`);
  console.log();

  // Flag occurrence
  const flagged = all.filter((p) => p.qualityCriticalFlags.length > 0);
  console.log(`Problems with at least 1 critical flag: ${flagged.length}\n`);

  const byFlag = new Map<string, { KR: number; IN: number; LEGACY: number }>();
  for (const p of flagged) {
    const c: keyof typeof cur = p.koreanConceptLessonId
      ? 'KR'
      : p.conceptLessonId
        ? 'IN'
        : 'LEGACY';
    for (const f of p.qualityCriticalFlags) {
      if (!byFlag.has(f)) byFlag.set(f, { KR: 0, IN: 0, LEGACY: 0 });
      byFlag.get(f)![c]++;
    }
  }
  console.log('Flag distribution by curriculum:');
  console.log(`  ${'FLAG'.padEnd(28)} ${'KR'.padStart(5)} ${'IN'.padStart(5)} ${'LEG'.padStart(5)} ${'TOT'.padStart(5)}`);
  for (const [f, counts] of [...byFlag.entries()].sort()) {
    const tot = counts.KR + counts.IN + counts.LEGACY;
    console.log(
      `  ${f.padEnd(28)} ${counts.KR.toString().padStart(5)} ${counts.IN.toString().padStart(5)} ${counts.LEGACY.toString().padStart(5)} ${tot.toString().padStart(5)}`,
    );
  }
  console.log();

  // NO_CORRECT_OPTION specifically — the "답 없음" case the user is reporting
  const noCorrect = flagged.filter((p) => p.qualityCriticalFlags.includes('NO_CORRECT_OPTION'));
  console.log(`--- NO_CORRECT_OPTION (the "답 없음" case): ${noCorrect.length} ---`);

  // By chapter
  const ncByChapter = new Map<string, number>();
  for (const p of noCorrect) {
    const ref =
      (p.koreanConceptLessonId ? 'KR ' : p.conceptLessonId ? 'IN ' : 'LEG ') +
      (p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? '(unmapped)');
    ncByChapter.set(ref, (ncByChapter.get(ref) ?? 0) + 1);
  }
  console.log('Top NO_CORRECT_OPTION chapters:');
  for (const [k, n] of [...ncByChapter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${n.toString().padStart(4)}  ${k}`);
  }
  console.log();

  // MULTIPLE_CORRECT_OPTIONS
  const multi = flagged.filter((p) => p.qualityCriticalFlags.includes('MULTIPLE_CORRECT_OPTIONS'));
  console.log(`--- MULTIPLE_CORRECT_OPTIONS: ${multi.length} ---`);
  const mByChapter = new Map<string, number>();
  for (const p of multi) {
    const ref =
      (p.koreanConceptLessonId ? 'KR ' : p.conceptLessonId ? 'IN ' : 'LEG ') +
      (p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? '(unmapped)');
    mByChapter.set(ref, (mByChapter.get(ref) ?? 0) + 1);
  }
  console.log('Top MULTIPLE_CORRECT_OPTIONS chapters:');
  for (const [k, n] of [...mByChapter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${n.toString().padStart(4)}  ${k}`);
  }
  console.log();

  // Of NO_CORRECT_OPTION, how many are still in active pool (qualityStatus IN APPROVED, USABLE, NULL — student reachable)?
  const activelyReachable = noCorrect.filter(
    (p) => !p.qualityStatus || p.qualityStatus === 'APPROVED' || p.qualityStatus === 'USABLE',
  );
  console.log(
    `Of those NO_CORRECT_OPTION, still reachable to students (not EXCLUDED): ${activelyReachable.length}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

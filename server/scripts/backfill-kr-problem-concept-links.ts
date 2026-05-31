/**
 * Sprint 1 A4: Find KR Problems with no ProblemConcept link and backfill
 * using requiredSkills → Concept.code lookup.
 *
 * The 20 problems missing links were never paired with a Concept either
 * because (a) their requiredSkills referenced a Concept code that didn't
 * exist yet at seed time, or (b) the seed batch skipped them. Both cases
 * are recoverable: requiredSkills is non-empty for 100% of KR rows, and
 * Concept.code is unique.
 *
 * Run: npx ts-node --transpile-only scripts/backfill-kr-problem-concept-links.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const orphans = await prisma.problem.findMany({
    where: {
      koreanConceptLessonId: { not: null },
      concepts: { none: {} },
    },
    select: {
      id: true,
      source: true,
      requiredSkills: true,
      koreanConceptLesson: { select: { chapterCode: true } },
    },
  });

  console.log(`KR orphans (no ProblemConcept link): ${orphans.length}\n`);
  if (orphans.length === 0) {
    console.log('Nothing to backfill.');
    return;
  }

  // Lookup table from Concept.code → Concept.id
  const concepts = await prisma.concept.findMany({ select: { id: true, code: true } });
  const conceptByCode = new Map(concepts.map((c) => [c.code, c.id]));

  let linked = 0;
  const unresolved: { problemId: string; chapter: string; skills: string[] }[] = [];

  for (const p of orphans) {
    const matchingConceptIds = p.requiredSkills
      .map((s) => conceptByCode.get(s))
      .filter((v): v is string => !!v);

    if (matchingConceptIds.length === 0) {
      unresolved.push({
        problemId: p.id,
        chapter: p.koreanConceptLesson?.chapterCode ?? '(unmapped)',
        skills: p.requiredSkills,
      });
      continue;
    }

    for (const cid of matchingConceptIds) {
      await prisma.problemConcept.upsert({
        where: { problemId_conceptId: { problemId: p.id, conceptId: cid } },
        update: {},
        create: { problemId: p.id, conceptId: cid, weight: 1.0 },
      });
    }
    linked++;
  }

  console.log(`Linked: ${linked}`);
  console.log(`Unresolved (no Concept with matching code): ${unresolved.length}`);
  for (const u of unresolved.slice(0, 30)) {
    console.log(`  [${u.chapter}] ${u.problemId}  skills=${u.skills.join(',')}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * Read-only audit: how many Problem rows are "unreachable" (no ProblemStep
 * with stepIndex=1) per ConceptLesson?
 *
 * Background: dashboard.service.ts used to count every Problem mapped to a
 * chapter, even those without an entry-step row. A student would see
 * "6 / 7 problems" on a chapter that only exposes 6 reachable problems, so
 * the card would stick at 86% and mastered=true would never trigger.
 *
 * P19.1 patched the dashboard SQL. This script answers the upstream
 * question: do we have other unreachable rows lying around (likely from
 * DraftPublisher publishing drafts whose payload.steps was empty), or is
 * the CH 4 case isolated?
 *
 * Run:
 *   cd server
 *   npx ts-node scripts/audit-problem-steps.ts
 */
import { PrismaClient } from '@prisma/client';

interface ChapterRow {
  chapter_code: string;
  title_en: string;
  problems_total: bigint;
  problems_reachable: bigint;
  problems_unreachable: bigint;
}

interface UnreachableRow {
  problem_id: string;
  chapter_code: string;
  title_en: string;
  source: string | null;
  created_at: Date;
}

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const chapters = await prisma.$queryRaw<ChapterRow[]>`
      SELECT cl."chapterCode" AS chapter_code,
             cl."titleEn"     AS title_en,
             COUNT(DISTINCT p.id) AS problems_total,
             COUNT(DISTINCT p.id) FILTER (
               WHERE EXISTS (
                 SELECT 1 FROM "ProblemStep" ps
                 WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
               )
             ) AS problems_reachable,
             COUNT(DISTINCT p.id) FILTER (
               WHERE NOT EXISTS (
                 SELECT 1 FROM "ProblemStep" ps
                 WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
               )
             ) AS problems_unreachable
      FROM "ConceptLesson" cl
      LEFT JOIN "Problem" p ON p."conceptLessonId" = cl.id
      GROUP BY cl."chapterCode", cl."titleEn"
      HAVING COUNT(DISTINCT p.id) > 0
      ORDER BY problems_unreachable DESC, cl."chapterCode";
    `;

    let totalProblems = 0n;
    let totalReachable = 0n;
    let totalUnreachable = 0n;
    const broken: ChapterRow[] = [];

    for (const r of chapters) {
      totalProblems += r.problems_total;
      totalReachable += r.problems_reachable;
      totalUnreachable += r.problems_unreachable;
      if (r.problems_unreachable > 0n) broken.push(r);
    }

    console.log('=== Per-chapter Problem reachability ===');
    console.log(
      'chapter_code'.padEnd(22) +
        '  total  reach  unreach  title',
    );
    for (const r of chapters) {
      const mark = r.problems_unreachable > 0n ? '!' : ' ';
      console.log(
        `${mark} ${r.chapter_code.padEnd(20)}  ${String(r.problems_total).padStart(5)}  ${String(r.problems_reachable).padStart(5)}  ${String(r.problems_unreachable).padStart(7)}  ${r.title_en}`,
      );
    }

    console.log('\n=== Totals ===');
    console.log(`Problems total:       ${totalProblems}`);
    console.log(`Problems reachable:   ${totalReachable}`);
    console.log(`Problems unreachable: ${totalUnreachable}`);
    console.log(`Chapters affected:    ${broken.length} / ${chapters.length}`);

    if (totalUnreachable > 0n) {
      const unreachable = await prisma.$queryRaw<UnreachableRow[]>`
        SELECT p.id          AS problem_id,
               cl."chapterCode" AS chapter_code,
               cl."titleEn"  AS title_en,
               p.source      AS source,
               p."createdAt" AS created_at
        FROM "Problem" p
        JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
        WHERE NOT EXISTS (
          SELECT 1 FROM "ProblemStep" ps
          WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
        )
        ORDER BY cl."chapterCode", p."createdAt";
      `;

      console.log('\n=== Unreachable Problem rows ===');
      for (const u of unreachable) {
        console.log(
          `${u.chapter_code.padEnd(20)}  ${u.problem_id}  ${u.created_at.toISOString().slice(0, 10)}  ${u.source ?? '(no source)'}`,
        );
      }

      const cd = await prisma.$queryRaw<Array<{ bucket: string; n: bigint }>>`
        SELECT
          CASE
            WHEN cd.id IS NULL                                  THEN 'no-draft (seed or direct insert)'
            WHEN cd."editedJson"     IS NOT NULL                THEN 'draft · editedJson present'
            WHEN cd."aiResponseJson" IS NOT NULL                THEN 'draft · aiResponseJson present'
            ELSE                                                     'draft · payload empty'
          END AS bucket,
          COUNT(*) AS n
        FROM "Problem" p
        LEFT JOIN "ContentDraft" cd ON cd."publishedProblemId" = p.id
        WHERE NOT EXISTS (
          SELECT 1 FROM "ProblemStep" ps
          WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
        )
        GROUP BY bucket
        ORDER BY n DESC;
      `;
      console.log('\n=== Unreachable Problem provenance ===');
      for (const o of cd) console.log(`  ${o.bucket.padEnd(40)}  ${o.n}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const url = fs.readFileSync(
    path.join('C:', 'Users', 'User', 'prod-db-url.txt'),
    'utf8',
  ).trim();
  const p = new PrismaClient({ datasources: { db: { url } } });

  const rows: any = await p.$queryRawUnsafe(
    `SELECT p.id, p.source, p.body, p.answer,
            p."conceptLessonId", cl."chapterCode" AS current_chapter, cl."titleEn" AS current_title,
            p."qualityRubric"
     FROM "Problem" p
     LEFT JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
     WHERE 'CHAPTER_MISMATCH' = ANY(p."qualityCriticalFlags")
     ORDER BY random()
     LIMIT 8`,
  );

  for (const r of rows) {
    const rubric = r.qualityRubric as any;
    console.log(`\n${'='.repeat(72)}\n  id=${r.id.slice(0, 8)}  current=${r.current_chapter}`);
    console.log(`  source: ${r.source}`);
    console.log(`  body:   ${(r.body || '').slice(0, 180).replace(/\n/g, ' ')}`);
    console.log(`  answer: ${r.answer}`);
    console.log(`  current title: ${r.current_title}`);
    if (rubric?.summary) {
      console.log(`  summary: ${rubric.summary}`);
    }
    // Hunt for any chapter/topic hint in each axis comment
    for (const axis of ['clarity', 'pedagogy', 'distractorQuality', 'difficultyMatch', 'curriculumFit']) {
      const a = rubric?.[axis];
      if (a?.comment && /chapter|class|topic|misclass|miscategori|belongs|should be/i.test(a.comment)) {
        console.log(`  ${axis}: ${a.comment}`);
      }
      if (a?.reasonCodes?.includes('CHAPTER_MISMATCH')) {
        console.log(`  -> ${axis} flagged CHAPTER_MISMATCH. reasonCodes: ${a.reasonCodes.join(', ')}`);
      }
    }
  }

  // Available chapter universe
  console.log(`\n${'='.repeat(72)}\n  Available ConceptLesson chapterCodes\n${'='.repeat(72)}`);
  const cls: any = await p.$queryRawUnsafe(
    `SELECT "chapterCode", "classLevel", "titleEn" FROM "ConceptLesson" ORDER BY "classLevel", "chapterCode" LIMIT 100`,
  );
  for (const cl of cls) console.log(`  ${(cl.chapterCode || '').padEnd(20)}  C${cl.classLevel}  ${cl.titleEn}`);

  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

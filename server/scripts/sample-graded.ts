/**
 * sample-graded.ts — pull random samples from each qualityStatus bucket
 * so a human (or me) can sanity-check whether the rubric is judging well.
 *
 * Reads prod DB url from /c/Users/User/prod-db-url.txt.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const N_PER_BUCKET = 5;

async function main() {
  const url = fs.readFileSync(
    path.join('C:', 'Users', 'User', 'prod-db-url.txt'),
    'utf8',
  ).trim();
  const p = new PrismaClient({ datasources: { db: { url } } });

  for (const status of ['APPROVED', 'USABLE', 'EXCLUDED'] as const) {
    console.log(`\n${'='.repeat(80)}\n  ${status} — ${N_PER_BUCKET} random samples\n${'='.repeat(80)}`);
    const rows: any = await p.$queryRawUnsafe(
      `SELECT id, source, body, answer, "qualityScore", "qualityStatus",
              "qualityCriticalFlags", "qualityRubric", "qualityModel"
       FROM "Problem"
       WHERE "qualityStatus" = $1::"QualityStatus"
       ORDER BY random()
       LIMIT ${N_PER_BUCKET}`,
      status,
    );
    for (const r of rows) {
      console.log(`\n— id=${r.id.slice(0, 8)}  score=${Number(r.qualityScore).toFixed(2)}  model=${r.qualityModel}`);
      console.log(`  source: ${r.source}`);
      console.log(`  body:   ${(r.body || '').slice(0, 220).replace(/\n/g, ' ')}${r.body.length > 220 ? '...' : ''}`);
      console.log(`  answer: ${r.answer}`);
      if (r.qualityCriticalFlags?.length > 0) {
        console.log(`  FLAGS:  ${r.qualityCriticalFlags.join(', ')}`);
      }
      const rubric = r.qualityRubric as any;
      if (rubric?.summary) {
        console.log(`  judge:  ${rubric.summary.slice(0, 200)}`);
      }
      if (rubric) {
        const axes = ['clarity', 'pedagogy', 'distractorQuality', 'difficultyMatch', 'curriculumFit'];
        const scores = axes
          .map((a) => `${a[0]}=${rubric[a]?.score ?? '-'}`)
          .join(' ');
        console.log(`  axes:   ${scores}`);
      }
    }
  }

  // Flag frequency cross-check
  console.log(`\n${'='.repeat(80)}\n  Flag breakdown (EXCLUDED only)\n${'='.repeat(80)}`);
  const flags: any = await p.$queryRawUnsafe(
    `SELECT flag, COUNT(*)::int AS n
     FROM (SELECT unnest("qualityCriticalFlags") AS flag FROM "Problem" WHERE "qualityStatus" = 'EXCLUDED') s
     GROUP BY flag ORDER BY n DESC`,
  );
  for (const f of flags) console.log(`  ${f.flag.padEnd(28)}  ${f.n}`);

  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

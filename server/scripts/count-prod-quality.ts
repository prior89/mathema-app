import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const url = fs.readFileSync(path.join('C:', 'Users', 'User', 'prod-db-url.txt'), 'utf8').trim();
  const p = new PrismaClient({ datasources: { db: { url } } });
  const rows: any = await p.$queryRawUnsafe(
    `SELECT "qualityStatus"::text AS status, COUNT(*)::int AS n FROM "Problem" GROUP BY "qualityStatus" ORDER BY n DESC NULLS LAST`,
  );
  console.log('=== Distribution ===');
  console.table(rows);
  const total = await p.problem.count();
  const graded = await p.problem.count({ where: { qualityScore: { not: null } } });
  console.log(`total=${total}  graded=${graded}  ungraded=${total - graded}`);

  console.log('\n=== Top 10 APPROVED (highest qualityScore) ===');
  const top: any = await p.$queryRawUnsafe(
    `SELECT id, ROUND("qualityScore"::numeric, 2) AS score, LEFT(body, 90) AS body_snippet FROM "Problem" WHERE "qualityStatus" = 'APPROVED' ORDER BY "qualityScore" DESC LIMIT 10`,
  );
  console.table(top);

  console.log('\n=== Hard-flag frequency (EXCLUDED) ===');
  const flags: any = await p.$queryRawUnsafe(
    `SELECT flag, COUNT(*)::int AS n FROM (SELECT unnest("qualityCriticalFlags") AS flag FROM "Problem" WHERE "qualityStatus" = 'EXCLUDED') s GROUP BY flag ORDER BY n DESC`,
  );
  console.table(flags);

  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

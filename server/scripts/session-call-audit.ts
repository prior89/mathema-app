import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const url = fs.readFileSync(
    path.join('C:', 'Users', 'User', 'prod-db-url.txt'), 'utf8',
  ).trim();
  const p = new PrismaClient({ datasources: { db: { url } } });

  // Quality grading writes: reflects sweep + reclassify cost
  const grading: any = await p.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n, "qualityModel" AS model, MIN("qualityScoredAt") AS first, MAX("qualityScoredAt") AS last
     FROM "Problem"
     WHERE "qualityScoredAt" > NOW() - INTERVAL '6 hours'
     GROUP BY "qualityModel" ORDER BY n DESC`,
  );
  console.log('\n=== Problem.qualityScoredAt last 6h ===');
  console.table(grading);

  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

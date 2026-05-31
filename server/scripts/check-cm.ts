import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const url = fs.readFileSync(
    path.join('C:', 'Users', 'User', 'prod-db-url.txt'), 'utf8',
  ).trim();
  const p = new PrismaClient({ datasources: { db: { url } } });
  const rows: any = await p.$queryRawUnsafe(
    `SELECT
       COUNT(*) FILTER (WHERE 'CHAPTER_MISMATCH' = ANY("qualityCriticalFlags"))::int AS still_cm,
       COUNT(*) FILTER (WHERE "qualityStatus" = 'APPROVED')::int AS approved,
       COUNT(*) FILTER (WHERE "qualityStatus" = 'USABLE')::int AS usable,
       COUNT(*) FILTER (WHERE "qualityStatus" = 'EXCLUDED')::int AS excluded,
       COUNT(*)::int AS total
     FROM "Problem"`,
  );
  console.log(rows[0]);
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

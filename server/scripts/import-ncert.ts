/**
 * Local NCERT import CLI.
 *
 * Bootstraps the NestJS application context (no HTTP server) and submits
 * the 6 grade JSON files produced by scripts/ncert-pdf-extract/* as
 * ContentIngestJob(JSON_BULK) entries.
 *
 * ContentIngestService.runJob() uses setImmediate, so each job runs inside
 * this same Node process — we wait for status=READY|FAILED before moving on
 * to the next job (sequential, friendly to the LLM rate limit).
 *
 * Run from the server/ directory:
 *
 *   docker compose up -d                        # postgres + redis
 *   npx prisma migrate deploy
 *   npm run db:seed                             # creates admin user
 *   # .env must contain AI_LLM_PROVIDER, AI_LLM_API_KEY, AI_LLM_MODEL
 *   npx ts-node scripts/import-ncert.ts
 *
 * Cost estimate at gpt-4o-mini ($0.15 in / $0.60 out per Mtok):
 *   2,169 problems × ~2,800 tokens each ≈ $2.30 total
 *
 * Re-runs are blocked by sourceDigest uniqueness on ContentIngestJob — if
 * you need to re-import, delete the existing job rows first.
 */
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { AppModule } from '../src/app.module';
import { ContentIngestService } from '../src/modules/content-ingest/content-ingest.service';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

type Source = { grade: number; relPath: string; label: string };

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SOURCES: Source[] = [
  { grade: 7,  relPath: 'scripts/ncert-pdf-extract/output/from_mmd/grade-7.problems.json',     label: 'NCERT Grade 7 (Ganita Prakash, MMD)'   },
  { grade: 8,  relPath: 'scripts/ncert-pdf-extract/output/from_mmd/grade-8.problems.json',     label: 'NCERT Grade 8 (Math VIII, MMD)'         },
  { grade: 9,  relPath: 'scripts/ncert-pdf-extract/output/from_mmd_llm/grade-9.problems.json', label: 'NCERT Grade 9 (Ganita Manjari, LLM)'   },
  { grade: 10, relPath: 'scripts/ncert-pdf-extract/output/from_mmd/grade-10.problems.json',    label: 'NCERT Grade 10 (Math X, MMD)'           },
  { grade: 11, relPath: 'scripts/ncert-pdf-extract/output/from_mmd/grade-11.problems.json',    label: 'NCERT Grade 11 Part I (Math XI, MMD)'  },
  { grade: 12, relPath: 'scripts/ncert-pdf-extract/output/from_mmd/grade-12.problems.json',    label: 'NCERT Grade 12 Part I (Math XII, MMD)' },
];

async function pickAdminUserId(prisma: PrismaService): Promise<string> {
  const adminEmails = (process.env.ADMIN_EMAILS ?? 'polopot123@gmail.com')
    .split(',').map((s) => s.trim()).filter(Boolean);
  if (adminEmails.length === 0) throw new Error('ADMIN_EMAILS env var not set');
  const u = await prisma.user.findFirst({
    where: { email: { in: adminEmails } },
    select: { id: true, email: true },
  });
  if (!u) {
    throw new Error(
      `No admin user found for ADMIN_EMAILS=${adminEmails.join(',')}. ` +
        `Run "npm run db:seed" first.`,
    );
  }
  return u.id;
}

async function waitForJob(
  prisma: PrismaService,
  jobId: string,
  logger: Logger,
  maxSeconds = 4 * 60 * 60, // 4h ceiling
): Promise<{ status: string; drafted: number; total: number }> {
  const start = Date.now();
  let lastReport = '';
  for (;;) {
    const j = await prisma.contentIngestJob.findUnique({
      where: { id: jobId },
      select: { status: true, draftsCreated: true, totalItems: true, errorMessage: true },
    });
    if (!j) throw new Error(`Job ${jobId} disappeared`);
    if (j.status === 'READY' || j.status === 'FAILED') {
      if (j.errorMessage) logger.error(`Job ${jobId} error: ${j.errorMessage}`);
      return { status: j.status, drafted: j.draftsCreated, total: j.totalItems };
    }
    const report = `${j.status} ${j.draftsCreated}/${j.totalItems}`;
    if (report !== lastReport) {
      const elapsed = Math.round((Date.now() - start) / 1000);
      logger.log(`  [${elapsed}s] ${report}`);
      lastReport = report;
    }
    if ((Date.now() - start) / 1000 > maxSeconds) {
      throw new Error(`Timeout waiting for job ${jobId}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function importOne(
  ingest: ContentIngestService,
  prisma: PrismaService,
  userId: string,
  src: Source,
  logger: Logger,
): Promise<void> {
  const abs = path.resolve(REPO_ROOT, src.relPath);
  if (!fs.existsSync(abs)) {
    logger.warn(`Grade ${src.grade}: skip (file not found: ${abs})`);
    return;
  }
  const sizeKb = Math.round(fs.statSync(abs).size / 1024);
  logger.log(`Grade ${src.grade}: ${src.label} — ${sizeKb} KB`);

  let jobId: string;
  try {
    const j = await ingest.createJob({
      userId,
      sourceType: 'JSON_BULK',
      sourceConfig: { type: 'JSON_BULK', filePath: abs },
      label: src.label,
    });
    jobId = j.id;
    logger.log(`  -> job ${jobId} queued`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('already registered')) {
      logger.warn(`  -> ${msg} (skip)`);
      return;
    }
    throw e;
  }

  const result = await waitForJob(prisma, jobId, logger);
  logger.log(
    `Grade ${src.grade}: ${result.status} — ${result.drafted}/${result.total} drafts created`,
  );
}

async function main(): Promise<void> {
  const logger = new Logger('import-ncert');
  logger.log('Bootstrapping NestJS application context...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const ingest = app.get(ContentIngestService);
    const prisma = app.get(PrismaService);
    const userId = await pickAdminUserId(prisma);
    logger.log(`Admin user: ${userId}`);

    const summary: Array<{ grade: number; status: string; drafted: number; total: number }> = [];
    for (const src of SOURCES) {
      try {
        await importOne(ingest, prisma, userId, src, logger);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.error(`Grade ${src.grade}: ${msg}`);
        summary.push({ grade: src.grade, status: 'CRASHED', drafted: 0, total: 0 });
      }
    }

    // Final report from DB (most recent job per label)
    const recent = await prisma.contentIngestJob.findMany({
      where: { label: { in: SOURCES.map((s) => s.label) } },
      orderBy: { createdAt: 'desc' },
      select: { label: true, status: true, draftsCreated: true, totalItems: true },
      take: SOURCES.length,
    });
    logger.log('=== Import summary ===');
    for (const r of recent) {
      logger.log(`  ${r.status.padEnd(8)} ${r.draftsCreated}/${r.totalItems}  ${r.label}`);
    }
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

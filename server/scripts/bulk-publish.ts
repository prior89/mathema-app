/**
 * Bulk-publish all PENDING ContentDraft rows that look ready (have payload,
 * have a conceptLessonId, and are not LLM-FAIL).
 *
 * Each draft becomes a Problem (+ 3 ProblemStep + 15 ProblemChoice) via
 * DraftPublisher, which enforces the NCERT attribution policy automatically.
 *
 * Concurrency: 5 workers, share a cursor. Same pattern as draftAll().
 *
 * Run:
 *   cd server
 *   npx ts-node scripts/bulk-publish.ts
 */
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ContentIngestService } from '../src/modules/content-ingest/content-ingest.service';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

async function main(): Promise<void> {
  const logger = new Logger('bulk-publish');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const svc = app.get(ContentIngestService);
    const prisma = app.get(PrismaService);

    const adminEmails = (process.env.ADMIN_EMAILS ?? 'polopot123@gmail.com')
      .split(',').map((s) => s.trim()).filter(Boolean);
    const admin = await prisma.user.findFirst({
      where: { email: { in: adminEmails } },
      select: { id: true, email: true },
    });
    if (!admin) throw new Error(`No admin user for ${adminEmails.join(',')}`);
    logger.log(`Admin: ${admin.email}`);

    const drafts = await prisma.contentDraft.findMany({
      where: {
        status: 'PENDING',
        conceptLessonId: { not: null },
        aiResponseJson: { not: { equals: null as never } } as never,
        sourceLabel: { not: { contains: 'LLM-FAIL' } },
      },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    });
    logger.log(`Found ${drafts.length} publishable drafts`);

    let approved = 0;
    let failed = 0;
    const failures: Array<{ id: string; msg: string }> = [];
    let cursor = 0;
    const CONCURRENCY = Number(process.env.PUBLISH_CONCURRENCY ?? 5);
    const startMs = Date.now();

    const worker = async (): Promise<void> => {
      for (;;) {
        const i = cursor++;
        if (i >= drafts.length) return;
        const id = drafts[i].id;
        try {
          await svc.approveDraft(id, admin.id, true);
          approved++;
        } catch (e) {
          failed++;
          const msg = e instanceof Error ? e.message : String(e);
          failures.push({ id, msg: msg.slice(0, 200) });
        }
        const done = approved + failed;
        if (done % 50 === 0 || done === drafts.length) {
          const elapsed = Math.round((Date.now() - startMs) / 1000);
          const rate = done / Math.max(1, elapsed);
          const eta = Math.round((drafts.length - done) / Math.max(0.1, rate));
          logger.log(`[${elapsed}s] approved=${approved} failed=${failed} / ${drafts.length}  (ETA ${eta}s)`);
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, drafts.length) }, () => worker()));

    logger.log(`DONE. approved=${approved} failed=${failed} of ${drafts.length}`);
    if (failures.length > 0) {
      logger.warn(`First 10 failures:`);
      for (const f of failures.slice(0, 10)) {
        logger.warn(`  ${f.id}: ${f.msg}`);
      }
    }

    const counts = await prisma.$transaction([
      prisma.problem.count(),
      prisma.contentDraft.count({ where: { status: 'PUBLISHED' } }),
      prisma.contentDraft.count({ where: { status: 'PENDING' } }),
    ]);
    logger.log(`Final tally — problems=${counts[0]} published_drafts=${counts[1]} pending=${counts[2]}`);
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

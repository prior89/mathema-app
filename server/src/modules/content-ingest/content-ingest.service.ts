/* ContentIngest Service — job creation, async processing orchestration, draft CRUD.
 *
 * Flow:
 *   1) createJob(): create ContentIngestJob (status=QUEUED) and persist sourceConfig
 *   2) BullMQ worker (ContentIngestProcessor) → runJob(): adapter.ingest() →
 *      NormalizedProblem[] → generate an LLM draft for each → save ContentDraft
 *   3) Mark job.status READY (or FAILED)
 */
import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SourceRegistry } from './source-registry.service';
import { LlmDraftService, DRAFT_PROMPT_VERSION } from './llm-draft.service';
import { DraftPublisher } from './draft-publisher.service';
import { ContentIngestQueueService } from './content-ingest-queue.service';
import type { ContentIngestStatus, ContentDraftStatus, ContentSourceType, NcertClass, Prisma } from '@prisma/client';
import type { IngestContext, JobMetrics, NormalizedProblem, SourceConfig } from './types';

@Injectable()
export class ContentIngestService {
  private readonly logger = new Logger(ContentIngestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: SourceRegistry,
    private readonly llmDraft: LlmDraftService,
    private readonly publisher: DraftPublisher,
    private readonly queueService: ContentIngestQueueService,
  ) {}

  // ---------- Job lifecycle ----------

  async createJob(opts: { userId: string; sourceType: ContentSourceType; sourceConfig: SourceConfig; label: string }): Promise<{ id: string }> {
    const adapter = this.registry.get(opts.sourceType);
    const digest = await adapter.computeDigest(opts.sourceConfig);
    const existing = await this.prisma.contentIngestJob.findUnique({ where: { sourceDigest: digest } });
    if (existing) throw new BadRequestException(`This source is already registered (job ${existing.id}, status ${existing.status})`);

    const j = await this.prisma.contentIngestJob.create({
      data: {
        uploadedById: opts.userId,
        sourceType: opts.sourceType,
        sourceConfigJson: opts.sourceConfig as unknown as Prisma.InputJsonValue,
        sourceDigest: digest,
        label: opts.label,
        status: 'QUEUED',
      },
      select: { id: true },
    });
    await this.queueService.enqueue(j.id).catch((e) => this.logger.error(`enqueue failed for job ${j.id}: ${e instanceof Error ? e.message : e}`));
    return j;
  }

  /**
   * Background processing — adapter ingest → LLM draft generation → save ContentDraft.
   * Public so the BullMQ worker (ContentIngestProcessor) can invoke it.
   */
  async runJob(jobId: string): Promise<void> {
    const job = await this.prisma.contentIngestJob.findUnique({ where: { id: jobId } });
    if (!job) return;

    await this.prisma.contentIngestJob.update({ where: { id: jobId }, data: { startedAt: new Date(), status: 'FETCHING' } });

    const ctx: IngestContext = {
      updateStatus: async (status: ContentIngestStatus, partial?: Partial<JobMetrics>) => {
        await this.prisma.contentIngestJob.update({
          where: { id: jobId },
          data: {
            status,
            ...(partial?.totalItems !== undefined ? { totalItems: partial.totalItems } : {}),
            ...(partial?.extractedExercises !== undefined ? { extractedExercises: partial.extractedExercises } : {}),
            ...(partial?.extractedProblems !== undefined ? { extractedProblems: partial.extractedProblems } : {}),
            ...(partial?.draftsCreated !== undefined ? { draftsCreated: partial.draftsCreated } : {}),
            ...(partial?.detectedClasses !== undefined ? { detectedClasses: partial.detectedClasses } : {}),
          },
        });
      },
      setIndex: async (json: unknown) => {
        await this.prisma.contentIngestJob.update({ where: { id: jobId }, data: { indexJson: json as Prisma.InputJsonValue } });
      },
    };

    try {
      const adapter = this.registry.get(job.sourceType);
      const problems = await adapter.ingest(jobId, job.sourceConfigJson as unknown as SourceConfig, ctx);
      this.logger.log(`Job ${jobId}: adapter produced ${problems.length} problems`);

      await ctx.updateStatus('DRAFTING');
      await this.draftAll(jobId, problems, ctx);

      await this.prisma.contentIngestJob.update({ where: { id: jobId }, data: { status: 'READY', finishedAt: new Date() } });
      this.logger.log(`Job ${jobId} READY`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      await this.prisma.contentIngestJob.update({ where: { id: jobId }, data: { status: 'FAILED', errorMessage: msg, finishedAt: new Date() } });
      this.logger.error(`Job ${jobId} FAILED: ${msg}`);
    }
  }

  /** Generate a 3-step draft per problem via LLM.
   *  Runs CONCURRENCY workers in parallel — bound is conservative for OpenAI tier-1
   *  rate limits (500 RPM / 200K TPM). Failed items still produce a PENDING row
   *  with `LLM-FAIL` label so a reviewer can retry or author manually.
   */
  private async draftAll(jobId: string, problems: NormalizedProblem[], ctx: IngestContext): Promise<void> {
    // Pre-fetch conceptLesson mapping — (ncertClass, chapterNumber) → lesson.id
    const lessonMap = new Map<string, { id: string; titleEn: string }>();
    const lessons = await this.prisma.conceptLesson.findMany({
      select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true },
    });
    for (const l of lessons) lessonMap.set(`${l.ncertClass}__${l.chapterNumber}`, { id: l.id, titleEn: l.titleEn });

    const CONCURRENCY = Number(process.env.LLM_DRAFT_CONCURRENCY ?? 5);
    let drafted = 0;
    let failed = 0;
    let cursor = 0;

    const processOne = async (i: number): Promise<void> => {
      const p = problems[i];
      const lk = p.ncertClass && p.chapterNumber ? lessonMap.get(`${p.ncertClass}__${p.chapterNumber}`) : undefined;
      const sourceLabel = [
        'AUTO',
        p.ncertClass ?? '?',
        p.chapterNumber ? `Ch${p.chapterNumber}` : '?',
        p.exerciseId ? `Ex${p.exerciseId}` : '?',
        p.qIndex ? `Q${p.qIndex}` : '?',
      ].join(' · ');

      try {
        const r = await this.llmDraft.generate({ ...p, chapterTitleHint: lk?.titleEn });
        await this.prisma.contentDraft.create({
          data: {
            ingestJobId: jobId,
            conceptLessonId: lk?.id ?? null,
            sourceLabel,
            originalText: p.text,
            sourcePage: p.sourceRef && /^page-(\d+)$/.test(p.sourceRef) ? parseInt(p.sourceRef.replace('page-', ''), 10) : null,
            aiModel: r.model,
            aiPromptVer: DRAFT_PROMPT_VERSION,
            aiResponseJson: r.payload as unknown as Prisma.InputJsonValue,
            aiTokensIn: r.tokensIn,
            aiTokensOut: r.tokensOut,
            proposedDifficulty: r.payload.difficulty,
            proposedDifficultyLevel: r.payload.difficultyLevel,
            status: 'PENDING',
          },
        });
        drafted++;
      } catch (e: unknown) {
        failed++;
        const msg = e instanceof Error ? e.message : String(e);
        this.logger.warn(`Draft failed at ${sourceLabel}: ${msg}`);
        await this.prisma.contentDraft.create({
          data: {
            ingestJobId: jobId,
            conceptLessonId: lk?.id ?? null,
            sourceLabel: `${sourceLabel} · LLM-FAIL`,
            originalText: p.text,
            aiResponseJson: undefined as unknown as Prisma.InputJsonValue,
            reviewerNote: `Auto-draft failed: ${msg.slice(0, 200)}`,
            status: 'PENDING',
          },
        });
      }
    };

    const worker = async (): Promise<void> => {
      for (;;) {
        const i = cursor++;
        if (i >= problems.length) return;
        await processOne(i);
        const done = drafted + failed;
        if (done > 0 && done % 10 === 0) {
          await ctx.updateStatus('DRAFTING', { draftsCreated: drafted });
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, problems.length) }, () => worker()));
    await ctx.updateStatus('DRAFTING', { draftsCreated: drafted });
    this.logger.log(`Job ${jobId}: drafted ${drafted} · failed ${failed} (of ${problems.length}, concurrency=${CONCURRENCY})`);
  }

  // ---------- Job listing / detail ----------

  async listJobs(opts: { status?: ContentIngestStatus; limit?: number }): Promise<unknown[]> {
    return this.prisma.contentIngestJob.findMany({
      where: { ...(opts.status ? { status: opts.status } : {}) },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(opts.limit ?? 50, 1), 200),
      select: {
        id: true, label: true, sourceType: true, status: true, createdAt: true, startedAt: true, finishedAt: true,
        totalItems: true, extractedExercises: true, extractedProblems: true, draftsCreated: true, detectedClasses: true,
        errorMessage: true,
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getJob(id: string): Promise<unknown> {
    const j = await this.prisma.contentIngestJob.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
        _count: { select: { drafts: true } },
      },
    });
    if (!j) throw new NotFoundException('job not found');
    return j;
  }

  // ---------- Draft CRUD ----------

  async listDrafts(opts: { status?: ContentDraftStatus; ncertClass?: NcertClass; chapterNumber?: number; jobId?: string; limit?: number; offset?: number }): Promise<unknown> {
    const where: Prisma.ContentDraftWhereInput = {};
    if (opts.status) where.status = opts.status;
    if (opts.jobId) where.ingestJobId = opts.jobId;
    if (opts.ncertClass || opts.chapterNumber) {
      where.conceptLesson = {
        ...(opts.ncertClass ? { ncertClass: opts.ncertClass } : {}),
        ...(opts.chapterNumber ? { chapterNumber: opts.chapterNumber } : {}),
      };
    }
    const [total, items] = await this.prisma.$transaction([
      this.prisma.contentDraft.count({ where }),
      this.prisma.contentDraft.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(opts.limit ?? 50, 1), 200),
        skip: Math.max(opts.offset ?? 0, 0),
        select: {
          id: true, sourceLabel: true, status: true, createdAt: true,
          proposedDifficulty: true, proposedDifficultyLevel: true,
          conceptLesson: { select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true } },
          reviewerNote: true,
          aiTokensIn: true, aiTokensOut: true,
        },
      }),
    ]);
    return { total, items };
  }

  async getDraft(id: string): Promise<unknown> {
    const d = await this.prisma.contentDraft.findUnique({
      where: { id },
      include: { conceptLesson: { select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true, unitId: true } }, ingestJob: { select: { id: true, label: true } }, reviewedBy: { select: { id: true, name: true, email: true } } },
    });
    if (!d) throw new NotFoundException('draft not found');
    return d;
  }

  async updateDraft(id: string, patch: { editedJson?: unknown; conceptLessonId?: string | null; reviewerNote?: string }): Promise<unknown> {
    const d = await this.prisma.contentDraft.findUnique({ where: { id }, select: { status: true } });
    if (!d) throw new NotFoundException('draft not found');
    if (d.status === 'PUBLISHED') throw new BadRequestException('Published drafts cannot be edited');
    return this.prisma.contentDraft.update({
      where: { id },
      data: {
        ...(patch.editedJson !== undefined ? { editedJson: patch.editedJson as Prisma.InputJsonValue } : {}),
        ...(patch.conceptLessonId !== undefined ? { conceptLessonId: patch.conceptLessonId } : {}),
        ...(patch.reviewerNote !== undefined ? { reviewerNote: patch.reviewerNote } : {}),
      },
    });
  }

  async approveDraft(id: string, reviewerId: string, alsoPublish = true): Promise<{ status: string; problemId?: string }> {
    const d = await this.prisma.contentDraft.findUnique({ where: { id } });
    if (!d) throw new NotFoundException('draft not found');
    if (d.status === 'PUBLISHED') throw new BadRequestException('Already published');
    if (d.status === 'REJECTED') throw new BadRequestException('Reset the rejected draft to PENDING, edit it, then approve');

    await this.prisma.contentDraft.update({
      where: { id },
      data: { status: 'APPROVED', reviewedById: reviewerId, reviewedAt: new Date() },
    });
    if (!alsoPublish) return { status: 'APPROVED' };

    const { problemId } = await this.publisher.publish(id);
    return { status: 'PUBLISHED', problemId };
  }

  async rejectDraft(id: string, reviewerId: string, note?: string): Promise<unknown> {
    return this.prisma.contentDraft.update({
      where: { id },
      data: { status: 'REJECTED', reviewedById: reviewerId, reviewedAt: new Date(), reviewerNote: note ?? null },
    });
  }

  /** Regenerate the LLM draft (triggered when a reviewer hits 'regenerate'). */
  async regenerateDraft(id: string): Promise<unknown> {
    const d = await this.prisma.contentDraft.findUnique({ where: { id }, include: { conceptLesson: { select: { titleEn: true, ncertClass: true, chapterNumber: true } } } });
    if (!d) throw new NotFoundException('draft not found');
    if (d.status === 'PUBLISHED') throw new BadRequestException('Already published');

    const r = await this.llmDraft.generate({
      ncertClass: d.conceptLesson?.ncertClass,
      chapterNumber: d.conceptLesson?.chapterNumber,
      chapterTitleHint: d.conceptLesson?.titleEn,
      text: d.originalText,
    });
    return this.prisma.contentDraft.update({
      where: { id },
      data: {
        aiModel: r.model,
        aiPromptVer: DRAFT_PROMPT_VERSION,
        aiResponseJson: r.payload as unknown as Prisma.InputJsonValue,
        aiTokensIn: r.tokensIn,
        aiTokensOut: r.tokensOut,
        proposedDifficulty: r.payload.difficulty,
        proposedDifficultyLevel: r.payload.difficultyLevel,
        editedJson: undefined as unknown as Prisma.InputJsonValue, // discard the edited version
        status: 'PENDING',
      },
    });
  }
}

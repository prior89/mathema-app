/* /admin/ingest/* — PDF upload / external API registration / job monitoring / draft review and publish. */
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createHash } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from '../admin/admin-audit.interceptor';
import { ContentIngestService } from './content-ingest.service';
import type { ContentDraftStatus, ContentIngestStatus, NcertClass } from '@prisma/client';
import type { Request } from 'express';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'content-ingest');

type AuthedRequest = Request & { user?: { id: string } };

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin/ingest')
export class ContentIngestController {
  constructor(private readonly svc: ContentIngestService) {}

  // ---------- Create new job ----------

  /** PDF upload → create ingest job. multer writes to disk first, then we hash sha256. */
  @Post('pdf')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: async (_req, _file, cb) => { await fs.mkdir(UPLOAD_DIR, { recursive: true }); cb(null, UPLOAD_DIR); },
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`),
    }),
    limits: { fileSize: 250 * 1024 * 1024 },
  }))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthedRequest,
    @Body('label') label?: string,
  ): Promise<{ id: string }> {
    const userId = req.user!.id;
    const buf = await fs.readFile(file.path);
    const sha256 = createHash('sha256').update(buf).digest('hex');
    return this.svc.createJob({
      userId,
      sourceType: 'PDF',
      sourceConfig: { type: 'PDF', fileName: file.originalname, fileSize: file.size, sha256, filePath: file.path },
      label: label ?? file.originalname,
    });
  }

  /** Register an external HTTP API as a source → create job. body: { url, method?, authRef?, queryJson?, bodyJson?, label }. */
  @Post('http-api')
  async createApiJob(
    @Req() req: AuthedRequest,
    @Body() body: { url: string; method?: 'GET' | 'POST'; authRef?: string; queryJson?: string; bodyJson?: string; label?: string },
  ): Promise<{ id: string }> {
    const userId = req.user!.id;
    return this.svc.createJob({
      userId,
      sourceType: 'HTTP_API',
      sourceConfig: { type: 'HTTP_API', url: body.url, method: body.method, authRef: body.authRef, queryJson: body.queryJson, bodyJson: body.bodyJson },
      label: body.label ?? body.url,
    });
  }

  /** JSON bulk file (pre-normalized) — filePath points at a file already placed on the server. */
  @Post('json-bulk')
  async createJsonJob(
    @Req() req: AuthedRequest,
    @Body() body: { filePath: string; label?: string },
  ): Promise<{ id: string }> {
    const userId = req.user!.id;
    return this.svc.createJob({
      userId,
      sourceType: 'JSON_BULK',
      sourceConfig: { type: 'JSON_BULK', filePath: body.filePath },
      label: body.label ?? path.basename(body.filePath),
    });
  }

  // ---------- Job listing ----------

  @Get('jobs')
  listJobs(@Query('status') status?: ContentIngestStatus, @Query('limit') limit?: string): Promise<unknown[]> {
    return this.svc.listJobs({ status, limit: limit ? parseInt(limit, 10) : undefined }) as Promise<unknown[]>;
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string): Promise<unknown> {
    return this.svc.getJob(id);
  }

  // ---------- Drafts ----------

  @Get('drafts')
  listDrafts(
    @Query('status') status?: ContentDraftStatus,
    @Query('ncertClass') ncertClass?: NcertClass,
    @Query('chapterNumber') chapterNumber?: string,
    @Query('jobId') jobId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<unknown> {
    return this.svc.listDrafts({
      status,
      ncertClass,
      chapterNumber: chapterNumber ? parseInt(chapterNumber, 10) : undefined,
      jobId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('drafts/:id')
  getDraft(@Param('id') id: string): Promise<unknown> {
    return this.svc.getDraft(id);
  }

  @Patch('drafts/:id')
  patchDraft(
    @Param('id') id: string,
    @Body() body: { editedJson?: unknown; conceptLessonId?: string | null; reviewerNote?: string },
  ): Promise<unknown> {
    return this.svc.updateDraft(id, body);
  }

  @Post('drafts/:id/approve')
  approveDraft(
    @Param('id') id: string,
    @Req() req: AuthedRequest,
    @Body() body?: { publish?: boolean },
  ): Promise<{ status: string; problemId?: string }> {
    return this.svc.approveDraft(id, req.user!.id, body?.publish !== false);
  }

  @Post('drafts/:id/reject')
  rejectDraft(
    @Param('id') id: string,
    @Req() req: AuthedRequest,
    @Body() body?: { note?: string },
  ): Promise<unknown> {
    return this.svc.rejectDraft(id, req.user!.id, body?.note);
  }

  @Post('drafts/:id/regenerate')
  regenerateDraft(@Param('id') id: string): Promise<unknown> {
    return this.svc.regenerateDraft(id);
  }
}

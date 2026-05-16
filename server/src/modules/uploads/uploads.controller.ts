/* POST /uploads/problem-image — student uploads a single math problem photo or PDF;
 * server runs vision LLM → analysis JSON → 3-step MC draft (PENDING ContentDraft).
 */
import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadsService, UploadResult } from './uploads.service';
import type { Request } from 'express';

type AuthedRequest = Request & { user?: { id: string } };

const MAX_BYTES = 12 * 1024 * 1024; // 12MB — student phone photos comfortably fit; OpenAI vision max ~20MB

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly svc: UploadsService, private readonly config: ConfigService) {}

  @Post('problem-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (_req, _file, cb) => {
          const base = process.env.STORAGE_LOCAL_DIR ?? './uploads';
          const dir = path.resolve(process.cwd(), base, 'student-uploads');
          await fs.mkdir(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          cb(null, `${Date.now()}-${safe}`);
        },
      }),
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async uploadProblemImage(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: AuthedRequest,
  ): Promise<UploadResult> {
    if (!file) throw new BadRequestException('file is required (multipart field "file")');
    const userId = req.user!.id;
    const buffer = await fs.readFile(file.path);
    try {
      return await this.svc.analyzeAndDraft({
        userId,
        buffer,
        mimeType: file.mimetype,
        originalName: file.originalname,
      });
    } finally {
      // Best-effort cleanup — we keep the parsed draft, not the raw photo.
      fs.unlink(file.path).catch(() => undefined);
    }
  }
}

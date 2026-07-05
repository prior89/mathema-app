import { BadRequestException, Body, Controller, Get, Logger, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FreeTierSolverQuotaGuard } from '../billing/free-tier-solver-quota.guard';
import { OcrDailyQuotaGuard } from '../billing/ocr-daily-quota.guard';
import { OcrService } from '../../infrastructure/ocr/ocr.service';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';
import { MathHelperService } from './math-helper.service';

const FILE_INTERCEPTOR_OPTIONS: MulterOptions = {
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    cb(ok ? null : new BadRequestException('Only image/* or PDF files are supported'), ok);
  },
};

@UseGuards(JwtAuthGuard)
@Controller('math-helper')
export class MathHelperController {
  private readonly logger = new Logger(MathHelperController.name);

  constructor(
    private readonly service: MathHelperService,
    private readonly ocr: OcrService,
  ) {}

  // CI smoke test target — proxies through to the math-helper container's
  // /health so deploy scripts can verify the revision is up.
  // Note: GET /health is intentionally NOT under FreeTierSolverQuotaGuard.
  @Get('health')
  health() {
    return this.service.health();
  }

  // Text-only solve. Kept for verify-math-helper.sh and as a fallback path
  // for clients that already have the question text; production UI uses
  // /math-helper/ocr-solve which calls this internally after OCR.
  // JwtAuthGuard MUST run before FreeTierSolverQuotaGuard so req.user is
  // populated when the quota guard reads it.
  @Post('solve')
  @UseGuards(JwtAuthGuard, FreeTierSolverQuotaGuard)
  solve(@CurrentUser('id') userId: string, @Body() dto: SolveMathHelperDto) {
    return this.service.solve(userId, dto);
  }

  // OCR-only endpoint — UploadProblemModal's 2-step flow (Photomath-style
  // pattern, validated against ChatGPT progressive disclosure). Returns the
  // extracted text in 1-3 seconds so the user sees their photo was recognised
  // before the 5-15 second solve LLM call begins.
  //
  // OCR does NOT count against the solver credit — a misfired upload / retake
  // must not burn a solve. But the endpoint calls paid Mathpix + GPT-vision, so
  // OcrDailyQuotaGuard applies a separate, much looser daily ceiling (premium
  // bypasses) purely to stop a logged-in client from looping it unboundedly.
  @Post('ocr')
  @UseGuards(JwtAuthGuard, OcrDailyQuotaGuard)
  @UseInterceptors(FileInterceptor('file', FILE_INTERCEPTOR_OPTIONS))
  async ocrOnly(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('file is required (multipart field "file")');
    const started = Date.now();
    try {
      const result = await this.ocr.extract(file);
      this.logger.log(`OCR extracted ${file.originalname} (${file.mimetype}, ${file.size} bytes) in ${Date.now() - started}ms`);
      return result;
    } catch (e) {
      this.logger.warn(`OCR failed for ${file.originalname} (${file.mimetype}, ${file.size} bytes) after ${Date.now() - started}ms: ${(e as Error)?.message ?? e}`);
      throw e;
    }
  }

  @Post('ocr-solve')
  @UseGuards(JwtAuthGuard, FreeTierSolverQuotaGuard)
  @UseInterceptors(FileInterceptor('file', FILE_INTERCEPTOR_OPTIONS))
  ocrSolve(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('classLevel') classLevel?: string,
    @Body('studentAnswer') studentAnswer?: string,
    @Body('durationSec') durationSec?: string,
  ) {
    if (!file) throw new BadRequestException('file is required (multipart field "file")');
    const parsedClassLevel = classLevel ? Number(classLevel) : undefined;
    if (parsedClassLevel !== undefined && (!Number.isInteger(parsedClassLevel) || parsedClassLevel < 7 || parsedClassLevel > 12)) {
      throw new BadRequestException('classLevel must be an integer between 7 and 12');
    }
    const parsedDurationSec = durationSec ? Number(durationSec) : undefined;
    if (parsedDurationSec !== undefined && (!Number.isInteger(parsedDurationSec) || parsedDurationSec < 0 || parsedDurationSec > 7200)) {
      throw new BadRequestException('durationSec must be an integer between 0 and 7200');
    }
    return this.service.ocrSolve(userId, file, {
      classLevel: parsedClassLevel,
      studentAnswer,
      durationSec: parsedDurationSec,
    });
  }
}

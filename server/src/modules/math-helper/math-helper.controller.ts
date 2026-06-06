import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FreeTierSolverQuotaGuard } from '../billing/free-tier-solver-quota.guard';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';
import { MathHelperService } from './math-helper.service';

@UseGuards(JwtAuthGuard)
@Controller('math-helper')
export class MathHelperController {
  constructor(private readonly service: MathHelperService) {}

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

  @Post('ocr-solve')
  @UseGuards(JwtAuthGuard, FreeTierSolverQuotaGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 12 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      cb(ok ? null : new BadRequestException('Only image/* or PDF files are supported'), ok);
    },
  }))
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

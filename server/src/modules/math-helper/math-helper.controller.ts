import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChapterTestDto, WeeklyAssessmentDto } from './dto/assessment.dto';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';
import { MathHelperService } from './math-helper.service';

@UseGuards(JwtAuthGuard)
@Controller('math-helper')
export class MathHelperController {
  constructor(private readonly service: MathHelperService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Post('solve')
  solve(@CurrentUser('id') userId: string, @Body() dto: SolveMathHelperDto) {
    return this.service.solve(userId, dto);
  }

  @Post('ocr-solve')
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
  ) {
    if (!file) throw new BadRequestException('file is required (multipart field "file")');
    const parsedClassLevel = classLevel ? Number(classLevel) : undefined;
    if (parsedClassLevel !== undefined && (!Number.isInteger(parsedClassLevel) || parsedClassLevel < 7 || parsedClassLevel > 12)) {
      throw new BadRequestException('classLevel must be an integer between 7 and 12');
    }
    return this.service.ocrSolve(userId, file, { classLevel: parsedClassLevel, studentAnswer });
  }

  @Post('assessments/chapter-test')
  chapterTest(@CurrentUser('id') userId: string, @Body() dto: ChapterTestDto) {
    return this.service.chapterTest(userId, dto);
  }

  @Post('assessments/weekly')
  weekly(@CurrentUser('id') userId: string, @Body() dto: WeeklyAssessmentDto) {
    return this.service.weekly(userId, dto);
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

  @Post('assessments/chapter-test')
  chapterTest(@CurrentUser('id') userId: string, @Body() dto: ChapterTestDto) {
    return this.service.chapterTest(userId, dto);
  }

  @Post('assessments/weekly')
  weekly(@CurrentUser('id') userId: string, @Body() dto: WeeklyAssessmentDto) {
    return this.service.weekly(userId, dto);
  }
}

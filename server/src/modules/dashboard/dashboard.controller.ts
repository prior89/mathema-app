import { Controller, Get, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// 2026-05-27: dashboard endpoints fire on every Home mount + react-query
// refetch. Same throttle-false-positive risk as the mastery surface; skip.
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // 대시보드 헤더 4 stat 통합:
  //  오늘 학습 / 연속 학습 / 주간 정답률 / 예상 등급
  @Get('summary')
  summary(@CurrentUser('id') userId: string) {
    return this.service.summary(userId);
  }

  /** Per-chapter progress + accuracy — top 10 chapters with recent activity. */
  @Get('chapter-progress')
  chapterProgress(@CurrentUser('id') userId: string) {
    return this.service.chapterProgress(userId);
  }
}

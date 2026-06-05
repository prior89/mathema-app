import { Module } from '@nestjs/common';
import { AiCoachController } from './ai-coach.controller';
import { AiCoachService } from './ai-coach.service';
import { ReportsModule } from '../reports/reports.module';

/**
 * AI 코치 — 진단/패턴/멘토 메시지/Error DNA.
 * 모든 외부 호출은 AiService(global facade) 만 사용한다.
 *
 * ReportsModule import: mentor message reuses WeeklyStatsService so the
 * mentor card and the /reports/current stats grid always show the same
 * accuracy/problemsSolved numbers for the active ISO week.
 */
@Module({
  imports: [ReportsModule],
  controllers: [AiCoachController],
  providers: [AiCoachService],
  exports: [AiCoachService],
})
export class AiCoachModule {}

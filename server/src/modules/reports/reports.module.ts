import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { WeeklyReportService } from './weekly-report.service';
import { WeeklyStatsService } from './weekly-stats.service';
import { WeeklyReportsAliasController } from './weekly-reports-alias.controller';

@Module({
  controllers: [ReportsController, WeeklyReportsAliasController],
  providers: [ReportsService, ReportsRepository, WeeklyReportService, WeeklyStatsService],
  exports: [ReportsService, WeeklyReportService, WeeklyStatsService],
})
export class ReportsModule {}

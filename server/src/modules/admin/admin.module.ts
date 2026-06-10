import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LearningMetricsService } from './learning-metrics.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from './admin-audit.interceptor';
import { LegacySeedCleanupBootstrap } from './legacy-seed-cleanup.bootstrap';
import { BillingModule } from '../billing/billing.module';
import { ConceptLessonsModule } from '../concept-lessons/concept-lessons.module';
import { AdminBillingController } from './admin-billing.controller';

@Module({
  // ConceptLessonsModule exports ConceptLessonsService — used by the
  // POST /admin/prewarm-mastery endpoint that tops up under-stocked
  // chapters to the 20-problem multi-step invariant via LLM.
  imports: [ConceptLessonsModule, BillingModule],
  controllers: [AdminController, AdminBillingController],
  providers: [
    AdminService,
    LearningMetricsService,
    AdminGuard,
    AdminAuditInterceptor,
    LegacySeedCleanupBootstrap,
  ],
  exports: [LearningMetricsService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from './admin-audit.interceptor';
import { LegacySeedCleanupBootstrap } from './legacy-seed-cleanup.bootstrap';
import { ConceptLessonsModule } from '../concept-lessons/concept-lessons.module';

@Module({
  // ConceptLessonsModule exports ConceptLessonsService — used by the
  // POST /admin/prewarm-mastery endpoint that tops up under-stocked
  // chapters to the 20-problem multi-step invariant via LLM.
  imports: [ConceptLessonsModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminGuard,
    AdminAuditInterceptor,
    LegacySeedCleanupBootstrap,
  ],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserAwareThrottlerGuard } from './common/guards/user-aware-throttler.guard';

// config
import appConfig from './config/configuration';
import dbConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import aiApiConfig from './config/ai-api.config';
import storageConfig from './config/storage.config';
import mathHelperConfig from './config/math-helper.config';
import ocrConfig from './config/ocr.config';
import playBillingConfig from './config/play-billing.config';
import rtdnConfig from './config/rtdn.config';

// infrastructure (전역)
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { MathModule } from './infrastructure/math/math.module';
import { BullSharedModule } from './infrastructure/bull/bull-shared.module';

// 도메인 모듈 — UI 화면별 1:1
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { ConceptLessonsModule } from './modules/concept-lessons/concept-lessons.module';
import { KoreanConceptLessonsModule } from './modules/korean-concept-lessons/korean-concept-lessons.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { WrongNotesModule } from './modules/wrong-notes/wrong-notes.module';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { StudySessionsModule } from './modules/study-sessions/study-sessions.module';
import { MockExamsModule } from './modules/mock-exams/mock-exams.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { MasteryModule } from './modules/mastery/mastery.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AiCoachModule } from './modules/ai-coach/ai-coach.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { BullBoardModule } from './modules/admin/bull-board.module';
import { PushModule } from './modules/push/push.module';
import { PrivacyModule } from './modules/privacy/privacy.module';
import { LlmAnalysisModule } from './modules/llm-analysis/llm-analysis.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { StudentsModule } from './modules/students/students.module';
import { DiagnosticModule } from './modules/diagnostic/diagnostic.module';
import { ContentIngestModule } from './modules/content-ingest/content-ingest.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { MathHelperModule } from './modules/math-helper/math-helper.module';
import { BillingModule } from './modules/billing/billing.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, redisConfig, jwtConfig, aiApiConfig, storageConfig, mathHelperConfig, ocrConfig, playBillingConfig, rtdnConfig],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    // Global throttle: 240 req/min/user in prod, 10000/min in dev (so that a
    // dogfooding 3-step × 20-problem mastery run, paired with react-query
    // refetches on every state change, doesn't trip the limiter). Bucketing
    // is per-user-id (see UserAwareThrottlerGuard) — IP-only would lock out
    // every student behind a shared NAT, and every dev tab on 127.0.0.1.
    // Auth endpoints still apply their own stricter @Throttle({ auth: ... })
    // limits on top of this.
    ThrottlerModule.forRoot([{
      ttl: 60_000,
      limit: process.env.NODE_ENV === 'production' ? 240 : 10_000,
    }]),

    // infra
    PrismaModule,
    RedisModule,
    BullSharedModule,
    AiModule,
    StorageModule,
    MailModule,
    MathModule,

    // 도메인 (의존성 방향: 위 → 아래)
    AuthModule,
    UsersModule,
    CurriculumModule,
    ConceptLessonsModule,
    KoreanConceptLessonsModule,
    ProblemsModule,
    AttemptsModule,
    WrongNotesModule,
    StudySessionsModule,
    MockExamsModule,
    MasteryModule,
    ActivityModule,
    RecommendationsModule,
    AiCoachModule,
    ReportsModule,
    DashboardModule,
    HealthModule,
    AnalyticsModule,
    AdminModule,
    PushModule,
    PrivacyModule,
    LlmAnalysisModule,
    BullBoardModule,
    FeedbackModule,
    StudentsModule,
    DiagnosticModule,
    ContentIngestModule,
    UploadsModule,
    MathHelperModule,
    BillingModule,
    FeatureFlagsModule,
  ],
  providers: [
    // P1-3 + 2026-05-27 fix: global rate-limit, bucketed per-user (JWT.sub)
    // rather than per-IP. IP-only bucketing collapsed every dogfooder + NAT
    // student onto one counter — a single user finishing a 20-problem
    // mastery run could lock out the whole 127.0.0.1 cluster. The custom
    // guard reads the Bearer token's `sub`/`id`/`userId` and keys on
    // `u:<id>`, falling back to `ip:<addr>` for unauthenticated routes
    // (e.g., /auth/login itself, /health/*). Per-route @Throttle() and
    // @SkipThrottle() decorators still override per-endpoint.
    { provide: APP_GUARD, useClass: UserAwareThrottlerGuard },
  ],
})
export class AppModule {}

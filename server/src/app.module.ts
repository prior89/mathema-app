import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// config
import appConfig from './config/configuration';
import dbConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import aiApiConfig from './config/ai-api.config';
import storageConfig from './config/storage.config';
import mathHelperConfig from './config/math-helper.config';
import mathpixConfig from './config/mathpix.config';

// infrastructure (전역)
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { MathModule } from './infrastructure/math/math.module';

// 도메인 모듈 — UI 화면별 1:1
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { ConceptLessonsModule } from './modules/concept-lessons/concept-lessons.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, redisConfig, jwtConfig, aiApiConfig, storageConfig, mathHelperConfig, mathpixConfig],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),

    // infra
    PrismaModule,
    RedisModule,
    AiModule,
    StorageModule,
    MailModule,
    MathModule,

    // 도메인 (의존성 방향: 위 → 아래)
    AuthModule,
    UsersModule,
    CurriculumModule,
    ConceptLessonsModule,
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
  ],
  providers: [
    // P1-3: global rate-limit. forRoot([{ ttl: 60_000, limit: 120 }]) above
    // only registers the module; without APP_GUARD only controllers with an
    // explicit @UseGuards(ThrottlerGuard) get throttled. AuthController
    // already has it, but the rest of the API (attempts, mock-exams, etc.)
    // was wide open. With APP_GUARD every endpoint inherits the global
    // budget; per-route @Throttle() decorators still override per-endpoint
    // (e.g. /auth/login at 5/min via a stricter named throttler).
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

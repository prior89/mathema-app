import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { FocusOnMistakesStrategy } from './strategies/focus-on-mistakes.strategy';
import { ReinforceWeaknessStrategy } from './strategies/reinforce-weakness.strategy';
import { MaintainStrengthStrategy } from './strategies/maintain-strength.strategy';
import { StudyBalanceService } from './services/study-balance.service';
import { AdaptiveNextProblemService } from './services/adaptive-next-problem.service';
import { SimilarProblemService } from './services/similar-problem.service';
import { ReviewScheduleService } from './services/review-schedule.service';
import { RecommendationMetricsService } from './services/recommendation-metrics.service';
import { FirstSessionPlanService } from './first-session-plan.service';
import { KrColdStartStrategy } from './strategies/kr-cold-start.strategy';
import { KrFocusOnMistakesStrategy } from './strategies/kr-focus-on-mistakes.strategy';
import { KrReinforceWeaknessStrategy } from './strategies/kr-reinforce-weakness.strategy';
import { KrMaintainStrengthStrategy } from './strategies/kr-maintain-strength.strategy';
import { KrChapterStatsService } from './services/kr-chapter-stats.service';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [FeatureFlagsModule, BillingModule],
  controllers: [RecommendationsController],
  providers: [
    FirstSessionPlanService,
    RecommendationsService,
    KrColdStartStrategy,
    KrFocusOnMistakesStrategy,
    KrReinforceWeaknessStrategy,
    KrMaintainStrengthStrategy,
    KrChapterStatsService,
    FocusOnMistakesStrategy,
    ReinforceWeaknessStrategy,
    MaintainStrengthStrategy,
    StudyBalanceService,
    AdaptiveNextProblemService,
    SimilarProblemService,
    ReviewScheduleService,
    RecommendationMetricsService,
  ],
  exports: [
    FirstSessionPlanService,
    RecommendationsService,
    StudyBalanceService,
    AdaptiveNextProblemService,
    SimilarProblemService,
    ReviewScheduleService,
    RecommendationMetricsService,
  ],
})
export class RecommendationsModule {}

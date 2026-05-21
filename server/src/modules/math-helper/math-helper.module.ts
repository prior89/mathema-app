import { Module } from '@nestjs/common';
import { MathpixModule } from '../../infrastructure/mathpix/mathpix.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { BillingModule } from '../billing/billing.module';
import { ContentIngestModule } from '../content-ingest/content-ingest.module';
import { MathHelperController } from './math-helper.controller';
import { MathHelperService } from './math-helper.service';

@Module({
  // ContentIngestModule exports LlmDraftService so we can reuse the
  // single-step (5-choice) generator on AI-Solver-uploaded problems.
  // BillingModule exports FreeTierSolverQuotaGuard + its deps for the
  // Free-tier 8/day daily cap applied per-POST below.
  imports: [AttemptsModule, MathpixModule, ContentIngestModule, BillingModule],
  controllers: [MathHelperController],
  providers: [MathHelperService],
})
export class MathHelperModule {}

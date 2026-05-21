import { Module } from '@nestjs/common';
import { MathpixModule } from '../../infrastructure/mathpix/mathpix.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { ContentIngestModule } from '../content-ingest/content-ingest.module';
import { MathHelperController } from './math-helper.controller';
import { MathHelperService } from './math-helper.service';

@Module({
  // ContentIngestModule exports LlmDraftService so we can reuse the
  // single-step (5-choice) generator on AI-Solver-uploaded problems.
  imports: [AttemptsModule, MathpixModule, ContentIngestModule],
  controllers: [MathHelperController],
  providers: [MathHelperService],
})
export class MathHelperModule {}

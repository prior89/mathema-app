import { Module } from '@nestjs/common';
import { ConceptLessonsController } from './concept-lessons.controller';
import { ConceptLessonsService } from './concept-lessons.service';
import { ConceptLessonsBootstrap } from './concept-lessons.bootstrap';
import { ConceptsBootstrap } from './concepts.bootstrap';
import { ContentIngestModule } from '../content-ingest/content-ingest.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  // ContentIngestModule exports LlmDraftService — practiceProblems uses it
  // in multi-step mode to top up under-seeded chapters to the 20-problem
  // invariant Mastery promises.
  imports: [ContentIngestModule, AchievementsModule, BillingModule],
  controllers: [ConceptLessonsController],
  providers: [ConceptLessonsService, ConceptLessonsBootstrap, ConceptsBootstrap],
  exports: [ConceptLessonsService],
})
export class ConceptLessonsModule {}

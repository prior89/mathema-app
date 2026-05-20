import { Module } from '@nestjs/common';
import { MockExamsController } from './mock-exams.controller';
import { MockExamsService } from './mock-exams.service';
import { MockExamsRepository } from './mock-exams.repository';
import { GradingService } from './services/grading.service';
import { AiRecommendExamService } from './services/ai-recommend-exam.service';
import { WrongNotesModule } from '../wrong-notes/wrong-notes.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { ContentIngestModule } from '../content-ingest/content-ingest.module';

@Module({
  // ContentIngestModule exports LlmDraftService — Study tab's startChapter
  // uses it to top up single-step problem pools when a chapter doesn't yet
  // have enough seeded variations.
  imports: [WrongNotesModule, AttemptsModule, ContentIngestModule],
  controllers: [MockExamsController],
  providers: [MockExamsService, MockExamsRepository, GradingService, AiRecommendExamService],
  exports: [MockExamsService],
})
export class MockExamsModule {}

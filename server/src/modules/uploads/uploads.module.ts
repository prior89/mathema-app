import { Module } from '@nestjs/common';
import { AiModule } from '../../infrastructure/ai/ai.module';
import { ContentIngestModule } from '../content-ingest/content-ingest.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

/**
 * Student-facing upload pipeline: student uploads a problem photo/PDF →
 * GPT-4o-mini vision extracts the problem text → LlmDraftService generates a
 * 3-step MC ContentDraft (PENDING) for human review before publishing.
 */
@Module({
  imports: [AiModule, ContentIngestModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}

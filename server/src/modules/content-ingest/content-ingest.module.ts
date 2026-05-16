import { Module } from '@nestjs/common';
import { AiModule } from '../../infrastructure/ai/ai.module';
import { ContentIngestController } from './content-ingest.controller';
import { ContentIngestService } from './content-ingest.service';
import { LlmDraftService } from './llm-draft.service';
import { DraftPublisher } from './draft-publisher.service';
import { SourceRegistry } from './source-registry.service';
import { PdfSourceAdapter } from './adapters/pdf-source.adapter';
import { HttpApiSourceAdapter } from './adapters/http-api-source.adapter';
import { JsonBulkSourceAdapter } from './adapters/json-bulk-source.adapter';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  imports: [AiModule],
  controllers: [ContentIngestController],
  providers: [
    ContentIngestService,
    LlmDraftService,
    DraftPublisher,
    SourceRegistry,
    PdfSourceAdapter,
    HttpApiSourceAdapter,
    JsonBulkSourceAdapter,
    AdminGuard,
  ],
  exports: [LlmDraftService],
})
export class ContentIngestModule {}

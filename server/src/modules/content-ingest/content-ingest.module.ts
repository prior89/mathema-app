import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from '../../infrastructure/ai/ai.module';
import { ContentIngestController } from './content-ingest.controller';
import { ContentIngestService } from './content-ingest.service';
import { ContentIngestQueueService } from './content-ingest-queue.service';
import { ContentIngestProcessor } from './content-ingest.processor';
import { CONTENT_INGEST_QUEUE } from './content-ingest.queue';
import { LlmDraftService } from './llm-draft.service';
import { DraftPublisher } from './draft-publisher.service';
import { SourceRegistry } from './source-registry.service';
import { PdfSourceAdapter } from './adapters/pdf-source.adapter';
import { HttpApiSourceAdapter } from './adapters/http-api-source.adapter';
import { JsonBulkSourceAdapter } from './adapters/json-bulk-source.adapter';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from '../admin/admin-audit.interceptor';

@Module({
  imports: [
    AiModule,
    // Redis connection comes from the global BullSharedModule; here we only
    // register the queue name so InjectQueue('content-ingest') resolves.
    BullModule.registerQueue({ name: CONTENT_INGEST_QUEUE }),
  ],
  controllers: [ContentIngestController],
  providers: [
    ContentIngestService,
    ContentIngestQueueService,
    ContentIngestProcessor,
    LlmDraftService,
    DraftPublisher,
    SourceRegistry,
    PdfSourceAdapter,
    HttpApiSourceAdapter,
    JsonBulkSourceAdapter,
    AdminGuard,
    // P1-6: provide AdminAuditInterceptor locally so the controller can
    // @UseInterceptors it. AdminModule provides the same class for its own
    // controller; having two independent provider instances is fine -- the
    // interceptor is stateless and only writes to AdminAccessLog.
    AdminAuditInterceptor,
  ],
  exports: [LlmDraftService],
})
export class ContentIngestModule {}

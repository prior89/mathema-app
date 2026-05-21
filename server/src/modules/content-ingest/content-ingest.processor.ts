import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ContentIngestService } from './content-ingest.service';
import {
  CONTENT_INGEST_QUEUE,
  ContentIngestJobData,
} from './content-ingest.queue';

/**
 * BullMQ worker — `content-ingest` queue.
 *
 *   Flow:
 *     - ContentIngestService.runJob(jobId) owns the full pipeline (adapter
 *       ingest → LLM drafts → ContentDraft rows → ContentIngestJob.status
 *       transitions). The worker is a thin wrapper that turns a queue job
 *       into that call so BullMQ can drive retries / backoff / DLQ.
 *
 *   Note:
 *     - runJob() catches its own errors and writes status=FAILED with
 *       errorMessage onto the ContentIngestJob row. To let BullMQ surface
 *       genuine infrastructure failures (Redis hiccup, OOM, etc.) we DO NOT
 *       try/catch here — those exceptions bubble up and the queue retries.
 */
@Processor(CONTENT_INGEST_QUEUE)
export class ContentIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(ContentIngestProcessor.name);

  constructor(private readonly service: ContentIngestService) {
    super();
  }

  async process(job: Job<ContentIngestJobData>): Promise<void> {
    this.logger.debug(`run job ${job.data.jobId} attempt=${job.attemptsMade + 1}`);
    await this.service.runJob(job.data.jobId);
  }
}

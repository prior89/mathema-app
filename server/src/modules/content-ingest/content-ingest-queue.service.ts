import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  CONTENT_INGEST_QUEUE,
  CONTENT_INGEST_PROCESS_JOB,
  ContentIngestJobData,
} from './content-ingest.queue';

/**
 * Enqueue helper for the content-ingest pipeline.
 *
 *   - attempts=3 with exponential backoff (5s base) — adapter steps (PDF
 *     parsing / HTTP fetch / OpenAI drafts) can transiently fail.
 *   - removeOnComplete=1000 — keep recent completions visible in Bull Board
 *     for ops triage.
 *   - removeOnFail=false — failed jobs stay in the queue as a dead-letter
 *     for manual inspection; the corresponding ContentIngestJob row keeps
 *     status=FAILED with errorMessage as the durable record.
 */
@Injectable()
export class ContentIngestQueueService {
  constructor(
    @InjectQueue(CONTENT_INGEST_QUEUE) private readonly queue: Queue,
  ) {}

  async enqueue(jobId: string): Promise<string> {
    const job = await this.queue.add(
      CONTENT_INGEST_PROCESS_JOB,
      { jobId } as ContentIngestJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 1000,
        removeOnFail: false,
      },
    );
    return job.id!;
  }
}

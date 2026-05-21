/**
 * BullMQ queue constants for the content-ingest pipeline.
 *
 *   Queue name 'content-ingest'.
 *   Job name 'process' — payload: { jobId } where jobId = ContentIngestJob.id.
 */
export const CONTENT_INGEST_QUEUE = 'content-ingest';
export const CONTENT_INGEST_PROCESS_JOB = 'process';

export interface ContentIngestJobData {
  /** ContentIngestJob row id — the worker uses this to fetch the source config and run the pipeline. */
  jobId: string;
}

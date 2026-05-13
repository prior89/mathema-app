/* SourceAdapter interface — PDF / HTTP_API / JSON_BULK / CSV all emit the same shape. */
import type { ContentSourceType } from '@prisma/client';
import type { IngestContext, NormalizedProblem, SourceConfig } from '../types';

export interface SourceAdapter {
  /// The source type this adapter handles.
  readonly type: ContentSourceType;

  /// Digest used to prevent re-running the same source. PDF=sha256, API=hash of url+query, etc.
  computeDigest(config: SourceConfig): Promise<string>;

  /// source → normalized NormalizedProblem array. Progress is reported via ctx.
  ingest(jobId: string, config: SourceConfig, ctx: IngestContext): Promise<NormalizedProblem[]>;
}

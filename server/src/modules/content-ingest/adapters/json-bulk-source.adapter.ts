/* JSON Bulk SourceAdapter — direct upload of an already-normalized NormalizedProblem array.
 *   The JSON at filePath must be one of:
 *     - NormalizedProblem[]
 *     - { items: NormalizedProblem[] }
 *     - { problems: NormalizedProblem[] }   (NCERT extraction pipeline output shape)
 */
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { ContentSourceType } from '@prisma/client';
import { createHash } from 'crypto';
import type { SourceAdapter } from './source.adapter';
import type { IngestContext, NormalizedProblem, SourceConfig } from '../types';

@Injectable()
export class JsonBulkSourceAdapter implements SourceAdapter {
  readonly type = ContentSourceType.JSON_BULK;
  private readonly logger = new Logger(JsonBulkSourceAdapter.name);

  async computeDigest(config: SourceConfig): Promise<string> {
    if (config.type !== 'JSON_BULK') throw new Error('JsonBulkSourceAdapter requires JSON_BULK config');
    const buf = await fs.readFile(config.filePath);
    return createHash('sha256').update(buf).digest('hex');
  }

  async ingest(_jobId: string, config: SourceConfig, ctx: IngestContext): Promise<NormalizedProblem[]> {
    if (config.type !== 'JSON_BULK') throw new Error('JsonBulkSourceAdapter requires JSON_BULK config');
    await ctx.updateStatus('EXTRACTING');
    const raw = await fs.readFile(config.filePath, 'utf8');
    const parsed = JSON.parse(raw) as
      | NormalizedProblem[]
      | { items?: NormalizedProblem[]; problems?: NormalizedProblem[] };
    const items = Array.isArray(parsed)
      ? parsed
      : (parsed.items ?? parsed.problems ?? []);
    await ctx.updateStatus('EXTRACTING', { totalItems: items.length, extractedProblems: items.length });
    this.logger.log(`JSON bulk: ${items.length} items`);
    return items;
  }
}

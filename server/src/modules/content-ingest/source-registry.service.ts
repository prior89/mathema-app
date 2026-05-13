/* Adapter registration and lookup — simple facade that resolves an adapter by sourceType. */
import { Injectable } from '@nestjs/common';
import { ContentSourceType } from '@prisma/client';
import { PdfSourceAdapter } from './adapters/pdf-source.adapter';
import { HttpApiSourceAdapter } from './adapters/http-api-source.adapter';
import { JsonBulkSourceAdapter } from './adapters/json-bulk-source.adapter';
import type { SourceAdapter } from './adapters/source.adapter';

@Injectable()
export class SourceRegistry {
  private readonly map: Map<ContentSourceType, SourceAdapter>;

  constructor(
    private readonly pdf: PdfSourceAdapter,
    private readonly http: HttpApiSourceAdapter,
    private readonly json: JsonBulkSourceAdapter,
  ) {
    this.map = new Map<ContentSourceType, SourceAdapter>([
      [ContentSourceType.PDF, pdf],
      [ContentSourceType.HTTP_API, http],
      [ContentSourceType.JSON_BULK, json],
    ]);
  }

  get(type: ContentSourceType): SourceAdapter {
    const a = this.map.get(type);
    if (!a) throw new Error(`No adapter for source type ${type}`);
    return a;
  }
}

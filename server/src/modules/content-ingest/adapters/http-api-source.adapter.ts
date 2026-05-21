/* HTTP API SourceAdapter — pulls from external REST APIs such as EBS or public question banks.
 *
 * Policy:
 *   - Supports both GET and POST.
 *   - authRef names an env var (process.env[authRef]) holding the token, so secrets stay out of the DB.
 *   - Expects a JSON array or { items: [...] } shape. Anything else requires extending the adapter.
 *   - Each record is mapped to { text, ncertClass?, chapterNumber?, exerciseId?, qIndex? }.
 *   - If the response shape is unrecognized, the raw record is dumped into NormalizedProblem.text for the reviewer to fix.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ContentSourceType, NcertClass } from '@prisma/client';
import { createHash } from 'crypto';
import type { SourceAdapter } from './source.adapter';
import type { IngestContext, NormalizedProblem, SourceConfig } from '../types';
import { assertSafeFetchUrl } from '../../../common/utils/url-safety';

@Injectable()
export class HttpApiSourceAdapter implements SourceAdapter {
  readonly type = ContentSourceType.HTTP_API;
  private readonly logger = new Logger(HttpApiSourceAdapter.name);

  async computeDigest(config: SourceConfig): Promise<string> {
    if (config.type !== 'HTTP_API') throw new Error('HttpApiSourceAdapter requires HTTP_API config');
    const key = JSON.stringify({ url: config.url, method: config.method ?? 'GET', q: config.queryJson, b: config.bodyJson });
    return createHash('sha256').update(key).digest('hex');
  }

  async ingest(_jobId: string, config: SourceConfig, ctx: IngestContext): Promise<NormalizedProblem[]> {
    if (config.type !== 'HTTP_API') throw new Error('HttpApiSourceAdapter requires HTTP_API config');
    await ctx.updateStatus('FETCHING');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.authRef) {
      const tok = process.env[config.authRef];
      if (tok) headers.Authorization = tok.startsWith('Bearer ') ? tok : `Bearer ${tok}`;
    }
    const init: RequestInit = { method: config.method ?? 'GET', headers };
    if (config.method === 'POST' && config.bodyJson) init.body = config.bodyJson;

    const url = config.queryJson ? `${config.url}${config.url.includes('?') ? '&' : '?'}${this.qs(config.queryJson)}` : config.url;
    // P0-3 SSRF guard — reject http://, private IPs (incl. cloud metadata
    // 169.254.169.254), DNS rebind. assertSafeFetchUrl throws on any
    // unsafe target before the network call.
    await assertSafeFetchUrl(url);
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(`Source HTTP ${res.status} ${res.statusText}`);
    const payload: unknown = await res.json();

    await ctx.updateStatus('EXTRACTING');
    const records = this.extractRecords(payload);
    const problems = records.map((r, i) => this.normalize(r, i));

    await ctx.updateStatus('EXTRACTING', {
      totalItems: records.length,
      extractedProblems: problems.length,
      detectedClasses: Array.from(new Set(problems.map((p) => p.ncertClass).filter((x): x is NcertClass => !!x))),
    });
    this.logger.log(`HTTP API ${url}: ${records.length} records → ${problems.length} problems`);
    return problems;
  }

  private qs(jsonStr: string): string {
    try {
      const obj = JSON.parse(jsonStr) as Record<string, unknown>;
      return new URLSearchParams(obj as Record<string, string>).toString();
    } catch {
      return jsonStr;
    }
  }

  private extractRecords(payload: unknown): Array<Record<string, unknown>> {
    if (Array.isArray(payload)) return payload as Array<Record<string, unknown>>;
    if (payload && typeof payload === 'object') {
      const o = payload as Record<string, unknown>;
      for (const k of ['items', 'data', 'problems', 'records', 'list', 'results']) {
        if (Array.isArray(o[k])) return o[k] as Array<Record<string, unknown>>;
      }
    }
    return [];
  }

  /** Normalize common field-name aliases. If text is missing, stringify the entire record. */
  private normalize(r: Record<string, unknown>, idx: number): NormalizedProblem {
    const text = String(r.text ?? r.body ?? r.statement ?? r.question ?? r.content ?? JSON.stringify(r));
    const cls = this.mapClass(r);
    const chapter = this.intOf(r.chapter ?? r.chapterNumber ?? r.unit ?? r.unitNumber);
    const exId = (r.exercise ?? r.exerciseId ?? r.section) as string | undefined;
    const qIndex = this.intOf(r.qIndex ?? r.number ?? r.no ?? r.index ?? idx + 1);
    return { ncertClass: cls, chapterNumber: chapter, exerciseId: exId, qIndex, text, sourceRef: String(r.id ?? r.uid ?? idx) };
  }

  private mapClass(r: Record<string, unknown>): NcertClass | undefined {
    const v = String(r.class ?? r.grade ?? r.gradeLevel ?? '').toUpperCase();
    if (!v) return undefined;
    if (/(^|\b)(7|VII)\b/.test(v)) return 'CLASS_7';
    if (/(^|\b)(8|VIII)\b/.test(v)) return 'CLASS_8';
    if (/(^|\b)(9|IX)\b/.test(v)) return 'CLASS_9';
    if (/(^|\b)(10|X)\b/.test(v)) return 'CLASS_10';
    if (/(^|\b)(11|XI)\b/.test(v)) return 'CLASS_11';
    if (/(^|\b)(12|XII)\b/.test(v)) return 'CLASS_12';
    return undefined;
  }

  private intOf(x: unknown): number | undefined {
    if (typeof x === 'number' && Number.isFinite(x)) return x;
    if (typeof x === 'string' && /^\d+$/.test(x)) return parseInt(x, 10);
    return undefined;
  }
}

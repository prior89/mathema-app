/* PDF SourceAdapter — pdf-parse extracts pages → "Textbook for Class X" pattern delimits class boundaries
 *   → "EXERCISE N.M" pattern indexes chapters and exercises → problem bodies are extracted → returns NormalizedProblem[].
 *
 * This adapter targets NCERT-style textbooks (English, EXERCISE markers). For other PDFs (EBS, etc.)
 * add a sibling adapter (e.g. pdf-ebs-source.adapter.ts) with a different indexing heuristic.
 */
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ContentSourceType, NcertClass } from '@prisma/client';
import { PDFParse } from 'pdf-parse';
import type { SourceAdapter } from './source.adapter';
import type { IngestContext, NormalizedProblem, SourceConfig } from '../types';

type ClassRange = { cls: NcertClass; from: number; to: number };
type Marker = { page: number; cls: NcertClass; chapter: number; exercise: string };
type Indexed = Marker & { endPage: number };

@Injectable()
export class PdfSourceAdapter implements SourceAdapter {
  readonly type = ContentSourceType.PDF;
  private readonly logger = new Logger(PdfSourceAdapter.name);

  async computeDigest(config: SourceConfig): Promise<string> {
    if (config.type !== 'PDF') throw new Error('PdfSourceAdapter requires PDF config');
    return config.sha256;
  }

  async ingest(_jobId: string, config: SourceConfig, ctx: IngestContext): Promise<NormalizedProblem[]> {
    if (config.type !== 'PDF') throw new Error('PdfSourceAdapter requires PDF config');

    await ctx.updateStatus('EXTRACTING');
    const buf = await fs.readFile(config.filePath);
    const parser = new PDFParse({ data: new Uint8Array(buf) });
    const info = await parser.getInfo();
    const totalPages = info.total ?? 0;

    // Fetch all page text in one shot (chunking would be safer on memory but 1500p still works fine).
    const pages = await parser.getText({});
    await parser.destroy();

    const pageTexts = new Map<number, string>();
    for (const p of pages.pages) pageTexts.set(p.num, p.text);

    // 1) Detect class boundaries — "Textbook for Class VII/VIII/IX/X/XI/XII" or "Class 9", etc.
    const ROMAN_MAP: Record<string, NcertClass> = {
      VII: 'CLASS_7', VIII: 'CLASS_8', IX: 'CLASS_9', X: 'CLASS_10', XI: 'CLASS_11', XII: 'CLASS_12',
      '7': 'CLASS_7', '8': 'CLASS_8', '9': 'CLASS_9', '10': 'CLASS_10', '11': 'CLASS_11', '12': 'CLASS_12',
    };
    const boundaries: Array<{ page: number; cls: NcertClass }> = [];
    for (let p = 1; p <= totalPages; p++) {
      const t = pageTexts.get(p) ?? '';
      const m = t.match(/Textbook for Class\s+(VII|VIII|IX|X|XI|XII|7|8|9|10|11|12)\b/i);
      if (m) {
        const cls = ROMAN_MAP[m[1].toUpperCase()];
        if (cls && (boundaries.length === 0 || boundaries[boundaries.length - 1].cls !== cls)) {
          boundaries.push({ page: p, cls });
        }
      }
    }
    if (boundaries.length === 0) {
      // fallback — no class detected. Proceed treating the whole PDF as one class (reviewer must map).
      this.logger.warn('No "Textbook for Class …" boundary found. Class detection skipped.');
    }
    const ranges: ClassRange[] = boundaries.map((b, i) => ({
      cls: b.cls,
      from: b.page,
      to: i + 1 < boundaries.length ? boundaries[i + 1].page - 1 : totalPages,
    }));
    const classifyPage = (p: number): NcertClass | undefined =>
      ranges.find((r) => p >= r.from && p <= r.to)?.cls;
    const detectedClasses = Array.from(new Set(ranges.map((r) => r.cls)));

    // 2) Index EXERCISE markers (grouped by class and chapter).
    await ctx.updateStatus('INDEXING', { totalItems: totalPages, detectedClasses });
    const markers: Marker[] = [];
    for (let p = 1; p <= totalPages; p++) {
      const t = pageTexts.get(p) ?? '';
      const m = t.match(/EXERCISE\s+(\d+)\.(\d+)/);
      if (!m) continue;
      const cls = classifyPage(p);
      if (!cls) continue;
      markers.push({ page: p, cls, chapter: parseInt(m[1], 10), exercise: `${m[1]}.${m[2]}` });
    }
    const indexed: Indexed[] = markers.map((m, i) => {
      let endPage = ranges.find((r) => r.cls === m.cls)?.to ?? totalPages;
      const next = markers[i + 1];
      if (next) endPage = next.page - 1;
      return { ...m, endPage };
    });
    await ctx.setIndex({ ranges, exercises: indexed });

    // 3) Extract problem bodies from each EXERCISE page range.
    await ctx.updateStatus('EXTRACTING', {
      totalItems: totalPages,
      extractedExercises: indexed.length,
      detectedClasses,
    });

    const problems: NormalizedProblem[] = [];
    for (const ex of indexed) {
      const last = Math.min(ex.endPage, ex.page + 3); // an exercise typically spans 1-4 pages
      let txt = '';
      for (let p = ex.page; p <= last; p++) txt += '\n' + (pageTexts.get(p) ?? '');
      const qs = this.extractFromBlock(txt, ex.exercise);
      qs.forEach((q, i) => {
        problems.push({
          ncertClass: ex.cls,
          chapterNumber: ex.chapter,
          exerciseId: ex.exercise,
          qIndex: i + 1,
          text: q,
          sourceRef: `page-${ex.page}`,
        });
      });
    }

    await ctx.updateStatus('EXTRACTING', {
      totalItems: totalPages,
      extractedExercises: indexed.length,
      extractedProblems: problems.length,
      detectedClasses,
    });

    this.logger.log(`PDF ${path.basename(config.filePath)}: ${totalPages}p · ${indexed.length} exercises · ${problems.length} problems`);
    return problems;
  }

  /** Strip page headers/footers, then split problems on the "N. ..." pattern. */
  private extractFromBlock(rawText: string, exerciseId: string): string[] {
    const anchor = new RegExp(`EXERCISE\\s+${exerciseId.replace('.', '\\.')}`);
    const am = anchor.exec(rawText);
    if (!am) return [];
    let body = rawText.slice(am.index + am[0].length);

    const endMatch = body.match(/EXERCISE\s+\d+\.\d+|WHAT\s+HAVE\s+WE\s+DISCUSSED|^\d+\.\d+\s+[A-Z][A-Z]/m);
    if (endMatch && typeof endMatch.index === 'number') body = body.slice(0, endMatch.index);

    body = this.cleanText(body);

    const lines = body.split('\n');
    const problems: string[] = [];
    let cur = '';
    let started = false;
    for (const line of lines) {
      const m = line.match(/^(\d{1,2})\.\s+(.*)$/);
      if (m && parseInt(m[1], 10) <= 30) {
        if (started && cur.trim()) problems.push(cur.trim());
        cur = line.trim();
        started = true;
      } else if (started) {
        cur += ' ' + line.trim();
      }
    }
    if (started && cur.trim()) problems.push(cur.trim());

    return problems
      .map((p) => p.replace(/\s+/g, ' '))
      .filter((p) => p.length >= 20 && p.length <= 800);
  }

  private cleanText(t: string): string {
    return t
      .split('\n')
      .filter((line) => {
        const s = line.trim();
        if (!s) return false;
        if (/^Reprint\s+\d{4}/i.test(s)) return false;
        if (/^20\d\d-\d\d$/.test(s)) return false;
        if (/^MATHEMATICS\s*\d*$/i.test(s)) return false;
        if (/^\d+\s+MATHEMATICS$/i.test(s)) return false;
        if (/^[A-Z\s]{4,}\s+\d+$/.test(s) && s.split(/\s+/).length <= 4) return false;
        if (/^[A-Z\s\-']{4,}$/.test(s) && s.length <= 30) return false;
        if (/^Fig\.\s*\d/i.test(s)) return false;
        if (/^TRY\s+THESE$/i.test(s)) return false;
        if (/^DO\s+THIS$/i.test(s)) return false;
        return true;
      })
      .join('\n');
  }
}

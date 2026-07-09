import { BadRequestException, GatewayTimeoutException, HttpException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OcrSource = 'mathpix' | 'openai' | 'mathpix+openai';

export type OcrResult = {
  text: string;
  latex?: string | null;
  confidence?: number | null;
  source: OcrSource;
};

type OpenAiOcrCallResult =
  | { ok: true; model: string; json: any }
  | { ok: false; model: string; status: number; errorText: string };

type MathpixOcrCallResult =
  | { ok: true; json: any }
  | { ok: false; status: number; errorText: string };

/**
 * Upper bound on how long we honor a vendor Retry-After before giving up. A 429
 * whose Retry-After exceeds this means the account is rate-limited for longer
 * than a single request can wait out — retrying then only amplifies the storm,
 * so we fail fast instead of hammering the provider three times.
 */
const RETRY_AFTER_CAP_MS = 8_000;

/**
 * Whether OCR'd text warrants the extra vision pass that re-reads a diagram. This
 * pass adds ~3–8s, so it must fire on real graph/geometry problems but not on
 * text-only algebra. Two guards over the previous bare-substring regex:
 *  - word boundaries on the English tokens, so "paragraph"/"configure" no longer
 *    false-match "graph"/"figure";
 *  - dropped "axis"/"axes", which fired the vision pass on text-only "axis of
 *    symmetry" problems that need no diagram — a genuinely graphed problem still
 *    trips "graph"/"coordinate"/그래프/좌표/도형.
 * Korean tokens stay substring-matched (\b doesn't apply cleanly to Hangul); they
 * are specific enough not to false-fire.
 */
const DIAGRAM_HINT_KO =
  /그래프|좌표|기울기|도형|그림|함수의\s*그래프/;
const DIAGRAM_HINT_EN = /\b(?:graph|slope|coordinate|diagram|figure|intercept)s?\b/i;

export function needsDiagramVision(text: string): boolean {
  return DIAGRAM_HINT_KO.test(text) || DIAGRAM_HINT_EN.test(text);
}

const OCR_PROMPT =
  'Extract every piece of mathematical content from this image as clean ' +
  "LaTeX (or plain text where math notation isn't appropriate). " +
  'Wrap ALL math expressions with delimiters our renderer understands: ' +
  'inline math as \\( ... \\), display math as \\[ ... \\]. ' +
  'Example good output: "Solve \\( x + \\frac{1}{2} = 3 \\) for x. Options: \\( a \\) 1, \\( b \\) 2." ' +
  'Never emit bare commands like \\frac or \\left without the surrounding delimiters. ' +
  'Preserve line breaks, Korean word spacing, labels, and multiple-choice options exactly. ' +
  'Return ONLY the extracted content - no preamble, no commentary, no code fences.';

const GRAPH_OCR_PROMPT =
  'You repair OCR for a math solver. Use the existing OCR as the base text. ' +
  'If the original image contains a graph, coordinate plane, geometry diagram, table, or figure, inspect it and add all visible axes, points, intercepts, line endpoints, labels, and relationships needed to solve the problem. ' +
  'Preserve Korean wording, options, labels, and formulas. Wrap math expressions with \\( ... \\) or \\[ ... \\]. ' +
  'Return ONLY the complete self-contained extracted problem text - no preamble, no commentary, no code fences.';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  constructor(private readonly config: ConfigService) {}

  async extract(file: Express.Multer.File): Promise<OcrResult> {
    try {
      if (!file) throw new BadRequestException('file is required');
      if (!file.buffer?.length) throw new BadRequestException('Uploaded file body is empty.');
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      if (!isPdf && !file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image/* or PDF files are supported');
      }
      const base64 = file.buffer.toString('base64');
      if (!isPdf && this.shouldTryMathpix()) {
        try {
          const mathpix = await this.extractMathpix(file, base64);
          if (this.shouldEnhanceWithVision(mathpix)) {
            try {
              return await this.enhanceMathpixWithOpenAi(file, base64, mathpix);
            } catch (err) {
              this.logger.warn(`Mathpix OCR graph enhancement failed; returning Mathpix text only: ${this.formatError(err)}`);
            }
          }
          return mathpix;
        } catch (err) {
          this.logger.warn(`Mathpix OCR failed; falling back to OpenAI OCR: ${this.formatError(err)}`);
        }
      }
      return await this.extractOpenAi(file, isPdf, base64);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = this.formatError(err);
      throw new ServiceUnavailableException(`Math OCR failed: ${message}`);
    }
  }

  private async extractMathpix(file: Express.Multer.File, base64: string): Promise<OcrResult> {
    const result = await this.callMathpixOcr(file, base64);
    if (!result.ok) {
      throw new ServiceUnavailableException(`Mathpix OCR failed (${result.status}): ${result.errorText.slice(0, 300)}`);
    }

    const raw = this.firstNonEmptyString(result.json?.text, result.json?.latex_styled, result.json?.markdown);
    if (!raw) throw new BadRequestException('Could not read this image clearly. Try a sharper photo.');
    const text = this.normalizeKoreanExamOcr(raw);
    const latexRaw = this.firstNonEmptyString(result.json?.latex_styled, result.json?.text);
    const latex = latexRaw ? this.normalizeKoreanExamOcr(latexRaw) : text;
    return {
      text,
      latex,
      confidence: this.normalizeConfidence(result.json?.confidence_rate ?? result.json?.confidence),
      source: 'mathpix',
    };
  }

  /**
   * Mathpix KR exam OCR often glues Korean question prose into display-math:
   *   \[ \lim … = b g(1) \text{ 일 때, } ab의 값은? [4점] \]
   * Pull the "일 때 / 값은?" tail out so the editable OCR card and MathText
   * preview stay readable. Safe no-op for pure-English / pure-math bodies.
   */
  private normalizeKoreanExamOcr(src: string): string {
    if (!src || !/[가-힣]/.test(src)) return src;
    return src.replace(/\\\[([\s\S]*?)\\\]/g, (_full, body: string) => {
      const idx = body.search(/\\text\{\s*일\s*때/);
      if (idx > 0) {
        const math = body.slice(0, idx).trim();
        const prose = body
          .slice(idx)
          .replace(/\\text\{([^}]*)\}/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        return `\\[${math}\\]\n${prose}`;
      }
      // Bare Hangul after a relation without \text wrapper.
      const m = body.match(
        /^([\s\S]*?(?:=|\\approx|\\leq|\\geq)\s*[^가-힣\n]{0,100}?)(\s+[가-힣][\s\S]*)$/,
      );
      if (m && m[1].trim().length > 8) {
        return `\\[${m[1].trim()}\\]\n${m[2].trim()}`;
      }
      return `\\[${body}\\]`;
    });
  }

  private async callMathpixOcr(file: Express.Multer.File, base64: string): Promise<MathpixOcrCallResult> {
    const appId = process.env.MATHPIX_APP_ID;
    const appKey = process.env.MATHPIX_APP_KEY;
    if (!appId || !appKey) {
      throw new ServiceUnavailableException('Mathpix OCR is not configured (MATHPIX_APP_ID / MATHPIX_APP_KEY missing).');
    }

    const url = 'https://api.mathpix.com/v3/text';
    let lastFailure: Extract<MathpixOcrCallResult, { ok: false }> | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      let retryDelayMs = 500 * 2 ** attempt;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.mathpixTimeoutMs());
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            app_id: appId,
            app_key: appKey,
          },
          signal: controller.signal,
          body: JSON.stringify({
            src: `data:${file.mimetype};base64,${base64}`,
            formats: ['text', 'data'],
            data_options: { include_latex: true, include_asciimath: true },
            math_inline_delimiters: ['\\(', '\\)'],
            math_display_delimiters: ['\\[', '\\]'],
            rm_spaces: true,
            include_line_data: true,
            metadata: { improve_mathpix: false },
          }),
        });

        if (res.ok) return { ok: true, json: await res.json() };
        lastFailure = {
          ok: false,
          status: res.status,
          errorText: await res.text().catch(() => ''),
        };
        if (!this.shouldRetryStatus(res.status)) return lastFailure;
        // Honor the vendor's Retry-After (429/503). If it exceeds our cap the
        // account is throttled longer than this request can wait — stop now
        // instead of retrying into a rate-limit storm.
        const retryAfterMs = this.parseRetryAfterMs(res.headers.get('retry-after'));
        if (retryAfterMs !== null && retryAfterMs > RETRY_AFTER_CAP_MS) return lastFailure;
        if (retryAfterMs !== null) retryDelayMs = Math.max(retryDelayMs, retryAfterMs);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new GatewayTimeoutException(
            `Mathpix OCR timed out after ${Math.round(this.mathpixTimeoutMs() / 1000)}s. Try a smaller or clearer image.`,
          );
        }
        if (attempt === 2) throw err;
      } finally {
        clearTimeout(timeout);
      }

      await this.sleep(retryDelayMs);
    }

    return lastFailure ?? { ok: false, status: 503, errorText: 'Mathpix OCR request did not complete.' };
  }

  private async enhanceMathpixWithOpenAi(
    file: Express.Multer.File,
    base64: string,
    mathpix: OcrResult,
  ): Promise<OcrResult> {
    const text = await this.openAiText(
      file,
      false,
      base64,
      GRAPH_OCR_PROMPT,
      `Existing OCR:\n${mathpix.text}\n\nInspect the original image and return the repaired, self-contained problem text.`,
      this.graphOcrModels(),
      4096,
    );
    const normalized = this.normalizeKoreanExamOcr(text);
    return {
      text: normalized,
      latex: normalized,
      confidence: mathpix.confidence ?? null,
      source: 'mathpix+openai',
    };
  }

  private async extractOpenAi(file: Express.Multer.File, isPdf: boolean, base64: string): Promise<OcrResult> {
    const text = await this.openAiText(
      file,
      isPdf,
      base64,
      OCR_PROMPT,
      'Extract the content now.',
      this.ocrModels(),
      4096,
    );
    const normalized = this.normalizeKoreanExamOcr(text);
    return { text: normalized, latex: normalized, confidence: null, source: 'openai' };
  }

  private async openAiText(
    file: Express.Multer.File,
    isPdf: boolean,
    base64: string,
    systemPrompt: string,
    userText: string,
    models: string[],
    maxTokens: number,
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('OCR is not configured (OPENAI_API_KEY missing).');

    let lastFailure: Extract<OpenAiOcrCallResult, { ok: false }> | null = null;

    for (const model of models) {
      const result = await this.callOpenAiOcr(model, apiKey, file, base64, isPdf, systemPrompt, userText, maxTokens);
      if (result.ok) {
        const text = String(result.json?.choices?.[0]?.message?.content ?? '').trim();
        if (!text) throw new BadRequestException('Could not read this image clearly. Try a sharper photo.');
        return text;
      }

      lastFailure = result;
      if (!this.shouldTryNextModel(result.status)) break;
    }

    throw new ServiceUnavailableException(
      `OCR failed (${lastFailure?.status ?? 'unknown'}) on ${lastFailure?.model ?? 'unknown'}: ${(lastFailure?.errorText ?? '').slice(0, 300)}`,
    );
  }

  private async callOpenAiOcr(
    model: string,
    apiKey: string,
    file: Express.Multer.File,
    base64: string,
    isPdf: boolean,
    systemPrompt: string,
    userText: string,
    maxTokens: number,
  ): Promise<OpenAiOcrCallResult> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const filePart = isPdf
      ? {
          type: 'file',
          file: {
            filename: file.originalname || 'upload.pdf',
            file_data: `data:application/pdf;base64,${base64}`,
          },
        }
      : {
          type: 'image_url',
          image_url: { url: `data:${file.mimetype};base64,${base64}`, detail: 'high' },
        };

    let lastFailure: Extract<OpenAiOcrCallResult, { ok: false }> | null = null;
    const body: Record<string, unknown> = {
      model,
      // Student photo bytes flow through here. store:false opts the request out
      // of OpenAI-side retention for dashboards/distillation, matching the
      // privacy-policy / Data Safety "inputs are not retained or used to train"
      // disclosure for minor data.
      store: false,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [filePart, { type: 'text', text: userText }],
        },
      ],
    };
    if (this.usesCompletionTokenLimit(model)) {
      body.max_completion_tokens = maxTokens;
    } else {
      body.temperature = 0;
      body.max_tokens = maxTokens;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      let retryDelayMs = 500 * 2 ** attempt;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs());
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify(body),
        });

        if (res.ok) return { ok: true, model, json: await res.json() };
        lastFailure = {
          ok: false,
          model,
          status: res.status,
          errorText: await res.text().catch(() => ''),
        };
        if (!this.shouldRetryStatus(res.status)) return lastFailure;
        // Honor the vendor's Retry-After (429/503). If it exceeds our cap the
        // account is throttled longer than this request can wait — stop now
        // instead of retrying into a rate-limit storm.
        const retryAfterMs = this.parseRetryAfterMs(res.headers.get('retry-after'));
        if (retryAfterMs !== null && retryAfterMs > RETRY_AFTER_CAP_MS) return lastFailure;
        if (retryAfterMs !== null) retryDelayMs = Math.max(retryDelayMs, retryAfterMs);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new GatewayTimeoutException(
            `Math OCR timed out after ${Math.round(this.timeoutMs() / 1000)}s. Try a smaller or clearer image.`,
          );
        }
        if (attempt === 2) throw err;
      } finally {
        clearTimeout(timeout);
      }

      await this.sleep(retryDelayMs);
    }

    return lastFailure ?? { ok: false, model, status: 503, errorText: 'OCR request did not complete.' };
  }

  private timeoutMs(): number {
    return this.config.get<number>('ocr.timeoutMs') ?? 180000;
  }

  private mathpixTimeoutMs(): number {
    const value = Number(process.env.MATHPIX_TIMEOUT_MS);
    return Number.isFinite(value) && value > 0 ? value : this.timeoutMs();
  }

  private ocrModels(): string[] {
    const primary = process.env.AI_OCR_MODEL ?? 'gpt-4o-mini';
    const fallback = process.env.AI_OCR_FALLBACK_MODEL ?? 'gpt-5.4-mini';
    return Array.from(new Set([primary, fallback]));
  }

  private graphOcrModels(): string[] {
    const primary = process.env.AI_OCR_GRAPH_MODEL ?? 'gpt-5.4-mini';
    const fallback = process.env.AI_OCR_FALLBACK_MODEL ?? 'gpt-4o-mini';
    return Array.from(new Set([primary, fallback]));
  }

  private shouldTryMathpix(): boolean {
    if (process.env.OCR_PRIMARY_PROVIDER === 'openai') return false;
    return Boolean(process.env.MATHPIX_APP_ID && process.env.MATHPIX_APP_KEY);
  }

  private shouldEnhanceWithVision(result: OcrResult): boolean {
    if (process.env.OCR_GRAPH_ENHANCEMENT === 'false') return false;
    return needsDiagramVision(result.text);
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 500 || status === 503;
  }

  /**
   * Parse an HTTP Retry-After header into milliseconds. Supports the
   * delta-seconds form ("120") and the HTTP-date form. Returns null when the
   * header is absent or unparseable (caller then keeps its own backoff).
   */
  private parseRetryAfterMs(headerValue: string | null): number | null {
    if (!headerValue) return null;
    const trimmed = headerValue.trim();
    if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10) * 1000;
    const dateMs = Date.parse(trimmed);
    if (!Number.isNaN(dateMs)) return Math.max(0, dateMs - Date.now());
    return null;
  }

  private shouldTryNextModel(status: number): boolean {
    return status === 400 || status === 404 || this.shouldRetryStatus(status);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private usesCompletionTokenLimit(model: string): boolean {
    return /^gpt-5/i.test(model);
  }

  private firstNonEmptyString(...values: unknown[]): string | null {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  }

  private normalizeConfidence(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    return numeric > 1 ? numeric / 100 : numeric;
  }

  private formatError(err: unknown): string {
    if (err instanceof HttpException) {
      const response = err.getResponse();
      if (typeof response === 'string') return response;
      if (response && typeof response === 'object' && 'message' in response) {
        const message = (response as { message?: unknown }).message;
        return Array.isArray(message) ? message.join('; ') : String(message);
      }
    }
    if (err instanceof Error) return err.message;
    return String(err);
  }
}

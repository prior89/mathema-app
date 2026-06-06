import { BadRequestException, GatewayTimeoutException, HttpException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OcrResult = {
  text: string;
  latex?: string | null;
  confidence?: number | null;
  source: 'gemini';
};

type GeminiOcrCallResult =
  | { ok: true; model: string; json: any }
  | { ok: false; model: string; status: number; errorText: string };

@Injectable()
export class OcrService {
  constructor(private readonly config: ConfigService) {}

  async extract(file: Express.Multer.File): Promise<OcrResult> {
    try {
      if (!file) throw new BadRequestException('file is required');
      if (!file.buffer?.length) throw new BadRequestException('Uploaded file body is empty.');
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      if (!isPdf && !file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image/* or PDF files are supported');
      }
      return await this.extractGemini(file);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = this.formatError(err);
      throw new ServiceUnavailableException(`Math OCR failed: ${message}`);
    }
  }

  private async extractGemini(file: Express.Multer.File): Promise<OcrResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('Gemini OCR is not configured (GEMINI_API_KEY missing).');

    const imageBase64 = file.buffer.toString('base64');
    let lastFailure: Extract<GeminiOcrCallResult, { ok: false }> | null = null;

    for (const model of this.geminiOcrModels()) {
      const result = await this.callGeminiOcr(model, apiKey, file, imageBase64);
      if (result.ok) {
        const text = String(result.json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
        if (!text) throw new BadRequestException('Could not read this image clearly. Try a sharper photo.');
        return { text, latex: text, confidence: null, source: 'gemini' };
      }

      lastFailure = result;
      if (!this.shouldTryNextGeminiModel(result.status)) break;
    }

    throw new ServiceUnavailableException(
      `Gemini OCR failed (${lastFailure?.status ?? 'unknown'}) on ${lastFailure?.model ?? 'unknown'}: ${(lastFailure?.errorText ?? '').slice(0, 300)}`,
    );
  }

  private async callGeminiOcr(
    model: string,
    apiKey: string,
    file: Express.Multer.File,
    imageBase64: string,
  ): Promise<GeminiOcrCallResult> {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
      `:generateContent?key=${encodeURIComponent(apiKey)}`;
    let lastFailure: Extract<GeminiOcrCallResult, { ok: false }> | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs());
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: file.mimetype, data: imageBase64 } },
                {
                  text:
                    'Extract every piece of mathematical content from this image as clean ' +
                    "LaTeX (or plain text where math notation isn't appropriate). " +
                    'Preserve line breaks, Korean word spacing, labels, and multiple-choice options. ' +
                    'Return ONLY the extracted content - no preamble, ' +
                    'no commentary, no code fences.',
                },
              ],
            }],
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 8192,
              thinkingConfig: this.geminiThinkingConfig(model),
            },
          }),
        });

        if (res.ok) return { ok: true, model, json: await res.json() };
        lastFailure = {
          ok: false,
          model,
          status: res.status,
          errorText: await res.text().catch(() => ''),
        };
        if (!this.shouldRetryGeminiStatus(res.status)) return lastFailure;
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

      await this.sleep(500 * 2 ** attempt);
    }

    return lastFailure ?? { ok: false, model, status: 503, errorText: 'Gemini OCR request did not complete.' };
  }

  private timeoutMs(): number {
    return this.config.get<number>('ocr.timeoutMs') ?? 180000;
  }

  private geminiOcrModels(): string[] {
    const primary = process.env.GEMINI_OCR_MODEL ?? 'gemini-3.5-flash';
    return Array.from(new Set([primary, 'gemini-2.5-flash']));
  }

  private shouldRetryGeminiStatus(status: number): boolean {
    return status === 429 || status === 500 || status === 503;
  }

  private shouldTryNextGeminiModel(status: number): boolean {
    return status === 400 || this.shouldRetryGeminiStatus(status);
  }

  private geminiThinkingConfig(model: string): Record<string, unknown> {
    if (model.startsWith('gemini-3')) {
      return { thinkingLevel: model.includes('flash') ? 'minimal' : 'low' };
    }
    return { thinkingBudget: 0 };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

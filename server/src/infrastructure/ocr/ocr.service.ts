import { BadRequestException, GatewayTimeoutException, HttpException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OcrResult = {
  text: string;
  latex?: string | null;
  confidence?: number | null;
  source: 'openai';
};

type OpenAiOcrCallResult =
  | { ok: true; model: string; json: any }
  | { ok: false; model: string; status: number; errorText: string };

const OCR_PROMPT =
  'Extract every piece of mathematical content from this image as clean ' +
  "LaTeX (or plain text where math notation isn't appropriate). " +
  'Wrap ALL math expressions with delimiters our renderer understands: ' +
  'inline math as \\( ... \\), display math as \\[ ... \\]. ' +
  'Example good output: "Solve \\( x + \\frac{1}{2} = 3 \\) for x. Options: \\( a \\) 1, \\( b \\) 2." ' +
  'Never emit bare commands like \\frac or \\left without the surrounding delimiters. ' +
  'Preserve line breaks, Korean word spacing, labels, and multiple-choice options exactly. ' +
  'Return ONLY the extracted content - no preamble, no commentary, no code fences.';

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
      return await this.extractOpenAi(file, isPdf);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = this.formatError(err);
      throw new ServiceUnavailableException(`Math OCR failed: ${message}`);
    }
  }

  private async extractOpenAi(file: Express.Multer.File, isPdf: boolean): Promise<OcrResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('OCR is not configured (OPENAI_API_KEY missing).');

    const base64 = file.buffer.toString('base64');
    let lastFailure: Extract<OpenAiOcrCallResult, { ok: false }> | null = null;

    for (const model of this.ocrModels()) {
      const result = await this.callOpenAiOcr(model, apiKey, file, base64, isPdf);
      if (result.ok) {
        const text = String(result.json?.choices?.[0]?.message?.content ?? '').trim();
        if (!text) throw new BadRequestException('Could not read this image clearly. Try a sharper photo.');
        return { text, latex: text, confidence: null, source: 'openai' };
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
          image_url: { url: `data:${file.mimetype};base64,${base64}` },
        };

    let lastFailure: Extract<OpenAiOcrCallResult, { ok: false }> | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
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
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 4096,
            messages: [
              { role: 'system', content: OCR_PROMPT },
              {
                role: 'user',
                content: [filePart, { type: 'text', text: 'Extract the content now.' }],
              },
            ],
          }),
        });

        if (res.ok) return { ok: true, model, json: await res.json() };
        lastFailure = {
          ok: false,
          model,
          status: res.status,
          errorText: await res.text().catch(() => ''),
        };
        if (!this.shouldRetryStatus(res.status)) return lastFailure;
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

    return lastFailure ?? { ok: false, model, status: 503, errorText: 'OCR request did not complete.' };
  }

  private timeoutMs(): number {
    return this.config.get<number>('ocr.timeoutMs') ?? 180000;
  }

  private ocrModels(): string[] {
    const primary = process.env.AI_OCR_MODEL ?? 'gpt-4o-mini';
    return Array.from(new Set([primary, 'gpt-4o']));
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 500 || status === 503;
  }

  private shouldTryNextModel(status: number): boolean {
    return status === 400 || status === 404 || this.shouldRetryStatus(status);
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

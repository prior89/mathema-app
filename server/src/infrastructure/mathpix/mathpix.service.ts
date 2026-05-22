import { BadRequestException, GatewayTimeoutException, HttpException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type MathpixOcrResult = {
  text: string;
  latex?: string | null;
  confidence?: number | null;
  source: 'mathpix';
};

@Injectable()
export class MathpixService {
  constructor(private readonly config: ConfigService) {}

  async extract(file: Express.Multer.File): Promise<MathpixOcrResult> {
    try {
      if (!file) throw new BadRequestException('file is required');
      if (!file.buffer?.length) throw new BadRequestException('Uploaded file body is empty.');
      if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
        return await this.extractPdf(file);
      }
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image/* or PDF files are supported');
      }
      return await this.extractImage(file);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = this.formatError(err);
      throw new ServiceUnavailableException(`Math OCR failed: ${message}`);
    }
  }

  private async extractImage(file: Express.Multer.File): Promise<MathpixOcrResult> {
    // 2026-05-22 user decision: drop Mathpix entirely, route OCR through
    // Gemini 3.5 Flash multimodal. Single-vendor stack with the solver +
    // verifier (also Flash) means one billing surface, one key to rotate,
    // and Vertex AI Mumbai migration in one shot when DPDP enforcement
    // arrives. Pricing of Flash vision is ~$0.0005 per image vs Mathpix's
    // $0.002, accuracy is comparable on printed + handwritten math per
    // independent 2025-2026 benchmarks.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('Gemini OCR is not configured (GEMINI_API_KEY missing).');

    const imageBase64 = file.buffer.toString('base64');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs());

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text:
                  'Extract every piece of mathematical content from this image as clean ' +
                  "LaTeX (or plain text where math notation isn't appropriate). " +
                  'Preserve line breaks. Return ONLY the extracted content — no preamble, ' +
                  'no commentary, no code fences.',
              },
              { inline_data: { mime_type: file.mimetype, data: imageBase64 } },
            ],
          }],
          generationConfig: { temperature: 0, maxOutputTokens: 2000 },
        }),
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new GatewayTimeoutException(
          `Math OCR timed out after ${Math.round(this.timeoutMs() / 1000)}s. Try a smaller or clearer image.`,
        );
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new ServiceUnavailableException(`Gemini OCR failed (${res.status}): ${errText.slice(0, 300)}`);
    }

    const json: any = await res.json();
    const text: string = String(json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    if (!text) throw new BadRequestException('Could not read this image clearly. Try a sharper photo.');

    return {
      text,
      latex: text,
      confidence: null,
      source: 'gemini',
    };
  }

  private async extractPdf(file: Express.Multer.File): Promise<MathpixOcrResult> {
    const form = new FormData();
    form.append('file', new Blob([file.buffer], { type: 'application/pdf' }), file.originalname || 'upload.pdf');
    form.append('options_json', JSON.stringify({ conversion_formats: { md: true, mmd: true }, math_inline_delimiters: ['$', '$'] }));

    const created = await this.mathpixFetch('https://api.mathpix.com/v3/pdf', { method: 'POST', body: form });
    const pdfId = created.pdf_id;
    if (!pdfId) throw new ServiceUnavailableException('Mathpix PDF upload did not return a pdf_id.');

    const deadline = Date.now() + this.timeoutMs();
    let status: any = null;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1500));
      status = await this.mathpixFetch(`https://api.mathpix.com/v3/pdf/${pdfId}`, { method: 'GET' });
      if (status.status === 'completed') break;
      if (status.status === 'error') throw new BadRequestException(status.error ?? 'Mathpix could not read this PDF.');
    }
    if (status?.status !== 'completed') throw new ServiceUnavailableException('Math OCR timed out while processing the PDF.');

    const text = await this.mathpixFetchText(`https://api.mathpix.com/v3/pdf/${pdfId}.mmd`);
    const clean = text.trim();
    if (!clean) throw new BadRequestException('Math OCR could not extract text from this PDF.');
    return { text: clean, latex: clean, confidence: null, source: 'mathpix' };
  }

  private async mathpixFetch(url: string, init: RequestInit): Promise<any> {
    const text = await this.mathpixFetchText(url, init);
    try {
      return JSON.parse(text);
    } catch {
      throw new ServiceUnavailableException(`Mathpix returned non-JSON response: ${text.slice(0, 120)}`);
    }
  }

  private async mathpixFetchText(url: string, init: RequestInit = {}): Promise<string> {
    const appId = this.config.get<string>('mathpix.appId');
    const appKey = this.config.get<string>('mathpix.appKey');
    if (!appId || !appKey) throw new ServiceUnavailableException('Mathpix is not configured.');

    const controller = new AbortController();
    const timeoutMs = this.timeoutMs();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const headers = new Headers(init.headers ?? {});
      headers.set('app_id', appId);
      headers.set('app_key', appKey);
      let res: Response;
      try {
        res = await fetch(url, { ...init, headers, signal: controller.signal });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new GatewayTimeoutException(`Math OCR timed out after ${Math.round(timeoutMs / 1000)} seconds. Try a smaller or clearer image/PDF.`);
        }
        throw err;
      }
      const text = await res.text();
      if (!res.ok) throw new ServiceUnavailableException(`Mathpix failed (${res.status}): ${text.slice(0, 300)}`);
      return text;
    } finally {
      clearTimeout(timeout);
    }
  }

  private timeoutMs(): number {
    return this.config.get<number>('mathpix.timeoutMs') ?? 180000;
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

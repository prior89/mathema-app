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
    const src = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const json = await this.mathpixFetch('https://api.mathpix.com/v3/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        src,
        formats: ['text', 'latex_styled'],
        data_options: { include_asciimath: true, include_latex: true },
      }),
    });
    const text = String(json.text ?? json.latex_styled ?? '').trim();
    if (!text) throw new BadRequestException('Math OCR could not read this image clearly.');
    return {
      text,
      latex: json.latex_styled ?? null,
      confidence: typeof json.confidence === 'number' ? json.confidence : null,
      source: 'mathpix',
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

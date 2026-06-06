import { ConfigService } from '@nestjs/config';
import { OcrService } from './ocr.service';

function makeConfig(map: Record<string, number | string | undefined> = {}): ConfigService {
  return {
    get: jest.fn((key: string) => map[key]),
  } as unknown as ConfigService;
}

function imageFile(): Express.Multer.File {
  return {
    buffer: Buffer.from('fake-image'),
    mimetype: 'image/png',
    originalname: 'problem.png',
  } as Express.Multer.File;
}

function pdfFile(): Express.Multer.File {
  return {
    buffer: Buffer.from('%PDF-1.4 fake-pdf'),
    mimetype: 'application/pdf',
    originalname: 'problem.pdf',
  } as Express.Multer.File;
}

describe('OcrService Gemini OCR', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key' };
    delete process.env.GEMINI_OCR_MODEL;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '2x + 7 = 15' }] } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses the stable Gemini OCR model with Gemini 3 thinkingLevel by default', async () => {
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(imageFile());

    expect(result).toMatchObject({ text: '2x + 7 = 15', source: 'gemini' });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toContain('/models/gemini-3.5-flash:generateContent');
    const body = JSON.parse(String(init.body));
    expect(body.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'minimal' });
    expect(body.contents[0].parts[0].inline_data.mime_type).toBe('image/png');
  });

  it('allows production to override OCR back to Gemini 2.5 Flash', async () => {
    process.env.GEMINI_OCR_MODEL = 'gemini-2.5-flash';
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    await service.extract(imageFile());

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toContain('/models/gemini-2.5-flash:generateContent');
    const body = JSON.parse(String(init.body));
    expect(body.generationConfig.thinkingConfig).toEqual({ thinkingBudget: 0 });
  });

  it('routes PDFs through Gemini OCR instead of a separate OCR vendor', async () => {
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(pdfFile());

    expect(result).toMatchObject({ text: '2x + 7 = 15', source: 'gemini' });
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(String(init.body));
    expect(body.contents[0].parts[0].inline_data.mime_type).toBe('application/pdf');
  });
});

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

describe('OcrService OpenAI OCR', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-key' };
    delete process.env.AI_OCR_MODEL;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ message: { content: '2x + 7 = 15' } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses gpt-4o-mini by default and sends the image as a data URL', async () => {
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(imageFile());

    expect(result).toMatchObject({ text: '2x + 7 = 15', source: 'openai' });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toBe('https://api.openai.com/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('gpt-4o-mini');
    expect(body.temperature).toBe(0);
    const imagePart = body.messages[1].content[0];
    expect(imagePart.type).toBe('image_url');
    expect(imagePart.image_url.url).toMatch(/^data:image\/png;base64,/);
  });

  it('allows production to override the OCR model via AI_OCR_MODEL', async () => {
    process.env.AI_OCR_MODEL = 'gpt-4o';
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    await service.extract(imageFile());

    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('gpt-4o');
  });

  it('routes PDFs through the chat completions file content part', async () => {
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(pdfFile());

    expect(result).toMatchObject({ text: '2x + 7 = 15', source: 'openai' });
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(String(init.body));
    const filePart = body.messages[1].content[0];
    expect(filePart.type).toBe('file');
    expect(filePart.file.filename).toBe('problem.pdf');
    expect(filePart.file.file_data).toMatch(/^data:application\/pdf;base64,/);
  });
});

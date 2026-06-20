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

describe('OcrService OCR', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-key' };
    delete process.env.AI_OCR_MODEL;
    delete process.env.AI_OCR_FALLBACK_MODEL;
    delete process.env.AI_OCR_GRAPH_MODEL;
    delete process.env.OCR_GRAPH_ENHANCEMENT;
    delete process.env.OCR_PRIMARY_PROVIDER;
    delete process.env.MATHPIX_APP_ID;
    delete process.env.MATHPIX_APP_KEY;
    delete process.env.MATHPIX_TIMEOUT_MS;
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
    expect(body.max_tokens).toBe(4096);
    const imagePart = body.messages[1].content[0];
    expect(imagePart.type).toBe('image_url');
    expect(imagePart.image_url.url).toMatch(/^data:image\/png;base64,/);
    expect(imagePart.image_url.detail).toBe('high');
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

  it('uses Mathpix first when configured', async () => {
    process.env.MATHPIX_APP_ID = 'mathpix-id';
    process.env.MATHPIX_APP_KEY = 'mathpix-key';
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({
        text: 'Solve \\( x + 1 = 3 \\).',
        latex_styled: 'Solve \\( x + 1 = 3 \\).',
        confidence_rate: 0.99,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(imageFile());

    expect(result).toMatchObject({
      text: 'Solve \\( x + 1 = 3 \\).',
      latex: 'Solve \\( x + 1 = 3 \\).',
      confidence: 0.99,
      source: 'mathpix',
    });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toBe('https://api.mathpix.com/v3/text');
    expect(init.headers.app_id).toBe('mathpix-id');
    expect(init.headers.app_key).toBe('mathpix-key');
    const body = JSON.parse(String(init.body));
    expect(body.src).toMatch(/^data:image\/png;base64,/);
    expect(body.metadata).toEqual({ improve_mathpix: false });
    expect(body.formats).toEqual(['text', 'data']);
  });

  it('enhances graph OCR with OpenAI vision', async () => {
    process.env.MATHPIX_APP_ID = 'mathpix-id';
    process.env.MATHPIX_APP_KEY = 'mathpix-key';
    process.env.AI_OCR_GRAPH_MODEL = 'gpt-5.4-mini';
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          text: 'Find the slope of each graph.\n(1)\n(2)',
          confidence_rate: 1,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          choices: [{
            message: {
              content: 'Find the slope of each graph.\n(1) points \\((-4,1)\\), \\((-1,5)\\)\n(2) points \\((0,3)\\), \\((4,1)\\)',
            },
          }],
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      );
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(imageFile());

    expect(result.source).toBe('mathpix+openai');
    expect(result.text).toContain('\\((-4,1)\\)');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const [, init] = (global.fetch as jest.Mock).mock.calls[1];
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('gpt-5.4-mini');
    expect(body.max_completion_tokens).toBe(4096);
    expect(body.temperature).toBeUndefined();
    expect(body.messages[1].content[1].text).toContain('Existing OCR');
  });

  it('falls back to OpenAI when Mathpix returns a non-retryable error', async () => {
    process.env.MATHPIX_APP_ID = 'mathpix-id';
    process.env.MATHPIX_APP_KEY = 'mathpix-key';
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(new Response('unauthorized', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          choices: [{ message: { content: '2x + 7 = 15' } }],
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      );
    const service = new OcrService(makeConfig({ 'ocr.timeoutMs': 1000 }));

    const result = await service.extract(imageFile());

    expect(result).toMatchObject({ text: '2x + 7 = 15', source: 'openai' });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const [, init] = (global.fetch as jest.Mock).mock.calls[1];
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('gpt-4o-mini');
  });
});

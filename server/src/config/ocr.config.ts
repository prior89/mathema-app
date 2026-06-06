import { registerAs } from '@nestjs/config';

export default registerAs('ocr', () => ({
  timeoutMs: parseInt(process.env.OCR_TIMEOUT_MS ?? '180000', 10),
}));

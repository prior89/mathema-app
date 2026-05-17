import { registerAs } from '@nestjs/config';

export default registerAs('mathHelper', () => ({
  url: process.env.MATH_HELPER_URL ?? 'http://127.0.0.1:8000',
  timeoutMs: parseInt(process.env.MATH_HELPER_TIMEOUT_MS ?? '120000', 10),
}));

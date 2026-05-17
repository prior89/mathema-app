import { registerAs } from '@nestjs/config';

export default registerAs('mathHelper', () => ({
  url: process.env.MATH_HELPER_URL ?? 'http://localhost:8000',
  timeoutMs: parseInt(process.env.MATH_HELPER_TIMEOUT_MS ?? '30000', 10),
}));

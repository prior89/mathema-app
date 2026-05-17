import { registerAs } from '@nestjs/config';

export default registerAs('mathpix', () => ({
  appId: process.env.MATHPIX_APP_ID ?? '',
  appKey: process.env.MATHPIX_APP_KEY ?? '',
  timeoutMs: parseInt(process.env.MATHPIX_TIMEOUT_MS ?? '180000', 10),
}));

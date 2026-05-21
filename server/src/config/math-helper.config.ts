import { registerAs } from '@nestjs/config';

export default registerAs('mathHelper', () => {
  const rawUrl = process.env.MATH_HELPER_URL;
  // Production must hit the math-helper over https. An http URL gets a
  // 301 redirect from the ingress, and Node's default fetch downgrades a
  // POST to GET on redirect — silently dropping the JSON body. Fail fast
  // at boot rather than ship a config that loses every request.
  if (process.env.NODE_ENV === 'production') {
    if (!rawUrl || !rawUrl.startsWith('https://')) {
      throw new Error(
        'MATH_HELPER_URL must be set to an https:// URL in production',
      );
    }
  }
  return {
    url: rawUrl ?? 'http://127.0.0.1:8000',
    timeoutMs: parseInt(process.env.MATH_HELPER_TIMEOUT_MS ?? '120000', 10),
  };
});

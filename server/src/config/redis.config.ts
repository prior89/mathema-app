import { registerAs } from '@nestjs/config';

// In production (Azure Container Apps + Azure Cache for Redis) the connection
// is wired in as a single REDIS_URL secret (`rediss://:password@host:6380/0`).
// For local dev we still support REDIS_HOST / REDIS_PORT / REDIS_PASSWORD.
function fromUrl(raw: string) {
  const u = new URL(raw);
  return {
    host: u.hostname,
    port: Number(u.port || (u.protocol === 'rediss:' ? 6380 : 6379)),
    password: decodeURIComponent(u.password || ''),
    tls: u.protocol === 'rediss:',
  };
}

export default registerAs('redis', () => {
  const url = process.env.REDIS_URL;
  if (url) {
    try {
      return fromUrl(url);
    } catch {
      // fall through to discrete vars if URL is malformed
    }
  }
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? '',
    tls: process.env.REDIS_TLS === 'true',
  };
});

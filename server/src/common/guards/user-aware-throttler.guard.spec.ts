import { createHmac } from 'node:crypto';
import { UserAwareThrottlerGuard } from './user-aware-throttler.guard';

class TestGuard extends UserAwareThrottlerGuard {
  tracker(req: Record<string, unknown>) {
    return this.getTracker(req);
  }
}

function token(payload: Record<string, unknown>, secret: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

describe('UserAwareThrottlerGuard', () => {
  const previousSecret = process.env.JWT_ACCESS_SECRET;
  const secret = 'test-access-secret-at-least-32-bytes';
  const guard = new TestGuard([] as never, {} as never, {} as never);

  beforeAll(() => {
    process.env.JWT_ACCESS_SECRET = secret;
  });

  afterAll(() => {
    if (previousSecret === undefined) delete process.env.JWT_ACCESS_SECRET;
    else process.env.JWT_ACCESS_SECRET = previousSecret;
  });

  it('uses sub only for a valid, unexpired access token', async () => {
    const jwt = token({ sub: 'student-1', exp: Math.floor(Date.now() / 1000) + 60 }, secret);

    await expect(guard.tracker({
      ip: '203.0.113.10',
      headers: { authorization: `Bearer ${jwt}` },
    })).resolves.toBe('u:student-1');
  });

  it('does not let a forged payload choose a fresh rate-limit bucket', async () => {
    const forged = token({ sub: 'attacker-chosen', exp: Math.floor(Date.now() / 1000) + 60 }, 'wrong');

    await expect(guard.tracker({
      ip: '203.0.113.10',
      headers: { authorization: `Bearer ${forged}` },
    })).resolves.toBe('ip:203.0.113.10');
  });

  it('keeps expired signed tokens in the IP bucket', async () => {
    const expired = token({ sub: 'student-1', exp: Math.floor(Date.now() / 1000) - 1 }, secret);

    await expect(guard.tracker({
      ip: '203.0.113.10',
      headers: { authorization: `Bearer ${expired}` },
    })).resolves.toBe('ip:203.0.113.10');
  });
});

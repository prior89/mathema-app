import { UnauthorizedException } from '@nestjs/common';
import { SocialProviderService } from './social-provider.service';

function svc(mock: boolean) {
  const config = { get: (k: string) => (k === 'SOCIAL_AUTH_MOCK' ? (mock ? 'true' : 'false') : undefined) };
  return new SocialProviderService(config as never);
}

describe('SocialProviderService (mock)', () => {
  it('rejects a too-short token', async () => {
    await expect(svc(true).verify('kakao', 'x')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a deterministic synthetic identity in mock mode', async () => {
    const s = svc(true);
    const a = await s.verify('kakao', 'mock-token-aaaa');
    const b = await s.verify('kakao', 'mock-token-aaaa');
    expect(a).toEqual(b); // same token → same user (stable find-or-create)
    expect(a.provider).toBe('kakao');
    expect(a.email).toMatch(/^kakao_[0-9a-f]{16}@mock\.local$/);
    expect(a.emailVerified).toBe(true);
  });

  it('namespaces identity by provider', async () => {
    const s = svc(true);
    const k = await s.verify('kakao', 'same-token-value');
    const n = await s.verify('naver', 'same-token-value');
    expect(k.email).not.toEqual(n.email);
    expect(n.provider).toBe('naver');
  });
});

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export type SocialProvider = 'kakao' | 'naver';

export interface SocialIdentity {
  provider: SocialProvider;
  /** Stable per-provider user id. */
  providerUserId: string;
  /** Real email when the provider shares it, else a provider-namespaced
   * synthetic address so find-or-create stays stable. */
  email: string;
  emailVerified: boolean;
  name: string;
}

/**
 * Kakao / Naver social login — the default KR sign-in rails. Verifies a
 * client-supplied provider access token by calling the provider's userinfo
 * endpoint and returns a normalized identity.
 *
 * Set SOCIAL_AUTH_MOCK=true (dev only) to skip the network call and derive a
 * deterministic synthetic identity from the token, so the full sign-in flow is
 * exercisable without registered Kakao/Naver developer apps. Mock MUST stay off
 * in production.
 */
@Injectable()
export class SocialProviderService {
  private readonly logger = new Logger(SocialProviderService.name);

  constructor(private readonly config: ConfigService) {}

  // Mock auto-derives identity from the token; real mode hits the provider API.
  isMock(): boolean {
    return this.config.get<string>('SOCIAL_AUTH_MOCK') === 'true';
  }

  async verify(provider: SocialProvider, accessToken: string): Promise<SocialIdentity> {
    if (!accessToken || accessToken.length < 8) {
      throw new UnauthorizedException('missing social access token');
    }
    if (this.isMock()) return this.mockIdentity(provider, accessToken);
    return provider === 'kakao'
      ? this.verifyKakao(accessToken)
      : this.verifyNaver(accessToken);
  }

  private mockIdentity(provider: SocialProvider, token: string): SocialIdentity {
    const sub = createHash('sha256').update(`${provider}:${token}`).digest('hex').slice(0, 16);
    return {
      provider,
      providerUserId: sub,
      email: `${provider}_${sub}@mock.local`,
      emailVerified: true,
      name: provider === 'kakao' ? '카카오 사용자' : '네이버 사용자',
    };
  }

  private async verifyKakao(token: string): Promise<SocialIdentity> {
    const res = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new UnauthorizedException('invalid Kakao access token');
    const json = (await res.json()) as {
      id?: number | string;
      kakao_account?: { email?: string; is_email_verified?: boolean; profile?: { nickname?: string } };
    };
    const id = json.id != null ? String(json.id) : '';
    if (!id) throw new UnauthorizedException('Kakao did not return a user id');
    const acct = json.kakao_account ?? {};
    const email = acct.email?.toLowerCase() ?? `kakao_${id}@users.matheo.local`;
    return {
      provider: 'kakao',
      providerUserId: id,
      email,
      emailVerified: !!acct.email && !!acct.is_email_verified,
      name: acct.profile?.nickname ?? '카카오 사용자',
    };
  }

  private async verifyNaver(token: string): Promise<SocialIdentity> {
    const res = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new UnauthorizedException('invalid Naver access token');
    const json = (await res.json()) as {
      response?: { id?: string; email?: string; name?: string; nickname?: string };
    };
    const r = json.response ?? {};
    if (!r.id) throw new UnauthorizedException('Naver did not return a user id');
    const email = r.email?.toLowerCase() ?? `naver_${r.id}@users.matheo.local`;
    return {
      provider: 'naver',
      providerUserId: String(r.id),
      email,
      emailVerified: !!r.email,
      name: r.name ?? r.nickname ?? '네이버 사용자',
    };
  }
}

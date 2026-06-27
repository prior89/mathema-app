import { Injectable, ServiceUnavailableException } from '@nestjs/common';

/**
 * 휴대폰 본인인증 (PASS) provider abstraction for the KR under-14
 * legal-representative consent rail (PIPA Art. 22-2, Enforcement Decree
 * §17-2(1) method 3 — mobile identity authentication of the guardian).
 *
 * Real deployments plug in a 본인확인기관 / PG (NICE평가정보, PASS, PortOne…)
 * by setting GUARDIAN_PASS_PROVIDER=<name> and implementing the branch below.
 * Until then, GUARDIAN_PASS_PROVIDER defaults to 'mock' so the full consent
 * flow is exercisable end-to-end without external credentials. Mock MUST NOT
 * be enabled in production — it auto-approves every verification.
 */
export interface PassIdentity {
  ok: boolean;
  /** Guardian's verified legal name from the carrier rail. */
  name: string;
  /** Whether the verified person is an adult (guardian must be 19+ in KR). */
  isAdult: boolean;
  /** Connecting Information — opaque per-person key; the only identity token
   * we retain, never the raw 주민등록번호. */
  ci: string;
}

@Injectable()
export class PassProviderService {
  // Reads process.env directly so resolveConsentMethod and this provider agree.
  /** Master switch — gates the whole KR_PASS rail (paired with resolveConsentMethod). */
  isEnabled(): boolean {
    return process.env.GUARDIAN_PASS_ENABLED === 'true';
  }

  providerName(): string {
    return process.env.GUARDIAN_PASS_PROVIDER ?? 'mock';
  }

  isMock(): boolean {
    return this.providerName() === 'mock';
  }

  /**
   * Begin a guardian 본인인증 session. Real providers return a hosted auth URL
   * the parent opens to authenticate on their own phone; the mock returns a
   * local stub URL that the client/dev can drive straight to `complete`.
   */
  async start(opts: { txId: string; requestId: string }): Promise<{ authUrl: string }> {
    if (this.isMock()) {
      const base = process.env.APP_PUBLIC_URL ?? 'http://localhost:5173';
      return { authUrl: `${base}/guardian-consent/pass?tx=${opts.txId}` };
    }
    throw new ServiceUnavailableException(
      `PASS provider '${this.providerName()}' is not implemented. Set GUARDIAN_PASS_PROVIDER=mock for dev.`,
    );
  }

  /**
   * Resolve the provider's verification result for a transaction. Real impl
   * validates a signed provider callback / queries the provider API — a forged
   * txId fails because no real authenticated session exists. The mock always
   * returns a synthetic adult identity, which is exactly why it must stay out
   * of production.
   */
  async verify(opts: { txId: string }): Promise<PassIdentity> {
    if (this.isMock()) {
      return {
        ok: true,
        name: 'Mock Guardian',
        isAdult: true,
        ci: `MOCK-CI-${opts.txId.slice(0, 16)}`,
      };
    }
    throw new ServiceUnavailableException(
      `PASS provider '${this.providerName()}' is not implemented. Set GUARDIAN_PASS_PROVIDER=mock for dev.`,
    );
  }
}

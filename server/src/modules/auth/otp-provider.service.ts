import { Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export type OtpChannel = 'sms' | 'whatsapp' | 'voice' | 'mock';

export interface OtpSendResult {
  channel: OtpChannel;
  /** Mock only — the code, echoed so dev/tests can complete the flow. */
  devCode?: string;
}

export interface TruecallerIdentity {
  phone: string;
  name: string;
}

/**
 * Phone-OTP delivery + Truecaller one-tap for the India sign-in rail.
 *
 * Delivery is provider-agnostic: real mode posts to an SMS provider (MSG91 /
 * Gupshup / Twilio) and should cascade SMS → WhatsApp → voice on failure;
 * Truecaller verification calls the Truecaller profile API. Set OTP_AUTH_MOCK=
 * true (dev) to skip the network — send() echoes the code and Truecaller
 * returns a deterministic synthetic identity. Mock MUST stay off in production
 * (enforced by the boot guard in main.ts).
 */
@Injectable()
export class OtpProviderService {
  private readonly logger = new Logger(OtpProviderService.name);

  constructor(private readonly config: ConfigService) {}

  // Mock echoes the code + fakes Truecaller; real mode hits the SMS/Truecaller API.
  isMock(): boolean {
    return this.config.get<string>('OTP_AUTH_MOCK') === 'true';
  }

  /** Deliver a one-time code to the phone. Returns the channel used. */
  async send(phone: string, code: string): Promise<OtpSendResult> {
    if (this.isMock()) {
      this.logger.warn('[OTP mock] issued a dev code');
      return { channel: 'mock', devCode: code };
    }
    const apiKey = this.config.get<string>('MSG91_AUTH_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException('SMS provider not configured (MSG91_AUTH_KEY missing).');
    }
    // Real integration point: POST to MSG91 (or fallback WhatsApp/voice).
    // Left unimplemented on purpose so prod must wire a real provider.
    throw new ServiceUnavailableException('Real SMS provider integration is not wired yet.');
  }

  /** Verify a Truecaller one-tap token and return the phone + name. */
  async verifyTruecaller(token: string): Promise<TruecallerIdentity> {
    if (!token || token.length < 8) throw new UnauthorizedException('missing Truecaller token');
    if (this.isMock()) {
      const sub = createHash('sha256').update(token).digest('hex');
      // Deterministic synthetic Indian mobile (+91) from the token.
      const ten = `9${(parseInt(sub.slice(0, 9), 16) % 1_000_000_000).toString().padStart(9, '0')}`;
      return { phone: `+91${ten}`, name: 'Truecaller User' };
    }
    throw new ServiceUnavailableException('Real Truecaller integration is not wired yet.');
  }
}

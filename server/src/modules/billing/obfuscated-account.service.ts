import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deriveObfuscatedAccountId } from './obfuscated-account.util';

@Injectable()
export class ObfuscatedAccountService {
  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.secret());
  }

  forUser(userId: string): string {
    const secret = this.secret();
    if (!secret) {
      throw new InternalServerErrorException(
        'PLAY_OBFUSCATED_ACCOUNT_SECRET is not configured',
      );
    }
    return deriveObfuscatedAccountId(secret, userId);
  }

  private secret(): string {
    return this.config.get<string>('playBilling.obfuscatedAccountSecret') ?? '';
  }
}
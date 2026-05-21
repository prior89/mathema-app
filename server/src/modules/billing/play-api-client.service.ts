import { Injectable, Logger, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, androidpublisher_v3 } from 'googleapis';

@Injectable()
export class PlayApiClient implements OnModuleInit {
  private readonly logger = new Logger(PlayApiClient.name);
  private client: androidpublisher_v3.Androidpublisher | null = null;
  private packageName = '';

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const creds = this.config.get<{ client_email: string; private_key: string } | null>(
      'playBilling.credentials',
    );
    const packageName = this.config.get<string>('playBilling.packageName') ?? '';

    if (!creds || !packageName) {
      this.logger.warn(
        'Play Billing not configured (PLAY_SERVICE_ACCOUNT_JSON or PLAY_PACKAGE_NAME missing) — verifyPurchase will fail until set.',
      );
      return;
    }

    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    await auth.authorize();

    this.client = google.androidpublisher({ version: 'v3', auth });
    this.packageName = packageName;
    this.logger.log(`Play Billing client ready for package ${packageName}`);
  }

  /** Returns the subscription resource from Google Play Developer API v3
   * (subscriptionsv2). Throws if the client is not configured or the token
   * is invalid. */
  async getSubscription(productId: string, purchaseToken: string) {
    if (!this.client) {
      throw new InternalServerErrorException('Play Billing client not configured');
    }
    // v2 subscriptionsv2.get takes token only (no productId in path).
    const res = await this.client.purchases.subscriptionsv2.get({
      packageName: this.packageName,
      token: purchaseToken,
    });
    return res.data;
  }
}

import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/** Inner Pub/Sub message envelope. `data` is base64-encoded JSON whose
 *  decoded form is the Google Play DeveloperNotification payload. */
export class RtdnPubsubMessage {
  @IsString()
  data!: string;

  @IsString()
  messageId!: string;

  @IsOptional()
  @IsString()
  publishTime?: string;
}

/** Pub/Sub push HTTP body. */
export class RtdnRequestDto {
  @ValidateNested()
  @Type(() => RtdnPubsubMessage)
  @IsObject()
  message!: RtdnPubsubMessage;

  @IsOptional()
  @IsString()
  subscription?: string;
}

/** Decoded DeveloperNotification (subset). The `subscriptionNotification`
 *  block is the only one we currently care about; voidedPurchase and
 *  oneTimeProductNotification are unsupported (we have subscriptions only).
 *  Defined here for type-safety, not for validation (the raw JSON is decoded
 *  from base64 inside the service, not validated by Nest's pipe). */
export interface DeveloperNotification {
  version: string;
  packageName: string;
  eventTimeMillis: string;
  subscriptionNotification?: {
    version: string;
    notificationType: number;
    purchaseToken: string;
    subscriptionId: string;
  };
  oneTimeProductNotification?: unknown;
  /** productType: 1 = subscription, 2 = one-time (we only sell subscriptions). */
  voidedPurchaseNotification?: {
    purchaseToken: string;
    orderId?: string;
    productType: number;
    refundType?: number;
  };
  testNotification?: { version: string };
}

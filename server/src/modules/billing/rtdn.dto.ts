import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Inner Pub/Sub message envelope. `data` is base64-encoded JSON whose
 *  decoded form is the Google Play DeveloperNotification payload. */
export class RtdnPubsubMessage {
  @IsString()
  data!: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @IsString()
  messageId!: string;

  /** Pub/Sub wrapped pushes include this legacy alias alongside messageId. */
  @IsOptional()
  @IsString()
  message_id?: string;

  @IsOptional()
  @IsString()
  publishTime?: string;

  /** Pub/Sub wrapped pushes include this legacy alias alongside publishTime. */
  @IsOptional()
  @IsString()
  publish_time?: string;

  @IsOptional()
  @IsString()
  orderingKey?: string;
}

/** Pub/Sub push HTTP body. */
export class RtdnRequestDto {
  @IsOptional()
  @IsInt()
  deliveryAttempt?: number;

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

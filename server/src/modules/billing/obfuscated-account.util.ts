import { createHmac } from 'crypto';

export const OBFUSCATED_ACCOUNT_VERSION = 'play:v1';

/** Google Play BillingFlowParams obfuscated account id (max 64 chars, hex). */
export function deriveObfuscatedAccountId(
  secret: string,
  userId: string,
  version: string = OBFUSCATED_ACCOUNT_VERSION,
): string {
  if (!secret) {
    throw new Error('PLAY_OBFUSCATED_ACCOUNT_SECRET is not configured');
  }
  const digest = createHmac('sha256', secret)
    .update(`${version}:${userId}`, 'utf8')
    .digest('hex');
  if (digest.length > 64) {
    return digest.slice(0, 64);
  }
  return digest;
}
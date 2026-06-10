/** Google Play package name — must match app/android applicationId. */
export const PLAY_PACKAGE_NAME = 'ai.matheo.app';

/** All subscriptions for this app (restore / general manage). */
export function playSubscriptionsCenterUrl(): string {
  return 'https://play.google.com/store/account/subscriptions';
}

/** Deep link to manage one active subscription (Play Billing docs). */
export function playSubscriptionManageUrl(productId: string): string {
  const sku = encodeURIComponent(productId);
  const pkg = encodeURIComponent(PLAY_PACKAGE_NAME);
  return `https://play.google.com/store/account/subscriptions?sku=${sku}&package=${pkg}`;
}

export function openPlaySubscriptionManage(productId: string | null | undefined): void {
  const url = productId
    ? playSubscriptionManageUrl(productId)
    : playSubscriptionsCenterUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
}
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const billingPluginSource = readFileSync(
  new URL(
    '../../android/app/src/main/java/ai/matheo/app/BillingPlugin.java',
    import.meta.url,
  ),
  'utf8',
);

describe('Android billing bridge contract', () => {
  it('notifies the web layer when the Play purchase sheet is canceled', () => {
    expect(billingPluginSource).not.toMatch(
      /responseCode\(\)\s*!=\s*BillingClient\.BillingResponseCode\.USER_CANCELED/,
    );
    expect(billingPluginSource).toContain(
      'notifyListeners("purchaseError", evt)',
    );
  });
});

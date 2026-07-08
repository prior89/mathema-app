import { test, expect } from '@playwright/test';

/**
 * CI-safe paywall redirect — mocks API; no NestJS sidecar required.
 * Verifies api.ts 403 interceptor → /app/paywall when billing UI cache is on.
 */
test.describe('billing — 403 paywall redirect', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('matheo.billingUiEnabled', '1');
      localStorage.setItem('mathema.lang', 'ko');

      // Make Capacitor report Android and provide a deterministic Billing
      // bridge so the real paywall plan selector can be exercised in CI.
      (window as any).androidBridge = {};
      const methods = (names: string[]) =>
        names.map((name) => ({
          name,
          rtype: name === 'addListener' ? 'callback' : 'promise',
        }));
      (window as any).Capacitor = {
        PluginHeaders: [
          {
            name: 'Billing',
            methods: methods([
              'initialize',
              'queryProductDetails',
              'launchBillingFlow',
              'acknowledgePurchase',
              'restorePurchases',
              'addListener',
              'removeListener',
            ]),
          },
          { name: 'App', methods: methods(['addListener', 'removeListener', 'getState']) },
        ],
        nativePromise: async (plugin: string, method: string) => {
          if (plugin === 'Billing' && method === 'initialize') return { ready: true };
          if (plugin === 'Billing' && method === 'queryProductDetails') {
            return {
              products: [
                {
                  productId: 'premium_monthly',
                  title: 'Matheo Premium Monthly',
                  description: '',
                  offers: [
                    {
                      offerToken: 'monthly-token',
                      basePlanId: 'monthly',
                      offerId: null,
                      pricingPhases: [
                        {
                          priceFormatted: '₩9,900',
                          priceAmountMicros: '9900000000',
                          currencyCode: 'KRW',
                          billingPeriod: 'P1M',
                          recurrenceMode: 1,
                          billingCycleCount: 0,
                        },
                      ],
                    },
                  ],
                },
                {
                  productId: 'premium_yearly',
                  title: 'Matheo Premium Yearly',
                  description: '',
                  offers: [
                    {
                      offerToken: 'yearly-token',
                      basePlanId: 'yearly',
                      offerId: null,
                      pricingPhases: [
                        {
                          priceFormatted: '₩99,000',
                          priceAmountMicros: '99000000000',
                          currencyCode: 'KRW',
                          billingPeriod: 'P1Y',
                          recurrenceMode: 1,
                          billingCycleCount: 0,
                        },
                      ],
                    },
                  ],
                },
              ],
            };
          }
          if (plugin === 'Billing' && method === 'launchBillingFlow') return { launched: true };
          if (plugin === 'Billing' && method === 'acknowledgePurchase') {
            return { acknowledged: true };
          }
          if (plugin === 'Billing' && method === 'restorePurchases') return { purchases: [] };
          if (plugin === 'App' && method === 'getState') return { isActive: true };
          return {};
        },
        nativeCallback: () => 'e2e-callback',
      };
    });

    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/users/me')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              id: 'e2e-user',
              email: 'e2e@example.com',
              name: 'E2E User',
              role: 'STUDENT',
              gradeLevel: 'CLASS_11',
              country: 'KR',
              birthDate: '2000-07-01T00:00:00.000Z',
              emailVerifiedAt: '2026-06-01T00:00:00.000Z',
            },
          }),
        });
      }
      if (url.includes('/auth/refresh')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: { accessToken: 'e2e-test-token', refreshToken: 'e2e-refresh-token' },
          }),
        });
      }
      if (url.includes('/billing/status')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              premium: false,
              billingUiEnabled: true,
              entitlement: {
                premium: false,
                tier: 'FREE',
                source: null,
                preview: null,
                previewEligibility: { eligible: true, reason: null },
              },
              subscription: null,
              quota: {
                solver: {
                  used: 8,
                  limit: 8,
                  resetAt: '2026-06-12T00:00:00.000Z',
                },
              },
              monetization: {
                mode: 'PLAY',
                free: { solverDailyLimit: 8 },
                premiumPreview: {
                  productId: 'premium_preview_3d',
                  days: 3,
                  paymentMethodRequired: false,
                  eligibility: 'ONE_TIME',
                },
                playTrialPolicy: { defaultSurface: 'NONE', note: '' },
              },
            },
          }),
        });
      }
      if (url.includes('/reports/weekly/current')) {
        return route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              error: 'PremiumRequired',
              message: 'This feature requires Matheo Premium.',
              feature: 'weekly_reports',
            },
            path: '/reports/weekly/current',
            timestamp: new Date().toISOString(),
          }),
        });
      }
      if (url.includes('/config/features')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { flags: {} } }),
        });
      }
      if (
        url.includes('/reports/weekly/time-vs-accuracy')
        || url.includes('/reports/weekly/next-focus')
        || url.includes('/reports/weekly/achievements')
        || url.includes('/mentor')
        || url.includes('/analytics/')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
      // CI has no Nest sidecar — never proxy unhandled API calls to :4000.
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }),
      });
    });
  });

  test('PremiumRequired on weekly report navigates to paywall', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('mathema.access', 'e2e-test-token');
      localStorage.setItem('mathema.refresh', 'e2e-refresh-token');
      localStorage.setItem('mathema.onboarding', JSON.stringify({ completedAt: new Date().toISOString() }));
    });

    await page.goto('/app');
    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });

    await page.goto('/app/report');
    await expect(page).toHaveURL(/\/app\/paywall\?reason=premium/, { timeout: 15_000 });
    await expect(page.getByText(/premium|프리미엄/i).first()).toBeVisible();
  });

  test('paywall explains benefits and makes the paid choice unambiguous', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('mathema.access', 'e2e-test-token');
      localStorage.setItem('mathema.refresh', 'e2e-refresh-token');
      localStorage.setItem(
        'mathema.onboarding',
        JSON.stringify({ completedAt: new Date().toISOString() }),
      );
    });

    await page.goto('/app/paywall?reason=quota');

    await expect(
      page.getByRole('heading', { name: '무료 10문제 다음, 단원을 끝까지 마스터하세요' }),
    ).toBeVisible();
    await expect(page.getByText('Premium에서 달라지는 결과')).toBeVisible();
    // Outcome framing for quota entry (H4 conversion).
    await expect(page.getByText(/AI 풀이 한도|한도 없이/)).toBeVisible();
    await expect(page.getByText('먼저 3일 무료로 써볼까요?')).toBeVisible();

    const plans = page.locator('.paywall-plan-card');
    await expect(plans).toHaveCount(2);
    await expect(page.getByText('월간 결제 대비 17% 절약')).toBeVisible();

    // Monthly is the default now — the low-commitment entry, and pre-selecting the
    // pricier annual is a "특정 선택 유도" dark-pattern risk. Dock CTA starts monthly.
    await expect(page.getByRole('button', { name: '월간 구독 시작' })).toBeVisible();

    // The recurring-payment disclosure sits next to the CTA (전자상거래법).
    await expect(page.getByText(/자동결제 · 언제든 해지/)).toBeVisible();

    // Choosing the annual card switches the CTA to the yearly one.
    await page.getByRole('button', { name: /연간 구독/ }).click();
    await expect(page.getByRole('button', { name: '연간 구독 시작' })).toBeVisible();
    await expect(
      page.getByText('이 버튼만 눌러서는 결제되지 않으며 Google Play에서 한 번 더 확인합니다.'),
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const content = document.querySelector('.paywall-content');
      return !!content && content.scrollWidth > content.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });
});

import { test, expect } from '@playwright/test';

/**
 * CI-safe paywall redirect — mocks API; no NestJS sidecar required.
 * Verifies api.ts 403 interceptor → /app/paywall when billing UI cache is on.
 */
test.describe('billing — 403 paywall redirect', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('matheo.billingUiEnabled', '1');
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
              country: 'IN',
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
              entitlement: { premium: false, tier: 'FREE' },
              subscription: null,
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
});
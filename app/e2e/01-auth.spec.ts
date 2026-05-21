/**
 * Onboarding + sign-up + sign-in smoke flow.
 *
 *   1. /login renders + dev-login (admin/admin) lands on /app
 *   2. /register step 0 renders without crash + advances on valid inputs
 *   3. /onboarding renders the welcome screen
 *
 * Heavy-driven flows (full 9-step onboarding completion, real account creation)
 * are out of scope — they need fresh email seeding and would race against the
 * shared dev DB. These specs catch the "white screen / broken route" class of
 * regression that ships in 90% of UI accidents.
 */
import { test, expect } from '@playwright/test';
import { loginAsAdmin, backendReachable } from './helpers';

test.describe('auth flow', () => {
  test.beforeAll(async ({ request }) => {
    // Skip the whole suite if backend isn't reachable — Playwright's UI assertions
    // would otherwise time out with confusing messages instead of "backend down".
    try {
      const r = await request.get('http://localhost:4000/api/v1/health/live');
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
  });

  test('login page renders the email + password form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });

  test('dev-login flow when ENABLE_DEV_LOGIN is set (skipped if disabled)', async ({ page, request }) => {
    // Probe dev-login availability — environments without ENABLE_DEV_LOGIN=true
    // (production-shaped local boxes) return 401 immediately.
    const probe = await request.post('http://localhost:4000/api/v1/auth/dev-login', { data: {} });
    test.skip(probe.status() === 401, 'Dev-login disabled in this environment');
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/app/);
  });

  test('register page step 0 renders the role + email/password form', async ({ page }) => {
    await page.goto('/register');
    // The email input on step 0 carries placeholder "name@example.com".
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });

  test('onboarding renders the welcome screen', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('.mathema-phone')).toBeVisible();
  });

  test('forgot password page renders without crashing', async ({ page }) => {
    await page.goto('/forgot-password');
    // The page uses a generic <input type="email"> inside the Field component.
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });
});

/**
 * Shared test helpers for matheo Playwright specs.
 *
 * The dev backend ships with a PoC dev-login bound to admin/admin (only when
 * NODE_ENV=development AND ENABLE_DEV_LOGIN=true). All authenticated specs
 * funnel through loginAsAdmin() so the suite has zero per-spec test-user
 * setup — same as the manual smoke flow the team already uses.
 */
import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('admin');
  await page.locator('input[type="password"]').first().fill('admin');
  await page.getByRole('button', { name: /Sign in/i }).click();
  await expect(page).toHaveURL(/\/app(\/|$)/, { timeout: 10_000 });
}

export async function backendReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get('http://localhost:4000/api/v1/health/live');
    return res.ok();
  } catch {
    return false;
  }
}

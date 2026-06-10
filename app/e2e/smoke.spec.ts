import { test, expect } from '@playwright/test';

/**
 * CI-safe public smoke — Vite dev server only (no NestJS/Postgres sidecar).
 *
 *   1. Unauthenticated / → /login with email/password form
 *   2. /privacy renders (static fallback when API proxy is down)
 *
 * Full-stack health + login flows live in other specs and scripts/smoke-prod.sh.
 * Set E2E_API_BASE when a backend is running to also hit /health/ready.
 */

test.describe('matheo — public smoke', () => {
  test('lands on login with sign-in form', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);

    await expect(page.getByLabel(/email|이메일/i)).toBeVisible();
    await expect(page.getByLabel(/password|비밀번호/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /sign in|로그인|साइन इन/i }),
    ).toBeVisible();
    await expect(page.getByAltText('Matheo')).toBeVisible();
  });

  test('privacy page renders without login', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/privacy/);
    await expect(
      page.getByRole('heading', { name: /privacy policy|개인정보/i }),
    ).toBeVisible();
  });

  test('backend health is reachable when E2E_API_BASE is set', async ({ request }) => {
    const apiBase = process.env.E2E_API_BASE;
    test.skip(!apiBase, 'E2E_API_BASE not set — skip backend probe in CI');

    const res = await request.get(`${apiBase}/health/ready`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('status');
  });
});
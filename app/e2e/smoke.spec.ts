import { expect, test } from '@playwright/test';

/**
 * Backend-independent public-route smoke. Auth wiring and routing contracts
 * live in 01-auth.spec.ts; these checks stay intentionally small and prove
 * that the redesigned public shell can be entered on both viewports.
 */
test.describe('Matheo public smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('mathema.lang', 'ko'));
  });

  test('root lands on the redesigned login form', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /다시 반가워요|Welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/이메일|Email/i)).toBeVisible();
    await expect(page.getByLabel(/비밀번호|Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인|Sign in/i })).toBeEnabled();
    await expect(page.getByLabel('Matheo', { exact: true })).toBeVisible();
  });

  test('onboarding skips the one-option country gate straight to auth', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: /내 수학 코스 만들기|Build my math path/i }).click();

    // KR-only launch: the country step is gone, so the welcome CTA lands on
    // account creation directly — still with zero India-curriculum leakage.
    await expect(page.getByRole('heading', { name: 'Matheo 계정 만들기' })).toBeVisible();
    await expect(page.getByText('어느 나라에서 공부하나요?')).toHaveCount(0);
    await expect(page.getByText(/NCERT|JEE|CBSE/)).toHaveCount(0);
  });

  test('privacy policy is readable without login', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { name: /개인정보 처리방침|Privacy Policy/i })).toBeVisible();
  });

  test('real backend readiness is checked only when E2E_API_BASE is supplied', async ({ request }) => {
    const apiBase = process.env.E2E_API_BASE?.replace(/\/$/, '');
    test.skip(!apiBase, 'Backend prerequisite not requested: set E2E_API_BASE to run readiness');

    const response = await request.get(`${apiBase}/health/ready`);
    expect(response.status(), await response.text()).toBe(200);
    await expect(response.json()).resolves.toHaveProperty('status');
  });
});

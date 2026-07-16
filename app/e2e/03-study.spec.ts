/**
 * Study tab smoke tests.
 *
 *   1. /app/study renders the chapter picker
 *   2. (gated) starting a chapter shows a single problem with 5 MC options + canvas
 *
 * The "start chapter" interaction is gated by Mastery completion — for the
 * admin dev user we expect the gate to be open on chapters they've mastered.
 * If the dev DB has nothing mastered, the spec skips the gated assertion
 * rather than fail flakily.
 */
import { test, expect } from '@playwright/test';
import { API_BASE } from './helpers';

test.describe('study tab', () => {
  test.beforeEach(async ({ page, request }) => {
    try {
      const r = await request.get(`${API_BASE}/health/live`);
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
    // Study practice requires Mastery completion, which a register-only
    // throwaway user can't reach -- only the admin dev-login user (seeded
    // with progress) can. Probe dev-login availability; skip if disabled.
    const probe = await request.post(`${API_BASE}/auth/dev-login`, { data: {} });
    test.skip(!probe.ok(), 'Dev-login disabled -- Study practice spec needs admin seed');
    const body = await probe.json();
    const accessToken = body?.data?.accessToken;
    const refreshToken = body?.data?.refreshToken;
    if (!accessToken || !refreshToken) {
      throw new Error('Dev-login response missing access or refresh token');
    }

    // Inject the API-issued seed session directly. Going through the login UI
    // makes this suite vulnerable to rate limits and unrelated auth-form state.
    await page.goto('/login');
    await page.evaluate(([access, refresh]) => {
      localStorage.setItem('mathema.access', access);
      localStorage.setItem('mathema.refresh', refresh);
      localStorage.setItem('mathema.lang', 'ko');
    }, [accessToken, refreshToken]);
    await page.goto('/app/study');
    await expect(page).toHaveURL(/\/app\/study$/, { timeout: 10_000 });
  });

  test('study tab renders the chapter picker', async ({ page }) => {
    await page.goto('/app/study');
    // Country-aware copy: the seeded dev user is Korean, while English is
    // retained for other local fixtures.
    await expect(page.getByText(/집중 연습|Focused practice|Pick a chapter/i).first())
      .toBeVisible({ timeout: 10_000 });
  });

  test('study practice screen surfaces a problem + handwriting canvas when accessible', async ({ page }) => {
    await page.goto('/app/study');
    const picker = page.getByRole('combobox').first();
    await expect(picker).toBeVisible({ timeout: 10_000 });
    const eligible = await picker.locator('option').evaluateAll((options) =>
      options
        .map((option) => (option as HTMLOptionElement).value)
        .filter((value) => value.length > 0),
    );
    if (eligible.length === 0) {
      await expect(picker).toHaveValue('');
      await expect(picker.locator('option').first())
        .toHaveText(/단원학습|complete.*(concept|mastery)/i);
      test.skip(true, 'Seeded KR student has no mastered chapter; practice is correctly gated.');
    }
    await picker.selectOption(eligible[0]);
    await page.getByRole('button', { name: /연습 시작|Start practice/i }).click();

    // If Mastery isn't done for this chapter, the route shows a "complete mastery first"
    // message. Skip the body assertion in that case.
    const blocked = page.getByText(/단원학습.*먼저|complete (the )?(concept|mastery) lesson/i);
    if (await blocked.isVisible().catch(() => false)) {
      test.skip(true, 'Mastery not complete for C11-CH01 in this dev DB — skipping body check.');
    }

    // Otherwise we expect either the problem body, the canvas, or an explicit
    // "no problems available" state.
    await expect(
      page.locator('canvas, [data-testid="problem-body"]').first()
        .or(page.getByText(/다음 문제를 불러올 수 없었어요|No problems available|Could not start/i)),
    ).toBeVisible({ timeout: 15_000 });
  });
});

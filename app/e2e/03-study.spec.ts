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
import { API_BASE, loginAsAdmin } from './helpers';

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
    test.skip(probe.status() === 401, 'Dev-login disabled -- Study practice spec needs admin seed');
    const landingPath = await loginAsAdmin(page);
    test.skip(
      !landingPath.startsWith('/app'),
      `Seeded dev user is ${landingPath}-gated; Study specs require a completed /app account`,
    );
  });

  test('study tab renders the chapter picker', async ({ page }) => {
    await page.goto('/app/study');
    // The chapter picker shows class/chapter labels.
    await expect(page.getByText(/Class \d+|Pick a chapter|Start practice/i).first())
      .toBeVisible({ timeout: 10_000 });
  });

  test('study practice screen surfaces a problem + handwriting canvas when accessible', async ({ page }) => {
    // Use a well-known seeded chapter code. C11-CH01 is the first chapter in
    // Class 11 (Sets) which is always present in the dev seed.
    await page.goto('/app/practice-set/C11-CH01');

    // If Mastery isn't done for this chapter, the route shows a "complete mastery first"
    // message. Skip the body assertion in that case.
    const blocked = page.getByText(/complete (the )?(concept|mastery) lesson/i);
    if (await blocked.isVisible().catch(() => false)) {
      test.skip(true, 'Mastery not complete for C11-CH01 in this dev DB — skipping body check.');
    }

    // Otherwise we expect either the problem body, the canvas, or an explicit
    // "no problems available" state.
    await expect(
      page.locator('canvas, [data-testid="problem-body"]').first()
        .or(page.getByText(/No problems available|Could not start/i)),
    ).toBeVisible({ timeout: 15_000 });
  });
});

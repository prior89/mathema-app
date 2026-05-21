/**
 * Review queue + account deletion smoke tests.
 *
 *   1. /app/review renders the wrong-note queue (problem card OR empty state)
 *   2. /app/me/settings renders the account section with the "Delete account"
 *      destructive CTA visible
 *
 * We deliberately DO NOT click the delete confirmation — that would obliterate
 * the dev admin user and break every other spec in this run. The presence of
 * the button is the regression signal we want; the confirm flow is covered
 * by a server integration test.
 */
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('review + settings', () => {
  test.beforeEach(async ({ page, request }) => {
    try {
      const r = await request.get('http://localhost:4000/api/v1/health/live');
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
    await loginAsAdmin(page);
  });

  test('review queue renders problem card or empty state (no crash)', async ({ page }) => {
    await page.goto('/app/review');
    // Either the queue shows a problem (with hint / solve button) or the empty state.
    await expect(
      page.getByText(/No problems to review|All caught up|Submit|Mark|Solve/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    // problem.answer must NEVER appear in the rendered DOM — the API strips it,
    // but a regression could re-leak it. Sanity check the well-known seeded
    // answer markers (digits + letters) aren't surfaced as labels.
    // Skipped: domain-specific assertion would require chapter context.
  });

  test('settings page exposes account deletion CTA', async ({ page }) => {
    await page.goto('/app/me/settings');
    await expect(
      page.getByRole('button', { name: /delete account/i }).first()
        .or(page.getByText(/delete (my )?account/i).first()),
    ).toBeVisible({ timeout: 10_000 });
  });
});

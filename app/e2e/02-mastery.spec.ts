/**
 * Mastery flow smoke tests.
 *
 *   1. /app/learn (Mastery tab) renders chapter cards
 *   2. Clicking a chapter routes into the concept-lesson screen
 *
 * Full mastery completion (hook → retrieval → 20 practice problems) is far too
 * slow + brittle for CI — we'd need ~30+ click chains plus deterministic
 * fixtures. The point of this spec is to catch the kind of regression that
 * makes the whole Mastery tab unreachable (route table breakage, query
 * failure that blanks the chapter list).
 */
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('mastery tab', () => {
  test.beforeEach(async ({ page, request }) => {
    try {
      const r = await request.get('http://localhost:4000/api/v1/health/live');
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
    await loginAsAdmin(page);
  });

  test('mastery tab loads and lists chapters', async ({ page }) => {
    await page.goto('/app/learn');
    // The chapter list is rendered as text containing "Class 7"–"Class 12"
    // (NCERT label) — at least one should be visible on a populated DB.
    await expect(page.getByText(/Class \d+/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('clicking a chapter routes to the concept lesson screen', async ({ page }) => {
    await page.goto('/app/learn');
    // The first chapter card is a clickable element. Click and verify URL change.
    const firstChapter = page.locator('a, button').filter({ hasText: /Class \d+/i }).first();
    await expect(firstChapter).toBeVisible({ timeout: 10_000 });
    await firstChapter.click();
    // Should navigate into a chapter route like /app/learn/<code> or /app/practice-set/<code>.
    await expect(page).toHaveURL(/\/app\/(learn|practice-set)\/[A-Z0-9-]+/i);
  });
});

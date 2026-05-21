/**
 * D1 -- end-to-end flow specs against the real backend.
 *
 * Pattern: register ONE throwaway user per `describe.serial` block, share the
 * authenticated session across the specs in that block, then hard-delete in
 * afterAll. This avoids hitting the /auth/register throttle (5/min/IP) while
 * still exercising real auth + real DB.
 *
 * The deletion spec runs in its own block so it can register-and-burn its
 * own user without disturbing the shared user.
 */
import { test, expect, Page } from '@playwright/test';
import { registerThrowawayUser } from './helpers';

test.describe.configure({ mode: 'serial' });

test.describe('authenticated flows (shared user)', () => {
  let teardown: (() => Promise<void>) | null = null;
  let accessToken = '';
  let userEmail = '';

  test.beforeAll(async ({ browser, request }) => {
    try {
      const r = await request.get('http://localhost:4000/api/v1/health/live');
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
    // Use a one-off page for registration so the tokens persist to the
    // domain's localStorage. Each spec re-uses the same browser context.
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    const t = await registerThrowawayUser(p);
    teardown = t.teardown;
    accessToken = t.accessToken;
    userEmail = t.email;
    await ctx.close();
  });

  test.afterAll(async () => {
    if (teardown) await teardown();
  });

  async function authPage(page: Page) {
    await page.goto('/login');
    await page.evaluate(([a]) => {
      // Replay tokens from beforeAll into this fresh test context.
      localStorage.setItem('mathema.access', a);
    }, [accessToken]);
  }

  test('register → /app/learn lists chapters', async ({ page }) => {
    await authPage(page);
    await page.goto('/app/learn');
    await expect(page.getByText(/Class \d+/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('/app/review queue: empty state for a fresh user', async ({ page }) => {
    await authPage(page);
    await page.goto('/app/review');
    await expect(
      page.getByText(/No problems to review|All caught up|nothing|Empty/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('/app/me/settings exposes delete-account CTA', async ({ page }) => {
    await authPage(page);
    await page.goto('/app/me/settings');
    await expect(
      page.getByRole('button', { name: /delete account/i }).first()
        .or(page.getByText(/delete (my )?account/i).first()),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('GET /users/me returns the registered user', async ({ page }) => {
    const res = await page.request.get('http://localhost:4000/api/v1/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body?.data?.email).toBe(userEmail);
  });
});

test.describe('account deletion (its own throwaway user)', () => {
  test.beforeAll(async ({ request }) => {
    try {
      const r = await request.get('http://localhost:4000/api/v1/health/live');
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
  });

  test('DELETE /users/me hard-deletes + subsequent /me returns 401', async ({ page }) => {
    const t = await registerThrowawayUser(page);
    // This test IS the teardown.
    const del = await page.request.delete('http://localhost:4000/api/v1/users/me', {
      headers: { Authorization: `Bearer ${t.accessToken}` },
    });
    expect(del.ok()).toBeTruthy();

    // The access token might be technically un-expired but JwtStrategy looks
    // up the user and refuses if the row is gone -> /me must 401.
    const me = await page.request.get('http://localhost:4000/api/v1/users/me', {
      headers: { Authorization: `Bearer ${t.accessToken}` },
    });
    expect(me.status()).toBe(401);
  });
});

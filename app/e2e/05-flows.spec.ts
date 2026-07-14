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
import { API_BASE, registerThrowawayUser } from './helpers';

test.describe.configure({ mode: 'serial' });

test.describe('authenticated flows (shared user)', () => {
  let teardown: (() => Promise<void>) | null = null;
  let accessToken = '';
  let refreshToken = '';
  let userEmail = '';
  let emailVerified = false;

  test.beforeAll(async ({ browser, request }) => {
    try {
      const r = await request.get(`${API_BASE}/health/live`);
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
    refreshToken = t.refreshToken;
    userEmail = t.email;
    const me = await p.request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!me.ok()) throw new Error(`setup /users/me failed (${me.status()}): ${await me.text()}`);
    emailVerified = !!(await me.json())?.data?.emailVerifiedAt;
    await ctx.close();
  });

  test.afterAll(async () => {
    if (teardown) await teardown();
  });

  async function authPage(page: Page) {
    await page.goto('/login');
    await page.evaluate(([a, r]) => {
      // Replay tokens from beforeAll into this fresh test context.
      localStorage.setItem('mathema.access', a);
      localStorage.setItem('mathema.refresh', r);
      localStorage.setItem('mathema.lang', 'ko');
    }, [accessToken, refreshToken]);
  }

  test('fresh password registration is stopped at email verification', async ({ page }) => {
    test.skip(emailVerified, 'Backend auto-verified this fixture; the unverified-email gate is not exercisable');
    await authPage(page);
    await page.goto('/app/learn');

    await expect(page).toHaveURL(/\/verify-required$/);
    await expect(page.getByRole('heading', { name: /이메일 확인이 필요해요|Verify your email/i })).toBeVisible();
    await expect(page.getByText(userEmail, { exact: true })).toBeVisible();
  });

  test('GET /users/me returns the KR account created by the real register endpoint', async ({ page }) => {
    const res = await page.request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body?.data).toMatchObject({
      email: userEmail,
      country: 'KR',
      gradeLevel: 'CLASS_11',
    });
  });

  test('/app/learn lists curriculum for a verified account', async ({ page }) => {
    test.skip(!emailVerified, 'External prerequisite: fixture email must be verified before learning routes unlock');
    await authPage(page);
    await page.goto('/app/learn');
    await expect(page.getByText(/단원 탐험|Explore chapters/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('/app/review queue: empty state for a fresh user', async ({ page }) => {
    test.skip(!emailVerified, 'External prerequisite: fixture email must be verified before review routes unlock');
    await authPage(page);
    await page.goto('/app/review');
    await expect(
      page.getByText(/모두 정리됐어요|대기 중인 오답이 없어요|All caught up|No wrong notes/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('/app/me/settings exposes delete-account CTA', async ({ page }) => {
    test.skip(!emailVerified, 'External prerequisite: fixture email must be verified before settings unlock');
    await authPage(page);
    await page.goto('/app/me/settings');
    await expect(
      page.getByRole('button', { name: /계정 삭제|delete (my )?account/i }).first()
        .or(page.getByText(/계정 삭제|delete (my )?account/i).first()),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('account deletion (its own throwaway user)', () => {
  test.beforeAll(async ({ request }) => {
    try {
      const r = await request.get(`${API_BASE}/health/live`);
      test.skip(!r.ok(), 'Backend not reachable at :4000');
    } catch {
      test.skip(true, 'Backend not reachable at :4000');
    }
  });

  test('DELETE /users/me hard-deletes + subsequent /me returns 401', async ({ page }) => {
    const t = await registerThrowawayUser(page);
    // This test IS the teardown.
    const del = await page.request.delete(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${t.accessToken}` },
    });
    expect(del.ok()).toBeTruthy();

    // The access token might be technically un-expired but JwtStrategy looks
    // up the user and refuses if the row is gone -> /me must 401.
    const me = await page.request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${t.accessToken}` },
    });
    expect(me.status()).toBe(401);
  });
});

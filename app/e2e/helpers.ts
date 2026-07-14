/**
 * Shared test helpers for matheo Playwright specs.
 *
 * The dev backend ships with a PoC dev-login bound to admin/admin (only when
 * NODE_ENV=development AND ENABLE_DEV_LOGIN=true). All authenticated specs
 * funnel through loginAsAdmin() so the suite has zero per-spec test-user
 * setup — same as the manual smoke flow the team already uses.
 */
import { Page, expect } from '@playwright/test';

export const API_BASE = process.env.E2E_API_BASE ?? 'http://127.0.0.1:4000/api/v1';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/이메일|Email/i).fill('admin');
  await page.getByLabel(/비밀번호|Password/i).fill('admin');
  await page.getByRole('button', { name: /로그인|Sign in/i }).click();
  // The seeded account may intentionally be onboarding/guardian gated. Let
  // each caller assert (or declare) the prerequisite it actually needs.
  await expect(page).not.toHaveURL(/\/login$/, { timeout: 10_000 });
  return new URL(page.url()).pathname;
}

export async function backendReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(`${API_BASE}/health/live`);
    return res.ok();
  } catch {
    return false;
  }
}

/**
 * Register a throwaway user via the real /auth/register endpoint, then drop the
 * resulting access + refresh tokens into localStorage so the next page.goto
 * lands authenticated. No dev-login required -- works on any backend.
 *
 * Returns the credentials so the spec can hit further endpoints directly, and
 * a teardown() callback that hard-deletes the account at end of test.
 */
export async function registerThrowawayUser(page: Page) {
  const stamp = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const email = `e2e-${stamp}@example.com`;
  const password = 'Test1234!Throwaway' + stamp;
  const name = 'E2E User';

  const res = await page.request.post(`${API_BASE}/auth/register`, {
    data: {
      email, password, name, role: 'STUDENT',
      country: 'KR',
      birthDate: '2000-01-01',
      gradeLevel: 'CLASS_11',
      examDate: '2027-02-14',
      targetGrade: 3,
      consentAnalytics: false, consentMarketing: false, consentAiTraining: false,
    },
  });
  if (!res.ok()) {
    throw new Error(`register failed (${res.status()}): ${await res.text()}`);
  }
  const body = await res.json();
  const accessToken = body?.data?.accessToken;
  const refreshToken = body?.data?.refreshToken;
  if (!accessToken || !refreshToken) {
    throw new Error('register response missing tokens');
  }

  // Seed tokens into the app's localStorage BEFORE navigation so the first
  // page.goto sees the user as authenticated.
  await page.goto('/login'); // any same-origin page is fine; this loads localStorage
  await page.evaluate(([a, r]) => {
    localStorage.setItem('mathema.access', a);
    localStorage.setItem('mathema.refresh', r);
  }, [accessToken, refreshToken]);

  const teardown = async () => {
    try {
      // Use fetch rather than page.request: serial suites commonly close the
      // setup page/context before afterAll invokes this cleanup callback.
      await fetch(`${API_BASE}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch { /* best-effort cleanup */ }
  };

  return { email, password, accessToken, refreshToken, teardown };
}

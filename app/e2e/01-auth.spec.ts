import { expect, test, type Page, type Route } from '@playwright/test';
import { API_BASE, backendReachable, loginAsAdmin } from './helpers';

type MockMe = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT';
  country: 'KR';
  birthDate: string | null;
  emailVerifiedAt: string;
  guardianConsentVerifiedAt: string | null;
  gradeLevel: 'CLASS_11' | null;
  examDate: string;
  targetGrade: number;
  dDay: number;
};

const COMPLETE_KR_STUDENT: MockMe = {
  id: 'e2e-complete-student',
  name: '테스트 학생',
  email: 'complete@example.com',
  role: 'STUDENT',
  country: 'KR',
  birthDate: '2000-01-01T00:00:00.000Z',
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  guardianConsentVerifiedAt: null,
  gradeLevel: 'CLASS_11',
  examDate: '2027-11-18T00:00:00.000Z',
  targetGrade: 2,
  dDay: 491,
};

const INCOMPLETE_KR_STUDENT: MockMe = {
  ...COMPLETE_KR_STUDENT,
  id: 'e2e-incomplete-student',
  email: 'incomplete@example.com',
  birthDate: null,
  gradeLevel: null,
};

async function json(route: Route, data: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify({ data }),
  });
}

async function installKoreanLocaleAndGoogleIdentity(page: Page) {
  await page.addInitScript(({ credential }) => {
    localStorage.setItem('mathema.lang', 'ko');

    let callback: ((response: { credential?: string }) => void) | undefined;
    (window as any).google = {
      accounts: {
        id: {
          initialize: (config: { callback: (response: { credential?: string }) => void }) => {
            callback = config.callback;
          },
          renderButton: (host: HTMLElement, options: { text?: string }) => {
            const officialButton = document.createElement('button');
            officialButton.type = 'button';
            officialButton.setAttribute('role', 'button');
            officialButton.textContent = options.text === 'signup_with'
              ? 'Google로 가입하기'
              : 'Google로 계속하기';
            officialButton.addEventListener('click', () => callback?.({ credential }));
            host.appendChild(officialButton);
          },
          prompt: () => {},
        },
      },
    };
  }, { credential: 'e2e.google.id-token' });
}

async function mockAuthApi(
  page: Page,
  me: MockMe,
  observers: {
    onPasswordLogin?: (body: Record<string, unknown>) => void;
    onGoogleLogin?: (body: Record<string, unknown>) => void;
  } = {},
) {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^.*\/api\/v1/, '');

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (path === '/auth/login' && request.method() === 'POST') {
      observers.onPasswordLogin?.(request.postDataJSON() as Record<string, unknown>);
      await json(route, { accessToken: 'e2e-access', refreshToken: 'e2e-refresh' });
      return;
    }
    if (path === '/auth/google/id-token' && request.method() === 'POST') {
      observers.onGoogleLogin?.(request.postDataJSON() as Record<string, unknown>);
      await json(route, { accessToken: 'e2e-access', refreshToken: 'e2e-refresh' });
      return;
    }
    if (path === '/auth/refresh') {
      await json(route, { accessToken: 'e2e-access', refreshToken: 'e2e-refresh' });
      return;
    }
    if (path === '/users/me') {
      await json(route, me);
      return;
    }
    if (path === '/config/features') {
      await json(route, {
        flags: {
          adaptive_diagnostic: false,
          first_session_achievement: false,
          kr_cold_start: false,
          student_efficacy_card: false,
          guest_mode: false,
        },
        rolloutPct: {},
      });
      return;
    }
    if (path === '/wrong-notes/queue/next') {
      await json(route, { wrongNote: null, totalEligible: 0, nextEligibleAt: null });
      return;
    }
    if (path === '/dashboard/summary') {
      await json(route, {
        todayMinutes: 0,
        todayGoalMinutes: 20,
        streakDays: 0,
        weeklyAccuracy: 0,
        weeklyAccuracyDelta: 0,
        expectedGrade: null,
        expectedGradeFrom: null,
      });
      return;
    }
    if (path === '/recommendations/today' || path === '/dashboard/chapter-progress') {
      await json(route, []);
      return;
    }
    if (path === '/ai-coach/error-dna') {
      await json(route, { distribution: [], insight: '' });
      return;
    }

    // Keep the contract tests hermetic: an unexpected query must never fall
    // through to a developer's database or accidentally turn into an auth
    // redirect. Screens under test tolerate an empty successful payload.
    await json(route, {});
  });
}

async function reachOnboardingAuth(page: Page) {
  await page.goto('/onboarding');
  // KR-only launch drops the one-option country gate: the welcome CTA lands
  // directly on account creation (country defaults to KR, locale forced ko).
  await page.getByRole('button', { name: /내 수학 코스 만들기|Build my math path/i }).click();
  await expect(page.getByRole('heading', { name: /Matheo 계정 만들기|Create your Matheo account/i })).toBeVisible();
}

async function submitPasswordLogin(page: Page, email: string) {
  await page.getByLabel(/이메일|Email/i).fill(email);
  await page.getByLabel(/비밀번호|Password/i).fill('SafePassword!123');
  await page.getByRole('button', { name: /로그인|Sign in/i }).click();
}

test.describe('redesigned auth entry points', () => {
  test.beforeEach(async ({ page }) => {
    await installKoreanLocaleAndGoogleIdentity(page);
  });

  test('login exposes an actionable Google sign-in and password form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /다시 반가워요|Welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/이메일|Email/i)).toBeVisible();
    await expect(page.getByLabel(/비밀번호|Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인|Sign in/i })).toBeEnabled();

    const google = page.getByRole('button', { name: /Google로 계속하기|Continue with Google/i });
    await expect(google).toBeVisible();
    await expect(google).toBeEnabled();
  });

  test('register exposes an actionable Google sign-up', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /matheo를 어떻게 쓰시나요|Who's using Matheo/i })).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    const google = page.getByRole('button', { name: /Google로 가입하기|Sign up with Google/i });
    await expect(google).toBeVisible();
    await expect(google).toBeEnabled();
  });

  test('onboarding exposes an actionable Google sign-up after the KR market gate', async ({ page }) => {
    await reachOnboardingAuth(page);

    const google = page.getByRole('button', { name: /Google로 가입하기|Sign up with Google/i });
    await expect(google).toBeVisible();
    await expect(google).toBeEnabled();
  });

  test('password login preserves an allowed student deep link', async ({ page }) => {
    let submitted: Record<string, unknown> | undefined;
    await mockAuthApi(page, COMPLETE_KR_STUDENT, {
      onPasswordLogin: (body) => { submitted = body; },
    });

    await page.goto('/app/test');
    await expect(page).toHaveURL(/\/login$/);
    await submitPasswordLogin(page, COMPLETE_KR_STUDENT.email);

    await expect(page).toHaveURL(/\/app\/test$/);
    await expect(page.getByText(/복습 라운드|Review round/i, { exact: true })).toBeVisible();
    expect(submitted).toMatchObject({
      email: COMPLETE_KR_STUDENT.email,
      password: 'SafePassword!123',
    });
  });

  test('password login sends an incomplete student to onboarding before a deep link', async ({ page }) => {
    await mockAuthApi(page, INCOMPLETE_KR_STUDENT);

    await page.goto('/app/test');
    await expect(page).toHaveURL(/\/login$/);
    await submitPasswordLogin(page, INCOMPLETE_KR_STUDENT.email);

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole('button', { name: /내 수학 코스 만들기|Build my math path/i })).toBeVisible();
  });

  test('onboarding Google auth routes a complete student to the role home', async ({ page }) => {
    let submitted: Record<string, unknown> | undefined;
    await mockAuthApi(page, COMPLETE_KR_STUDENT, {
      onGoogleLogin: (body) => { submitted = body; },
    });
    await reachOnboardingAuth(page);

    await page.getByRole('button', { name: /Google로 가입하기|Sign up with Google/i }).click();

    await expect(page).toHaveURL(/\/app$/);
    expect(submitted).toEqual({ idToken: 'e2e.google.id-token' });
  });

  test('onboarding Google auth keeps an incomplete student in profile setup', async ({ page }) => {
    await mockAuthApi(page, INCOMPLETE_KR_STUDENT);
    await reachOnboardingAuth(page);

    await page.getByRole('button', { name: /Google로 가입하기|Sign up with Google/i }).click();

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole('heading', { name: /본인에 대해 알려주세요|Tell us about yourself/i })).toBeVisible();
  });

  test('KR students never see the JEE +4/−1 real-exam entry point', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mathema.access', 'e2e-access');
      localStorage.setItem('mathema.refresh', 'e2e-refresh');
    });
    await mockAuthApi(page, COMPLETE_KR_STUDENT);

    await page.goto('/app/test');

    await expect(page).toHaveURL(/\/app\/test$/);
    await expect(page.getByText(/복습 라운드|Review round/i, { exact: true })).toBeVisible();
    await expect(page.getByText(/JEE식 감점|JEE marking/i)).toHaveCount(0);
    await expect(page.getByText(/실전 모의고사|Full Mock Exam/i)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /모의고사 시작|Start mock exam/i })).toHaveCount(0);
  });

  test('forgot-password remains a public recovery route', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });

  test('real backend dev-login enforces the seeded student onboarding gate', async ({ page, request }) => {
    test.skip(!(await backendReachable(page)), `Backend prerequisite unavailable: ${API_BASE}/health/live`);

    const probe = await request.post(`${API_BASE}/auth/dev-login`, { data: {} });
    test.skip(
      probe.status() === 401 || probe.status() === 404,
      'Backend prerequisite unavailable: ENABLE_DEV_LOGIN=true with the seeded admin',
    );
    if (!probe.ok()) {
      throw new Error(`dev-login probe failed (${probe.status()}): ${await probe.text()}`);
    }
    const tokenPair = (await probe.json())?.data;
    const meResponse = await request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${tokenPair.accessToken}` },
    });
    expect(meResponse.ok(), `seed /users/me failed (${meResponse.status()})`).toBeTruthy();
    const liveMe = (await meResponse.json())?.data;
    expect(liveMe).toMatchObject({ role: 'STUDENT', country: 'KR', birthDate: null });

    const landingPath = await loginAsAdmin(page);
    expect(landingPath).toBe('/onboarding');
    await expect(page.getByRole('button', { name: /내 수학 코스 만들기|Build my math path/i })).toBeVisible();
  });
});

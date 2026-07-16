import { expect, test, type Page, type Route } from '@playwright/test';

async function reply(route: Route, data: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify({ data }),
  });
}

async function installGoogleIdentity(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('mathema.lang', 'ko');
    let callback: ((response: { credential: string }) => void) | undefined;
    (window as any).google = {
      accounts: {
        id: {
          initialize: (config: { callback: (response: { credential: string }) => void }) => {
            callback = config.callback;
          },
          renderButton: (host: HTMLElement) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Google onboarding';
            button.addEventListener('click', () => callback?.({ credential: 'e2e-google-token' }));
            host.appendChild(button);
          },
          prompt: () => {},
        },
      },
    };
  });
}

test('student completes onboarding through diagnostic, result, consent, and ready screens', async ({ page }) => {
  await installGoogleIdentity(page);

  let me = {
    id: 'onboarding-student',
    email: 'onboarding@example.com',
    name: '',
    role: 'STUDENT',
    country: 'KR',
    birthDate: null as string | null,
    emailVerifiedAt: '2026-07-17T00:00:00.000Z',
    guardianConsentVerifiedAt: null,
    gradeLevel: null as string | null,
    studyGoal: null as string | null,
    examDate: '2027-11-18T00:00:00.000Z',
    targetGrade: 2,
    dDay: 489,
  };
  const observed = {
    patches: [] as Array<Record<string, unknown>>,
    answers: [] as Array<Record<string, unknown>>,
    finishCalls: 0,
  };

  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^.*\/api\/v1/, '');
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (path === '/auth/google/id-token' && request.method() === 'POST') {
      await reply(route, { accessToken: 'access', refreshToken: 'refresh' });
      return;
    }
    if (path === '/users/me' && request.method() === 'GET') {
      await reply(route, me);
      return;
    }
    if (path === '/users/me' && request.method() === 'PATCH') {
      const patch = request.postDataJSON() as Record<string, unknown>;
      observed.patches.push(patch);
      me = { ...me, ...patch } as typeof me;
      await reply(route, me);
      return;
    }
    if (path === '/config/features') {
      await reply(route, {
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
    if (path === '/diagnostic/start' && request.method() === 'POST') {
      await reply(route, {
        sessionId: 'diagnostic-1',
        problems: [{
          id: 'problem-1',
          body: '2 + 2 = ?',
          difficulty: 'EASY',
          conceptLessonId: 'lesson-1',
          step: {
            id: 'step-1',
            stepIndex: 1,
            prompt: '정답을 고르세요.',
            choices: [
              { id: 'choice-1', choiceIndex: 1, text: '4' },
              { id: 'choice-2', choiceIndex: 2, text: '5' },
            ],
          },
        }],
      });
      return;
    }
    if (path === '/diagnostic/answer' && request.method() === 'POST') {
      observed.answers.push(request.postDataJSON() as Record<string, unknown>);
      await reply(route, { attemptId: 'attempt-1', isCorrect: true });
      return;
    }
    if (path === '/diagnostic/diagnostic-1/finish' && request.method() === 'POST') {
      observed.finishCalls += 1;
      await reply(route, {
        sessionId: 'diagnostic-1',
        attempted: 1,
        correct: 1,
        masteries: [{
          conceptId: 'concept-1',
          conceptName: 'Arithmetic',
          conceptNameKo: '산술',
          conceptCode: 'ARITH',
          score: 100,
        }],
        firstSessionPlan: [],
      });
      return;
    }

    // The Learn landing page may prefetch its empty curriculum state after
    // onboarding completes. Unknown reads remain hermetic and successful.
    await reply(route, []);
  });

  await page.goto('/onboarding');
  await page.getByRole('button', { name: /내 수학 코스 만들기|Build my math path/i }).click();

  await page.locator('.pre-auth-age-birthdate').fill('2000-01-01');
  await page.locator('.pre-auth-age-region').selectOption('KR');
  await page.locator('.pre-auth-age-submit').click();
  await page.getByRole('button', { name: 'Google onboarding' }).click();

  await expect(page.locator('.age-grid')).toBeVisible();
  await page.locator('.screen-body input').first().fill('온보딩 학생');
  await page.locator('.age-chip').filter({ hasText: /^18$/ }).click();
  await page.locator('.screen-foot .btn').first().click();

  // BOARD is the safe KR default goal; moving forward persists profile + goal.
  await page.locator('.screen-foot .btn').first().click();
  await expect(page.getByText('2 + 2 = ?')).toBeVisible();
  await page.getByRole('radiogroup').first().getByRole('radio').first().click();
  await page.locator('.screen-foot .btn').first().click();

  await expect(page.getByText('산술').first()).toBeVisible();
  await page.locator('.screen-foot .btn').first().click();
  await page.locator('.screen-foot .btn').first().click();
  await page.locator('.screen-foot .btn').first().click();

  await expect(page).toHaveURL(/\/app\/learn$/);
  expect(observed.answers).toEqual([expect.objectContaining({
    sessionId: 'diagnostic-1',
    problemId: 'problem-1',
    choiceId: 'choice-1',
  })]);
  expect(observed.finishCalls).toBe(1);
  expect(observed.patches).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: '온보딩 학생', gradeLevel: 'CLASS_7' }),
    expect.objectContaining({ gradeLevel: 'CLASS_7', studyGoal: 'BOARD' }),
    expect.objectContaining({ pushRemindersEnabled: false }),
  ]));
});

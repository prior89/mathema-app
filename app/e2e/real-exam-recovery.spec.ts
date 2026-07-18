import { expect, test, type Route } from '@playwright/test';

async function reply(route: Route, data: unknown) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data }),
  });
}

test('real exam recovers when a lost submit response is followed by already-finalized', async ({ page }) => {
  const resultId = 'real-recovery-result';
  const sessionKey = `mathema.realexam.${resultId}`;
  const progressKey = `mathema.realexam.progress.${resultId}`;

  await page.addInitScript(({ resultId, sessionKey, progressKey }) => {
    localStorage.setItem('mathema.access', 'e2e-access');
    localStorage.setItem('mathema.refresh', 'e2e-refresh');
    localStorage.setItem('mathema.lang', 'en');
    localStorage.setItem('mathema.langPreference', 'en');
    localStorage.setItem(sessionKey, JSON.stringify({
      resultId,
      userId: 'real-student',
      name: 'Full paper recovery',
      totalMinutes: 50,
      origin: 'test',
      problems: [{
        id: 'real-problem-1',
        source: 'recovery-e2e',
        body: '2 + 2 = ?',
        difficulty: 'EASY',
        steps: [{
          id: 'real-step-1',
          stepIndex: 1,
          stepType: 'ANSWER',
          prompt: 'Choose the answer.',
          choices: [
            { id: 'real-choice-1', choiceIndex: 1, text: '4' },
            { id: 'real-choice-2', choiceIndex: 2, text: '5' },
          ],
        }],
      }],
    }));
    localStorage.setItem(progressKey, JSON.stringify({
      answers: { 'real-problem-1': 'real-choice-1' },
      marked: [],
      startedAt: Date.now(),
    }));
  }, { resultId, sessionKey, progressKey });

  let paperSubmissions = 0;
  let detailLoads = 0;
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^.*\/api\/v1/, '');
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (path === '/users/me') {
      await reply(route, {
        id: 'real-student',
        email: 'real@example.com',
        name: 'Real Student',
        role: 'STUDENT',
        country: 'KR',
        birthDate: '2000-01-01T00:00:00.000Z',
        emailVerifiedAt: '2026-07-17T00:00:00.000Z',
        guardianConsentVerifiedAt: null,
        gradeLevel: 'CLASS_11',
        studyGoal: 'BOARD',
        examDate: '2027-11-18T00:00:00.000Z',
        targetGrade: 2,
        dDay: 489,
      });
      return;
    }
    if (path === '/config/features') {
      await reply(route, { flags: {}, rolloutPct: {} });
      return;
    }
    if (path === `/mock-exams/results/${resultId}/submit-paper` && request.method() === 'POST') {
      paperSubmissions += 1;
      if (paperSubmissions === 1) {
        await route.abort('failed');
        return;
      }
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'mock_exam_already_finalized',
            message: 'This mock exam is already finalized.',
          },
        }),
      });
      return;
    }
    if (path === `/mock-exams/results/${resultId}` && request.method() === 'GET') {
      detailLoads += 1;
      await reply(route, {
        id: resultId,
        name: 'Full paper recovery',
        type: 'REAL',
        takenAt: '2026-07-17T00:00:00.000Z',
        score: 80,
        grade: 2,
        percentile: 88,
        durationMin: 12,
        totalMinutes: 50,
        problems: [],
      });
      return;
    }
    if (path === '/mock-exams/summary') {
      await reply(route, { lastScore: 80, bestScore: 80, attemptCount: 1 });
      return;
    }
    await reply(route, {});
  });

  await page.goto(`/app/mocks/real/${resultId}`);
  await page.getByRole('button', { name: 'Submit paper', exact: true }).click();

  const confirm = page.getByRole('button', { name: 'Submit', exact: true });
  await confirm.click();
  await expect(page.getByRole('alert')).toHaveText('Submission failed. Please try again.');
  expect(paperSubmissions).toBe(1);

  await confirm.click();
  await expect(page).toHaveURL(new RegExp(`/app/mocks/result/${resultId}$`));
  await expect(page.getByText('Full paper recovery')).toBeVisible();
  expect(paperSubmissions).toBe(2);
  expect(detailLoads).toBeGreaterThan(0);

  const stored = await page.evaluate(({ sessionKey, progressKey }) => ({
    session: localStorage.getItem(sessionKey),
    progress: localStorage.getItem(progressKey),
  }), { sessionKey, progressKey });
  expect(stored).toEqual({ session: null, progress: null });
});

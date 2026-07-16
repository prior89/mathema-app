import { expect, test, type Route } from '@playwright/test';

async function reply(route: Route, data: unknown) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data }),
  });
}

function exam(resultId: string) {
  return {
    resultId,
    name: 'AI 맞춤형 약점 시험',
    type: 'RECOMMENDED',
    totalMinutes: 50,
    problems: [{
      id: `${resultId}-problem`,
      source: 'weakness-loop',
      body: 'x + 1 = 3',
      difficulty: 'EASY',
      steps: [{
        id: `${resultId}-step`,
        stepIndex: 1,
        stepType: 'CONCEPT',
        prompt: 'x의 값은?',
        choices: [
          { id: `${resultId}-wrong`, choiceIndex: 1, text: '1' },
          { id: `${resultId}-correct`, choiceIndex: 2, text: '2' },
        ],
      }],
    }],
  };
}

test('weakness test flows through report and starts a fresh retest', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mathema.access', 'e2e-access');
    localStorage.setItem('mathema.refresh', 'e2e-refresh');
    localStorage.setItem('mathema.lang', 'ko');
  });

  let recommendedStarts = 0;
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^.*\/api\/v1/, '');
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (path === '/users/me') {
      await reply(route, {
        id: 'weakness-student',
        email: 'weakness@example.com',
        name: '약점 학생',
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
    if (path === '/wrong-notes/queue/next') {
      await reply(route, { wrongNote: null, totalEligible: 0, nextEligibleAt: null });
      return;
    }
    if (path === '/mock-exams/recommended/start' && request.method() === 'POST') {
      recommendedStarts += 1;
      await reply(route, exam(`result-${recommendedStarts}`));
      return;
    }
    if (path === '/mock-exams/results/result-1/answer' && request.method() === 'POST') {
      await reply(route, {
        attemptId: 'attempt-1',
        isCorrect: false,
        choice: {
          isCorrect: false,
          text: '1',
          rationale: '1을 빼면 x = 2입니다.',
          distractorType: 'CALC_ERROR',
        },
      });
      return;
    }
    if (path === '/mock-exams/results/result-1/finalize' && request.method() === 'POST') {
      await reply(route, {
        score: 60,
        grade: 4,
        percentile: 55,
        durationMin: 1,
        correctCount: 0,
        totalProblems: 1,
        attemptedProblems: 1,
      });
      return;
    }
    if (path === '/mock-exams/results/result-1' && request.method() === 'GET') {
      await reply(route, {
        id: 'result-1',
        name: 'AI 맞춤형 약점 시험',
        type: 'RECOMMENDED',
        takenAt: '2026-07-17T00:00:00.000Z',
        score: 60,
        grade: 4,
        percentile: 55,
        durationMin: 1,
        totalMinutes: 50,
        scoreDelta: 10,
        comparison: {
          previousResultId: 'result-0',
          previousScore: 50,
          currentScore: 60,
          delta: 10,
          trend: 'improved',
        },
        weakAreas: [{
          conceptId: 'algebra',
          code: 'ALG',
          name: '일차방정식',
          problemCount: 1,
          incorrectProblems: 1,
          accuracyPct: 0,
        }],
        problems: [{
          problemId: 'result-1-problem',
          source: 'weakness-loop',
          body: 'x + 1 = 3',
          allCorrect: false,
          steps: [{ stepIndex: 1, isCorrect: false, myChoice: '1', rationale: 'x = 2' }],
        }],
      });
      return;
    }
    if (path === '/mock-exams/summary') {
      await reply(route, {
        lastScore: 60,
        expectedGrade: 4,
        reliability: 75,
        pointsToNextGrade: 5,
        percentile: 55,
        bestScore: 60,
        avgScore: 55,
        attemptCount: 2,
        improvementSinceFirst: 10,
        scoreDelta: 10,
      });
      return;
    }

    await reply(route, {});
  });

  await page.goto('/app/test');
  await page.getByRole('button', { name: /내 약점 시험 시작|Start my weak-area test/i }).click();
  await expect(page).toHaveURL(/\/app\/mocks\/play\/result-1$/);
  await expect(page.getByRole('button', { name: /복습|Test/i })).toHaveAttribute('aria-current', 'page');

  await page.locator('button.choice').filter({ hasText: '1' }).first().click();
  await page.getByRole('button', { name: /확인하기|Submit/i }).click();
  await page.getByRole('button', { name: /시험 마무리|Finish exam/i }).click();

  await expect(page).toHaveURL(/\/app\/mocks\/result\/result-1$/);
  await expect(page.getByText('이번 시험에서 찾은 약점')).toBeVisible();
  await expect(page.getByText('일차방정식')).toBeVisible();
  await expect(page.getByRole('button', { name: /전체 학습 리포트|Full learning report/i })).toBeVisible();

  await page.getByRole('button', { name: /다시 약점 시험|Retest weak areas/i }).click();
  await expect(page).toHaveURL(/\/app\/mocks\/play\/result-2$/);
  expect(recommendedStarts).toBe(2);
});

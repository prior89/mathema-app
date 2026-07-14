import { defineConfig, devices } from '@playwright/test';

/**
 * matheo — E2E config.
 *
 * 실행:
 *   npm run e2e             # 전체
 *   npm run e2e -- --ui     # 인터랙티브
 *
 * 가정:
 *   - backend  http://localhost:4000  (start:dev)
 *   - frontend http://localhost:5173  (vite dev)
 *
 * CI 에서는 webServer 가 자동 기동.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // Vite's first lazy-route compilation can otherwise be starved by one
  // worker per CPU on high-core developer machines.
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // mobile (Capacitor 라는 wrapping 전이라 viewport 만 시뮬레이트)
    { name: 'mobile',   use: { ...devices['Pixel 7']        } },
  ],

  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Paywall E2E needs the build gate on — otherwise useBillingStatus overwrites
    // the sessionStorage cache to '0' even when the server kill-switch is true.
    env: {
      VITE_BILLING_ENABLED: 'true',
      // The suite supplies an in-page GIS double. This non-secret id keeps the
      // real product "configured" gate active so the tests can prove that all
      // three Google entry points become actionable. External Google OAuth is
      // still a separate release-console prerequisite.
      VITE_GOOGLE_CLIENT_ID:
        process.env.VITE_GOOGLE_CLIENT_ID ?? 'matheo-e2e.apps.googleusercontent.com',
    },
  },
});

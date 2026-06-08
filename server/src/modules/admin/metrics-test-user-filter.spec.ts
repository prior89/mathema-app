import {
  isMetricsExcludedEmail,
  isMetricsExcludedUser,
  metricsExcludeEmailPatterns,
} from './metrics-test-user-filter';

describe('metrics-test-user-filter', () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it('includes built-in seed/dev emails and env overrides', () => {
    process.env.ADMIN_EMAILS = 'Ops@Example.com';
    process.env.METRICS_EXCLUDE_EMAILS = 'qa@matheo.ai';
    const patterns = metricsExcludeEmailPatterns();
    expect(patterns).toContain('admin@mathema.app');
    expect(patterns).toContain('polopot123@gmail.com');
    expect(patterns).toContain('ops@example.com');
    expect(patterns).toContain('qa@matheo.ai');
  });

  it('flags E2E throwaway emails', () => {
    expect(isMetricsExcludedEmail('e2e-1710000000@example.com')).toBe(true);
    expect(isMetricsExcludedEmail('real.user@gmail.com')).toBe(false);
  });

  it('excludes non-student roles even with a normal email', () => {
    expect(
      isMetricsExcludedUser({
        id: 'u1',
        email: 'teacher@school.edu',
        role: 'TEACHER',
      }),
    ).toBe(true);
    expect(
      isMetricsExcludedUser({
        id: 'u2',
        email: 'student@school.edu',
        role: 'STUDENT',
      }),
    ).toBe(false);
  });
});
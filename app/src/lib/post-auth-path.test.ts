import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Me } from './queries';
import { postAuthPath, resolvePostAuthPath } from './post-auth-path';

function student(overrides: Partial<Me> = {}): Me {
  return {
    id: 'student-1',
    name: 'Student',
    email: 'student@example.com',
    examDate: '2027-01-01',
    targetGrade: 1,
    dDay: 200,
    role: 'STUDENT',
    country: 'IN',
    gradeLevel: 'CLASS_10',
    birthDate: `${new Date().getUTCFullYear() - 17}-01-01`,
    ...overrides,
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('postAuthPath guardian consent contract', () => {
  it('keeps a minor student on the guardian waiting page before approval', () => {
    expect(postAuthPath(student({ guardianConsentVerifiedAt: null })))
      .toBe('/guardian-consent');
  });

  it('advances only the student after guardian approval', () => {
    expect(postAuthPath(student({ guardianConsentVerifiedAt: new Date().toISOString() })))
      .toBe('/app');
  });

  it('does not route a parent account through the student consent flow', () => {
    expect(postAuthPath(student({
      role: 'PARENT',
      guardianConsentVerifiedAt: null,
    })))
      .toBe('/parent');
  });
});

describe('resolvePostAuthPath deep-link contract', () => {
  it('returns a protected student deep link after all profile gates pass', () => {
    expect(resolvePostAuthPath(
      student({ guardianConsentVerifiedAt: new Date().toISOString() }),
      '/app/notes/note-1?from=push',
    )).toBe('/app/notes/note-1?from=push');
  });

  it('keeps onboarding/guardian gates ahead of a requested deep link', () => {
    expect(resolvePostAuthPath(student({ guardianConsentVerifiedAt: null }), '/app/review'))
      .toBe('/guardian-consent');
  });

  it('rejects protocol-relative and cross-role destinations', () => {
    const me = student({ guardianConsentVerifiedAt: new Date().toISOString() });
    expect(resolvePostAuthPath(me, '//evil.example/path')).toBe('/app');
    expect(resolvePostAuthPath(me, '/admin')).toBe('/app');
  });

  it('does not reuse another account\'s local onboarding completion', () => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    });
    localStorage.setItem('mathema.onboarding', JSON.stringify({
      userId: 'student-1',
      completedAt: new Date().toISOString(),
    }));
    expect(postAuthPath(student({
      id: 'student-2',
      gradeLevel: null,
      birthDate: `${new Date().getUTCFullYear() - 20}-01-01`,
    }))).toBe('/onboarding');
  });
});

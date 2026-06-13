import { describe, expect, it } from 'vitest';
import type { Me } from './queries';
import { postAuthPath } from './post-auth-path';

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

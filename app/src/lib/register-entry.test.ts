import { describe, expect, it } from 'vitest';
import { shouldUseStandaloneRegister } from './register-entry';

function params(value = '') {
  return new URLSearchParams(value);
}

describe('standalone registration entry', () => {
  it.each([
    '',
    'role=student',
    'role=teacher',
    'childEmail=child%40example.com',
  ])('sends an ordinary student entry (%s) through onboarding', (query) => {
    expect(shouldUseStandaloneRegister(params(query), false)).toBe(false);
  });

  it.each([
    'role=parent',
    'role=PARENT&childEmail=child%40example.com',
  ])('preserves the standalone exception (%s)', (query) => {
    expect(shouldUseStandaloneRegister(params(query), false)).toBe(true);
  });

  it('keeps upgrade=1 only for an authenticated guest', () => {
    expect(shouldUseStandaloneRegister(params('upgrade=1'), true)).toBe(true);
    expect(shouldUseStandaloneRegister(params('upgrade=1'), false)).toBe(false);
  });
});

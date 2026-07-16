import { describe, expect, it } from 'vitest';
import { formatAuthError } from './auth-errors';

describe('formatAuthError', () => {
  const linkRequired = {
    response: {
      status: 409,
      data: {
        error: {
          code: 'google_account_link_required',
          message: 'internal message',
        },
      },
    },
  };

  it('explains the safe recovery path for an unlinked external-email account', () => {
    expect(formatAuthError(linkRequired, { context: 'login', locale: 'en' }))
      .toBe('Enter the existing account password, then use Google again. You can reset the password if needed.');
    expect(formatAuthError(linkRequired, { context: 'login', locale: 'ko' }))
      .toContain('비밀번호');
  });
});

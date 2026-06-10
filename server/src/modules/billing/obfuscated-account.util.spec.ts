import { deriveObfuscatedAccountId, OBFUSCATED_ACCOUNT_VERSION } from './obfuscated-account.util';

describe('deriveObfuscatedAccountId', () => {
  it('returns stable hex HMAC for the same secret + user', () => {
    const a = deriveObfuscatedAccountId('test-secret', 'user-123');
    const b = deriveObfuscatedAccountId('test-secret', 'user-123');
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('differs across users and secrets', () => {
    const base = deriveObfuscatedAccountId('secret-a', 'user-1');
    expect(deriveObfuscatedAccountId('secret-b', 'user-1')).not.toBe(base);
    expect(deriveObfuscatedAccountId('secret-a', 'user-2')).not.toBe(base);
  });

  it('uses the play:v1 version prefix', () => {
    const id = deriveObfuscatedAccountId('secret', 'uid', OBFUSCATED_ACCOUNT_VERSION);
    expect(id.length).toBeLessThanOrEqual(64);
    expect(() => deriveObfuscatedAccountId('', 'uid')).toThrow(
      'PLAY_OBFUSCATED_ACCOUNT_SECRET is not configured',
    );
  });
});
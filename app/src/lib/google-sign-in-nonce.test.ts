import { describe, expect, it, vi } from 'vitest';
import {
  consumeGoogleSignInNonce,
  createGoogleSignInNonce,
  rememberGoogleSignInNonce,
} from './google-sign-in-nonce';

describe('Google sign-in nonce handoff', () => {
  it('generates a 256-bit nonce using the platform CSPRNG', () => {
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.forEach((_, index) => { bytes[index] = index; });
      return bytes;
    });

    expect(createGoogleSignInNonce({ getRandomValues } as Pick<Crypto, 'getRandomValues'>))
      .toBe('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f');
    expect(getRandomValues).toHaveBeenCalledOnce();
  });

  it('fails closed when secure randomness is unavailable', () => {
    expect(() => createGoogleSignInNonce(null)).toThrow('Secure randomness');
  });

  it('binds the nonce to one exact token and consumes it once', () => {
    rememberGoogleSignInNonce('token-a', 'nonce-a');

    expect(consumeGoogleSignInNonce('token-b')).toBeUndefined();
    expect(consumeGoogleSignInNonce('token-a')).toBe('nonce-a');
    expect(consumeGoogleSignInNonce('token-a')).toBeUndefined();
  });

  it('does not return an expired nonce', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-16T00:00:00Z'));
    rememberGoogleSignInNonce('expired-token', 'expired-nonce');
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);

    expect(consumeGoogleSignInNonce('expired-token')).toBeUndefined();
    vi.useRealTimers();
  });
});

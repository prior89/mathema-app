import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import {
  clearNativeGoogleCredentialState,
  GoogleAuth,
} from './google-auth-bridge';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn() },
  registerPlugin: vi.fn(() => ({
    isAvailable: vi.fn(),
    signIn: vi.fn(),
    clearCredentialState: vi.fn(),
  })),
}));

describe('clearNativeGoogleCredentialState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears the Android provider state on native logout', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    await clearNativeGoogleCredentialState();

    expect(GoogleAuth.clearCredentialState).toHaveBeenCalledOnce();
  });

  it('is a no-op for web logout', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    await clearNativeGoogleCredentialState();

    expect(GoogleAuth.clearCredentialState).not.toHaveBeenCalled();
  });
});

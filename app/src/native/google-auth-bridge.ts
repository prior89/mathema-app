import { Capacitor, registerPlugin } from '@capacitor/core';

export interface GoogleAuthPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  signIn(options: { nonce: string }): Promise<{ idToken: string }>;
  clearCredentialState(): Promise<void>;
}

export const GoogleAuth = registerPlugin<GoogleAuthPlugin>('GoogleAuth');

export function isNativeGoogleAuthPlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/** Best-effort callers should catch failures so a provider problem can never
 * trap the user in a logged-in application session. */
export async function clearNativeGoogleCredentialState(): Promise<void> {
  if (!isNativeGoogleAuthPlatform()) return;
  await GoogleAuth.clearCredentialState();
}

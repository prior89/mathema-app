import { Capacitor, registerPlugin } from '@capacitor/core';

export interface GoogleAuthPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  signIn(): Promise<{ idToken: string }>;
}

export const GoogleAuth = registerPlugin<GoogleAuthPlugin>('GoogleAuth');

export function isNativeGoogleAuthPlatform(): boolean {
  return Capacitor.isNativePlatform();
}

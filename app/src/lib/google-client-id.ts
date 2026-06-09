/** Web OAuth client ID — Cloud Console > Credentials > OAuth 2.0 Client (Web). */
export function getGoogleClientId(): string {
  return (import.meta as ImportMeta & { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env
    ?.VITE_GOOGLE_CLIENT_ID ?? '';
}

export function isGoogleSignInConfigured(): boolean {
  return getGoogleClientId().length > 0;
}
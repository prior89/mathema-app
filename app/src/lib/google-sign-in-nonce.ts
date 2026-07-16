const NONCE_BYTE_LENGTH = 32;
const NONCE_TTL_MS = 5 * 60 * 1000;
const MAX_PENDING_NONCES = 8;

type RandomSource = Pick<Crypto, 'getRandomValues'>;

type PendingNonce = {
  nonce: string;
  expiresAt: number;
};

// A Google credential callback only exposes the signed ID token. Keep the
// request nonce in memory just long enough for AuthContext to attach it to the
// backend exchange. Nothing is persisted across reloads or written to logs.
const pendingByIdToken = new Map<string, PendingNonce>();

export function createGoogleSignInNonce(
  randomSource: RandomSource | null | undefined = globalThis.crypto,
): string {
  if (!randomSource?.getRandomValues) {
    throw new Error('Secure randomness is unavailable for Google sign-in.');
  }

  const bytes = new Uint8Array(NONCE_BYTE_LENGTH);
  randomSource.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

export function rememberGoogleSignInNonce(idToken: string, nonce: string): void {
  const now = Date.now();
  for (const [token, pending] of pendingByIdToken) {
    if (pending.expiresAt <= now) pendingByIdToken.delete(token);
  }

  // A user can only have one visible sign-in surface, but cap the map as a
  // defensive bound if a broken caller repeatedly starts overlapping flows.
  while (pendingByIdToken.size >= MAX_PENDING_NONCES) {
    const oldest = pendingByIdToken.keys().next().value as string | undefined;
    if (!oldest) break;
    pendingByIdToken.delete(oldest);
  }

  pendingByIdToken.set(idToken, { nonce, expiresAt: now + NONCE_TTL_MS });
}

/** Returns a nonce at most once, and only for the exact ID token that carried
 * it. This prevents a concurrent Google response from borrowing another
 * response's nonce before the backend exchange. */
export function consumeGoogleSignInNonce(idToken: string): string | undefined {
  const pending = pendingByIdToken.get(idToken);
  pendingByIdToken.delete(idToken);
  if (!pending || pending.expiresAt <= Date.now()) return undefined;
  return pending.nonce;
}

import type { TranslationKey } from './translations';

type CodedError = { code?: unknown };

/**
 * Converts native Credential Manager failures into actionable UI copy.
 * A user closing the account chooser is expected, so cancellation stays silent.
 */
export function googleSignInErrorKey(
  error: unknown,
  fallback: TranslationKey,
): TranslationKey | null {
  const code = typeof error === 'object' && error !== null
    ? (error as CodedError).code
    : undefined;

  switch (code) {
    case 'GOOGLE_SIGN_IN_CANCELLED':
      return null;
    case 'GOOGLE_NO_CREDENTIAL':
      return 'auth.google.noCredential';
    case 'GOOGLE_SIGN_IN_FAILED':
      return 'auth.google.tryAgain';
    default:
      return fallback;
  }
}

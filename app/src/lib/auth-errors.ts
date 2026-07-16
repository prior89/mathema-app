type AuthErrorContext = 'login' | 'register' | 'onboarding';

type FormatAuthErrorOpts = {
  context: AuthErrorContext;
  /** When set, prefer KR copy for network/throttle messages. */
  locale?: 'ko' | 'en' | 'auto';
};

function isKorean(locale: FormatAuthErrorOpts['locale']): boolean {
  if (locale === 'ko') return true;
  if (locale === 'en') return false;
  try {
    return localStorage.getItem('mathema.lang') === 'ko';
  } catch {
    return false;
  }
}

const FALLBACK: Record<AuthErrorContext, { ko: string; en: string }> = {
  login: { ko: '로그인에 실패했어요.', en: 'Sign in failed.' },
  register: { ko: '회원가입에 실패했어요.', en: 'Sign up failed.' },
  onboarding: { ko: '가입에 실패했어요.', en: 'Sign up failed.' },
};

/** Map axios-style auth errors to user-facing copy (429 / offline / backend message). */
export function formatAuthError(e: unknown, opts: FormatAuthErrorOpts): string {
  const kr = isKorean(opts.locale);
  const err = e as {
    response?: { status?: number; data?: { error?: { message?: string; code?: string } } };
  };
  const status = err?.response?.status;
  const rawMsg = err?.response?.data?.error?.message;
  const code = err?.response?.data?.error?.code;

  if (status === 429) {
    return kr
      ? '로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.'
      : 'Too many attempts. Please retry in a minute.';
  }
  if (!status) {
    return kr
      ? '서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.'
      : 'Cannot reach the server. Check your connection.';
  }
  if (code === 'PASSWORD_BREACHED') {
    return kr
      ? '이 비밀번호는 보안 사고로 노출된 적이 있어요. 다른 비밀번호를 골라주세요.'
      : 'This password has been seen in a public data breach. Please pick a different one.';
  }
  if (code === 'google_account_link_required') {
    if (opts.context !== 'login') {
      return kr
        ? '기존 계정이 있어요. 로그인 화면에서 비밀번호를 확인한 뒤 Google 계정을 연결해 주세요.'
        : 'An account already exists. Use the sign-in screen to verify its password and link Google.';
    }
    return kr
      ? '기존 계정 비밀번호를 입력한 뒤 Google 버튼을 다시 눌러주세요. 비밀번호를 모르면 재설정할 수 있어요.'
      : 'Enter the existing account password, then use Google again. You can reset the password if needed.';
  }
  if (rawMsg === 'email already used') {
    return kr
      ? '이미 가입된 이메일이에요. 로그인 페이지로 이동해주세요.'
      : 'This email is already registered. Please sign in instead.';
  }
  const fb = FALLBACK[opts.context];
  // Korean UI never shows raw server messages — they are English dev-strings
  // ("Account deactivated", "No adaptive diagnostic problems available…").
  // Known cases are mapped above; everything else gets the Korean fallback.
  // English UI keeps the (often more specific) raw message.
  if (kr) return fb.ko;
  return rawMsg ?? fb.en;
}

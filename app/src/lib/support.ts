/**
 * In-app support contact.
 *
 * Competitor review audit (2026-07-21): the most damaging complaints about
 * Gauthmath/Mathway/Vedantu were not features but "a payment problem happened
 * and there was nowhere to go". Role model is the Duolingo pattern: one
 * published address, store purchases routed to the store's own refund portal,
 * and the contact email pre-filled with diagnostics so a billing/account
 * reply does not need a follow-up round-trip.
 *
 * The address must stay in sync with the one published in the terms
 * (PolicyPage, section "약관, 계정 또는 결제 문의").
 */
export const SUPPORT_EMAIL = 'VeraStudy01@gmail.com';

export type SupportTopic = 'general' | 'billing';

interface SupportMailtoOptions {
  topic: SupportTopic;
  /** Localized subject line, e.g. "[Matheo] Billing question". */
  subject: string;
  userId?: string | null;
  accountEmail?: string | null;
  /** UI language code, included so support can reply in the right language. */
  lang?: string | null;
  /** Extra topic context, e.g. the subscription product id. */
  detail?: string | null;
}

/**
 * Diagnostics block appended below the user's message. English on purpose:
 * it is read by the support inbox, not by the student.
 */
export function buildSupportDiagnostics(opts: SupportMailtoOptions): string {
  const version =
    (import.meta as any).env?.VITE_APP_VERSION ?? 'dev';
  const lines = [
    '--- diagnostics (please keep) ---',
    `topic: ${opts.topic}`,
    `user: ${opts.userId ?? 'unknown'}${opts.accountEmail ? ` (${opts.accountEmail})` : ''}`,
    `app: ${version}`,
    `lang: ${opts.lang ?? 'unknown'}`,
    `platform: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'}`,
  ];
  if (opts.detail) lines.push(`detail: ${opts.detail}`);
  return lines.join('\n');
}

export function buildSupportMailtoUrl(opts: SupportMailtoOptions): string {
  const body = `\n\n\n${buildSupportDiagnostics(opts)}\n`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(opts.subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Open the mail client. In the Android WebView shell mailto may be swallowed
 * by the host when no handler is configured, so callers should always render
 * the address itself (selectable / copyable) next to the button as fallback.
 */
export function openSupportMail(opts: SupportMailtoOptions): void {
  window.location.href = buildSupportMailtoUrl(opts);
}

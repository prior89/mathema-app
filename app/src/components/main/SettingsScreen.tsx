/* SettingsScreen — sage-themed settings inside /app/me/settings.
 * Wires to existing backend: /privacy/policy, /privacy/consents, /privacy/consents/:kind, DELETE /users/me, GET /users/me/export.
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post, patch, del, downloadExport } from '../../lib/api';
import { fetchMe, inviteParent, type Me } from '../../lib/queries';
import { toast } from '../Toast';
import { useT, type Lang } from '../../lib/i18n';
import {
  getLangPreference,
  setLangPreference,
  resolveAppLang,
} from '../../lib/lang-preference';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { requiresGuardianConsent } from '../../lib/guardian-consent';
import { SUPPORT_EMAIL, openSupportMail } from '../../lib/support';

// Backend /privacy/consents 응답 shape — 'active' (boolean) 사용. 이전엔 'granted' 라 매번 undefined 였음.
type Consent = {
  kind: 'DATA_PROCESSING' | 'ANALYTICS' | 'AI_TRAINING' | 'MARKETING';
  active: boolean;
  grantedAt: string | null;
  revokedAt: string | null;
  policyVersion: string | null;
};

export function SettingsScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { t, lang, setLang } = useT();
  const [langPref, setLangPrefState] = useState<SettingsLangPref>(() => {
    const p = getLangPreference();
    return p === 'ko' || p === 'en' ? p : 'auto';
  });
  const { refreshUser, logout, completeAccountDeletion } = useAuth();
  const { mode: themeMode, setMode: setThemeMode } = useTheme();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const consents = useQuery({
    queryKey: ['consents'],
    queryFn: () => get<Consent[]>('/privacy/consents'),
  });

  const toggle = useMutation({
    mutationFn: async (c: { kind: Consent['kind']; active: boolean }) => {
      if (c.active) await del(`/privacy/consents/${c.kind.toLowerCase()}`);
      else await post(`/privacy/consents/${c.kind.toLowerCase()}`, {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consents'] }),
    onError: () => toast(t('settingsScreen.privacy.updateFailed'), 'error'),
  });

  // Parent-invite (student referral loop) — see the section markup below.
  const [parentInviteEmail, setParentInviteEmail] = useState('');
  const inviteMut = useMutation({
    mutationFn: (email: string) => inviteParent(email),
    onSuccess: (r) => {
      if (r.alreadyLinked) {
        toast(t('settingsScreen.parentInvite.alreadyLinked'), 'info');
      } else {
        toast(t('settingsScreen.parentInvite.sent'), 'success');
        setParentInviteEmail('');
      }
    },
    onError: () => toast(t('settingsScreen.parentInvite.failed'), 'error'),
  });

  const pushReminders = me.data?.pushRemindersEnabled !== false;
  const togglePush = useMutation({
    mutationFn: (enabled: boolean) => patch<Me>('/users/me', { pushRemindersEnabled: enabled }),
    onSuccess: async () => {
      await refreshUser();
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const changeCountry = useMutation({
    mutationFn: (country: 'IN' | 'KR') => patch<Me>('/users/me', { country }),
    onSuccess: async () => {
      await refreshUser();
      await qc.invalidateQueries({ queryKey: ['me'] });
      if (getLangPreference() === 'auto') {
        const meFresh = await fetchMe();
        setLang(resolveAppLang(meFresh.country));
      } else {
        await qc.invalidateQueries();
      }
    },
  });

  const applyLangPreference = (pref: SettingsLangPref) => {
    setLangPreference(pref);
    setLangPrefState(pref);
    const next: Lang = pref === 'auto' ? resolveAppLang(me.data?.country) : pref;
    if (lang !== next) setLang(next);
  };

  const [deletingConfirm, setDeletingConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const deleteAccount = useMutation({
    mutationFn: () => del('/users/me'),
    onSuccess: () => { void completeAccountDeletion(); },
  });
  const confirmOk = confirmText === 'DELETE';

  const items: Array<{ kind: Consent['kind']; name: string; desc: string; req?: boolean }> = [
    { kind: 'DATA_PROCESSING', name: t('settingsScreen.privacy.essential.name'), desc: t('settingsScreen.privacy.essential.desc'), req: true },
    { kind: 'ANALYTICS', name: t('settingsScreen.privacy.analytics.name'), desc: t('settingsScreen.privacy.analytics.desc') },
    { kind: 'AI_TRAINING', name: t('settingsScreen.privacy.aiTraining.name'), desc: t('settingsScreen.privacy.aiTraining.desc') },
    { kind: 'MARKETING', name: t('settingsScreen.privacy.marketing.name'), desc: t('settingsScreen.privacy.marketing.desc') },
  ];
  const optionalConsentActivationBlocked = me.data?.isGuest === true || (
    me.data?.role === 'STUDENT'
    && (!me.data.birthDate || requiresGuardianConsent(me.data.birthDate, me.data.country))
  );

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/me')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 44, height: 44, marginLeft: -10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={t('lesson.back')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{t('settingsScreen.eyebrow')}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t('settingsScreen.title')}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {/* Account */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.account.section')}</span>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <Row k={t('settingsScreen.row.name')} v={me.data?.name ?? '—'} />
          <Row k={t('settingsScreen.row.email')} v={me.data?.email ?? '—'} />
          <Row
            k={t('settingsScreen.row.role')}
            v={!me.data?.role || me.data.role === 'STUDENT' ? t('me.role.default') : me.data.role}
          />
          <Row
            k={t('settingsScreen.row.class')}
            v={me.data?.gradeLevel ? t(`grade.${me.data.gradeLevel}`) : '—'}
            last
          />
        </div>

        {/* Parent invite — student-side referral loop. The child shares their
            progress; the parent registers via the emailed link; the child then
            approves the connection (existing approval rail). Students only. */}
        {me.data?.role === 'STUDENT' && !me.data?.isGuest && (
          <>
            <div className="section-h">
              <span className="label">{t('settingsScreen.parentInvite.section')}</span>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.55, marginBottom: 10 }}>
                {t('settingsScreen.parentInvite.hint')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  value={parentInviteEmail}
                  onChange={(e) => setParentInviteEmail(e.target.value)}
                  placeholder={t('settingsScreen.parentInvite.placeholder')}
                  style={{
                    flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: 10,
                    border: '1px solid var(--p-border)', background: 'var(--p-surface)',
                    color: 'var(--p-ink)', font: 'inherit', fontSize: 13.5,
                  }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ width: 'auto', padding: '0 16px', height: 44 }}
                  disabled={inviteMut.isPending || !parentInviteEmail.includes('@')}
                  onClick={() => inviteMut.mutate(parentInviteEmail.trim())}
                >
                  {inviteMut.isPending
                    ? t('settingsScreen.parentInvite.sending')
                    : t('settingsScreen.parentInvite.cta')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Region · curriculum */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.region.section')}</span>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--p-muted)', marginBottom: 10, lineHeight: 1.45 }}>
            {t('settingsScreen.region.hint')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {(['KR'] as const).map((c) => {
              const selected = me.data?.country === c;
              const busy = changeCountry.isPending;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={busy || selected}
                  onClick={() => changeCountry.mutate(c)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1px solid ${selected ? 'var(--p-primary)' : 'var(--p-border)'}`,
                    background: selected ? 'var(--p-primary-tint)' : 'var(--p-surface)',
                    color: 'var(--p-ink)',
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    cursor: busy || selected ? 'default' : 'pointer',
                    opacity: busy && !selected ? 0.6 : 1,
                  }}
                >
                  🇰🇷 {t(`settingsScreen.country.${c}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.lang.section')}</span>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--p-muted)', marginBottom: 10, lineHeight: 1.45 }}>
            {t('settingsScreen.lang.hint')}
          </div>
          <LangPreferencePicker
            value={langPref}
            onChange={applyLangPreference}
            labels={{
              auto: t('settingsScreen.lang.auto'),
              ko: t('settingsScreen.lang.ko'),
              en: t('settingsScreen.lang.en'),
            }}
          />
        </div>

        {/* Appearance */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.appearance.section')}</span>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('settingsScreen.theme.label')}</div>
          <ThemeModePicker mode={themeMode} onChange={setThemeMode} />
        </div>

        {/* Notifications */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.notifications.section')}</span>
        </div>
        <div
          className="card"
          style={{
            padding: 16, display: 'flex', gap: 14, alignItems: 'center',
            cursor: togglePush.isPending ? 'wait' : 'pointer',
            opacity: togglePush.isPending ? 0.7 : 1,
          }}
          onClick={() => !togglePush.isPending && togglePush.mutate(!pushReminders)}
          role="switch"
          aria-checked={pushReminders}
          aria-disabled={togglePush.isPending || undefined}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!togglePush.isPending && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              togglePush.mutate(!pushReminders);
            }
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t('settingsScreen.notifications.push.title')}</div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 2, lineHeight: 1.45 }}>
              {t('settingsScreen.notifications.push.desc')}
            </div>
          </div>
          <div className={`toggle ${pushReminders ? 'on' : ''}`} aria-hidden="true" />
        </div>

        {/* Privacy */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.privacy.section')}</span>
        </div>
        {optionalConsentActivationBlocked && (
          <div className="alert" style={{ marginBottom: 8, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('settingsScreen.privacy.restricted')}
          </div>
        )}
        <div className="card" style={{ padding: '4px 16px' }}>
          {items.map((it) => {
            // Required consents (DATA_PROCESSING) are non-revocable — backend rejects
            // DELETE /privacy/consents/data_processing and routes revocation through
            // account deletion. Render them as always-checked regardless of the
            // /privacy/consents payload so the UI never mis-signals "you can opt out".
            const active = it.req
              ? true
              : (consents.data?.find((c) => c.kind === it.kind)?.active ?? false);
            // Restricted accounts may always turn an existing optional grant
            // off, but cannot self-enable a new one.
            const disabled = !!it.req || toggle.isPending || (!active && optionalConsentActivationBlocked);
            return (
              <div key={it.kind} className="consent-row">
                <div
                  className={`ck ${active ? 'checked' : ''}`}
                  onClick={() => !disabled && toggle.mutate({ kind: it.kind, active })}
                  style={{ opacity: disabled ? 0.65 : 1, cursor: disabled ? 'default' : 'pointer' }}
                  role="checkbox"
                  aria-checked={active}
                  aria-disabled={disabled || undefined}
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      toggle.mutate({ kind: it.kind, active });
                    }
                  }}
                >
                  {active && <Glyph.Check accent="var(--p-primary-fg)" size={12} />}
                </div>
                <div className="info">
                  <div className="name">
                    {it.name}
                    {it.req && <span className="req-pill">{t('settingsScreen.privacy.required')}</span>}
                  </div>
                  <div className="desc">{it.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data rights */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.data.section')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            className="btn outline"
            onClick={() => { void logout(); }}
          >
            {t('settingsScreen.logout')}
          </button>
          <button className="btn outline" onClick={() => downloadExport()}>
            {t('settingsScreen.download')}
          </button>
          {!deletingConfirm ? (
            <button
              className="btn outline"
              style={{ color: 'var(--p-danger)', borderColor: 'var(--p-danger)' }}
              onClick={() => setDeletingConfirm(true)}
            >
              {t('settingsScreen.delete')}
            </button>
          ) : (
            <div className="card" style={{ padding: 14, borderColor: 'var(--p-danger)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-danger)' }}>
                {t('settingsScreen.delete.warnTitle')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4, lineHeight: 1.5 }}>
                {t('settingsScreen.delete.warnDesc')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 10, fontFamily: 'var(--font-mono)' }}>
                {t('settingsScreen.delete.typePrompt')}
              </div>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                autoFocus
                style={{
                  marginTop: 4, width: '100%', boxSizing: 'border-box', padding: '10px 12px',
                  borderRadius: 8, border: '1px solid var(--p-border-strong)',
                  background: 'var(--p-surface)', color: 'var(--p-ink)',
                  fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  className="btn outline"
                  onClick={() => { setDeletingConfirm(false); setConfirmText(''); }}
                  style={{ flex: 1 }}
                >
                  {t('settingsScreen.delete.cancel')}
                </button>
                <button
                  className="btn"
                  onClick={() => deleteAccount.mutate()}
                  disabled={deleteAccount.isPending || !confirmOk}
                  style={{
                    flex: 1,
                    background: confirmOk ? 'var(--p-danger)' : 'var(--p-border)',
                    color: confirmOk ? 'var(--p-danger-fg)' : 'var(--p-muted)',
                    cursor: confirmOk && !deleteAccount.isPending ? 'pointer' : 'not-allowed',
                  }}
                >
                  {deleteAccount.isPending ? t('settingsScreen.delete.deleting') : t('settingsScreen.delete.confirm')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Support — always-reachable contact (competitor audit 2026-07-21:
            the worst complaint class across math apps is a billing/account
            problem with nowhere to go). Address stays visible as selectable
            text because the WebView shell may swallow mailto:. */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.support.section')}</span>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.55, marginBottom: 10 }}>
            {t('settingsScreen.support.hint')}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, userSelect: 'text' }}>
            {SUPPORT_EMAIL}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              style={{ flex: 1 }}
              onClick={() =>
                openSupportMail({
                  topic: 'general',
                  subject: t('settingsScreen.support.subject'),
                  userId: me.data?.id ?? null,
                  accountEmail: me.data?.email ?? null,
                  lang,
                })
              }
            >
              {t('settingsScreen.support.cta')}
            </button>
            <button
              type="button"
              className="btn outline"
              style={{ flex: 1 }}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(SUPPORT_EMAIL);
                  toast(t('settingsScreen.support.copied'), 'success');
                } catch {
                  // Clipboard may be unavailable in the WebView — the address
                  // is rendered as selectable text above as the fallback.
                }
              }}
            >
              {t('settingsScreen.support.copy')}
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ marginTop: 24, padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--p-muted)' }}>
          {t('settingsScreen.about')}
        </div>
      </div>
      <TabBar />
    </div>
  );
}

const THEME_OPTIONS: ThemeMode[] = ['light', 'dark', 'system'];

function ThemeModePicker({ mode, onChange }: { mode: ThemeMode; onChange: (m: ThemeMode) => void }) {
  const { t } = useT();
  const labels: Record<ThemeMode, string> = {
    light: t('settingsScreen.theme.light'),
    dark: t('settingsScreen.theme.dark'),
    system: t('settingsScreen.theme.system'),
  };
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {THEME_OPTIONS.map((opt) => {
        const active = mode === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 10,
              border: `1px solid ${active ? 'var(--p-primary)' : 'var(--p-border)'}`,
              background: active ? 'var(--p-primary-tint)' : 'var(--p-surface)',
              color: active ? 'var(--p-primary)' : 'var(--p-ink-2)',
              fontSize: 12.5,
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}

const LANG_PREF_OPTIONS = ['auto', 'ko', 'en'] as const;
type SettingsLangPref = (typeof LANG_PREF_OPTIONS)[number];

function LangPreferencePicker({
  value,
  onChange,
  labels,
}: {
  value: SettingsLangPref;
  onChange: (p: SettingsLangPref) => void;
  labels: Record<SettingsLangPref, string>;
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {LANG_PREF_OPTIONS.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 10,
              border: `1px solid ${active ? 'var(--p-primary)' : 'var(--p-border)'}`,
              background: active ? 'var(--p-primary-tint)' : 'var(--p-surface)',
              color: active ? 'var(--p-primary)' : 'var(--p-ink-2)',
              fontSize: 12.5,
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--p-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--p-muted)', letterSpacing: '0.04em' }}>{k}</span>
      <span style={{ fontSize: 14, color: 'var(--p-ink)', fontWeight: 500 }}>{v}</span>
    </div>
  );
}

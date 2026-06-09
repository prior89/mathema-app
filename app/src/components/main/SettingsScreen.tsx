/* SettingsScreen — sage-themed settings inside /app/me/settings.
 * Wires to existing backend: /privacy/policy, /privacy/consents, /privacy/consents/:kind, DELETE /users/me, GET /users/me/export.
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post, patch, del, downloadExport, tokens } from '../../lib/api';
import { fetchMe, type Me } from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

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
  const { t } = useT();
  const { refreshUser } = useAuth();
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
  });

  const pushReminders = me.data?.pushRemindersEnabled !== false;
  const togglePush = useMutation({
    mutationFn: (enabled: boolean) => patch<Me>('/users/me', { pushRemindersEnabled: enabled }),
    onSuccess: async () => {
      await refreshUser();
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const [deletingConfirm, setDeletingConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const deleteAccount = useMutation({
    mutationFn: () => del('/users/me'),
    onSuccess: () => {
      tokens.clear();
      nav('/login');
    },
  });
  const confirmOk = confirmText === 'DELETE';

  const items: Array<{ kind: Consent['kind']; name: string; desc: string; req?: boolean }> = [
    { kind: 'DATA_PROCESSING', name: t('settingsScreen.privacy.essential.name'), desc: t('settingsScreen.privacy.essential.desc'), req: true },
    { kind: 'ANALYTICS', name: t('settingsScreen.privacy.analytics.name'), desc: t('settingsScreen.privacy.analytics.desc') },
    { kind: 'AI_TRAINING', name: t('settingsScreen.privacy.aiTraining.name'), desc: t('settingsScreen.privacy.aiTraining.desc') },
    { kind: 'MARKETING', name: t('settingsScreen.privacy.marketing.name'), desc: t('settingsScreen.privacy.marketing.desc') },
  ];

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/me')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('lesson.back')}>
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
          <Row k={t('settingsScreen.row.role')} v={me.data?.role ?? t('me.role.default')} />
          <Row k={t('settingsScreen.row.class')} v={({
            CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
            CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
          } as Record<string, string>)[me.data?.gradeLevel ?? ''] ?? me.data?.gradeLevel ?? '—'} last />
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
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!togglePush.isPending && (e.key === 'Enter' || e.key === ' ')) {
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
          <div className={`toggle ${pushReminders ? 'on' : ''}`} aria-pressed={pushReminders} />
        </div>

        {/* Privacy */}
        <div className="section-h">
          <span className="label">{t('settingsScreen.privacy.section')}</span>
        </div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {items.map((it) => {
            // Required consents (DATA_PROCESSING) are non-revocable — backend rejects
            // DELETE /privacy/consents/data_processing and routes revocation through
            // account deletion. Render them as always-checked regardless of the
            // /privacy/consents payload so the UI never mis-signals "you can opt out".
            const active = it.req
              ? true
              : (consents.data?.find((c) => c.kind === it.kind)?.active ?? false);
            return (
              <div key={it.kind} className="consent-row">
                <div
                  className={`ck ${active ? 'checked' : ''}`}
                  onClick={() => !it.req && !toggle.isPending && toggle.mutate({ kind: it.kind, active })}
                  style={{ opacity: it.req ? 0.85 : 1, cursor: it.req ? 'default' : 'pointer' }}
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
            onClick={() => { tokens.clear(); nav('/login'); }}
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
                    color: confirmOk ? 'white' : 'var(--p-muted)',
                    cursor: confirmOk && !deleteAccount.isPending ? 'pointer' : 'not-allowed',
                  }}
                >
                  {deleteAccount.isPending ? t('settingsScreen.delete.deleting') : t('settingsScreen.delete.confirm')}
                </button>
              </div>
            </div>
          )}
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

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--p-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--p-muted)', letterSpacing: '0.04em' }}>{k}</span>
      <span style={{ fontSize: 14, color: 'var(--p-ink)', fontWeight: 500 }}>{v}</span>
    </div>
  );
}

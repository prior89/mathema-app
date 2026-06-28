import { useState } from 'react';
import { startPhoneOtp, verifyPhoneOtp } from '../../lib/phoneOtpSignIn';
import type { AuthTokens } from '../../lib/socialSignIn';

/**
 * India phone-OTP sign-in (scaffold). Two steps: enter phone → enter code.
 * NOT yet wired into LoginPage (owner-edited). Render with onTokens to log in:
 *   <PhoneOtpForm onTokens={(t) => tokens.set(t.accessToken, t.refreshToken)} />
 * In dev (OTP_AUTH_MOCK) the start response carries devCode, auto-filled below.
 */
export function PhoneOtpForm({
  onTokens,
  onError,
}: {
  onTokens: (tokens: AuthTokens) => void | Promise<void>;
  onError?: (err: unknown) => void;
}) {
  const [phase, setPhase] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      const r = await startPhoneOtp(phone);
      if (r.devCode) setCode(r.devCode); // dev convenience
      setPhase('code');
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    try {
      await onTokens(await verifyPhoneOtp(phone, code));
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #ccc', fontSize: 14,
  };
  const button: React.CSSProperties = {
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    background: '#1a1a2e', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {phase === 'phone' ? (
        <>
          <input
            style={input} inputMode="tel" placeholder="Mobile number"
            value={phone} onChange={(e) => setPhone(e.target.value)}
          />
          <button style={button} disabled={busy || phone.length < 8} onClick={send}>
            {busy ? '…' : 'Send code'}
          </button>
        </>
      ) : (
        <>
          <input
            style={input} inputMode="numeric" placeholder="6-digit code"
            value={code} onChange={(e) => setCode(e.target.value)}
          />
          <button style={button} disabled={busy || code.length < 4} onClick={verify}>
            {busy ? '…' : 'Verify & continue'}
          </button>
          <button
            style={{ ...button, background: 'transparent', color: '#1a1a2e', fontWeight: 500 }}
            disabled={busy} onClick={() => setPhase('phone')}
          >
            Change number
          </button>
        </>
      )}
    </div>
  );
}

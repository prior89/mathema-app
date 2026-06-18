/**
 * Error DNA L2 — GET /mastery/error-patterns/active (PR-25).
 * Shared by MasteryScreen (full list) and NotesListScreen (top banner).
 */
import type { ErrorPatternRow } from '../../lib/queries';
import { pickConceptName } from '../../lib/concept-name';
import { Glyph } from '../onboarding/Glyph';

type UiLang = 'ko' | 'en' | 'hi';

const ERROR_CODE_LABELS: Record<ErrorPatternRow['errorCode'], { ko: string; en: string; hi: string }> = {
  SIGN: { ko: '부호 실수', en: 'Sign error', hi: 'चिह्न त्रुटि' },
  ALG: { ko: '대수 변형', en: 'Algebra slip', hi: 'बीजगणित' },
  CON: { ko: '개념 오해', en: 'Concept gap', hi: 'अवधारणा' },
  FORMULA: { ko: '공식 적용', en: 'Formula misuse', hi: 'सूत्र' },
  GRAPH: { ko: '그래프 해석', en: 'Graph read', hi: 'ग्राफ' },
  UNIT: { ko: '단위·스케일', en: 'Unit / scale', hi: 'इकाई' },
  CALC: { ko: '계산 실수', en: 'Calculation', hi: 'गणना' },
  LOGIC: { ko: '논리·추론', en: 'Logic', hi: 'तर्क' },
};

const STATUS_LABELS: Record<ErrorPatternRow['status'], { ko: string; en: string; hi: string }> = {
  ACTIVE: { ko: '반복 중', en: 'Active', hi: 'सक्रिय' },
  IMPROVING: { ko: '나아지는 중', en: 'Improving', hi: 'सुधार' },
  RESOLVED: { ko: '해소됨', en: 'Resolved', hi: 'हल' },
};

export function errorCodeLabel(code: ErrorPatternRow['errorCode'], lang: UiLang): string {
  return ERROR_CODE_LABELS[code][lang] ?? ERROR_CODE_LABELS[code].en;
}

export function errorPatternStatusLabel(status: ErrorPatternRow['status'], lang: UiLang): string {
  return STATUS_LABELS[status][lang] ?? STATUS_LABELS[status].en;
}

/** Design template: "{conceptName}에서 {errorCodeLabel} 패턴 {n}회 — {status}." */
export function errorPatternStudentCopy(p: ErrorPatternRow, lang: UiLang): string {
  const code = errorCodeLabel(p.errorCode, lang);
  const status = errorPatternStatusLabel(p.status, lang);
  const name = pickConceptName(p.concept, lang);
  if (lang === 'ko') {
    return `${name}에서 ${code} 패턴 ${p.recentFrequency}회 — ${status}.`;
  }
  if (lang === 'hi') {
    return `${name}: ${code} — ${p.recentFrequency} बार, ${status}.`;
  }
  return `${name}: ${code} pattern ×${p.recentFrequency} — ${status}.`;
}

function severityStyle(severity: ErrorPatternRow['severity']) {
  if (severity === 'high') return { bg: 'var(--p-danger-tint)', fg: 'var(--p-danger)' };
  if (severity === 'medium') return { bg: 'var(--p-accent-tint)', fg: 'var(--p-accent)' };
  return { bg: 'var(--p-surface-2)', fg: 'var(--p-muted)' };
}

/** Compact banner — Notes tab top strip. */
export function ActiveErrorPatternBanner({
  pattern,
  lang,
  onClick,
}: {
  pattern: ErrorPatternRow;
  lang: UiLang;
  onClick?: () => void;
}) {
  const sev = severityStyle(pattern.severity);
  return (
    <div
      className="card"
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        background: 'var(--p-primary-tint)',
        borderColor: 'transparent',
        padding: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: 'var(--p-primary)', color: 'var(--p-primary-fg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Glyph.Sparkle accent="var(--p-primary-fg)" size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--p-ink)' }}>
          {pickConceptName(pattern.concept, lang)} · {errorCodeLabel(pattern.errorCode, lang)}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--p-ink-2)', lineHeight: 1.45 }}>
          {pattern.llmSummary ?? errorPatternStudentCopy(pattern, lang)}
        </div>
      </div>
      <span className="chip" style={{ background: sev.bg, color: sev.fg, fontSize: 10, flexShrink: 0 }}>
        {errorPatternStatusLabel(pattern.status, lang)}
      </span>
      {onClick && <Glyph.ChevronR accent="var(--p-primary)" size={16} />}
    </div>
  );
}

/** Full list — Mastery screen section. */
export function ActiveErrorPatternList({
  patterns,
  lang,
  limit = 6,
}: {
  patterns: ErrorPatternRow[];
  lang: UiLang;
  limit?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {patterns.slice(0, limit).map((p) => {
        const sev = severityStyle(p.severity);
        return (
          <div key={p.id} className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)' }}>{pickConceptName(p.concept, lang)}</div>
                <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {errorCodeLabel(p.errorCode, lang)} · {p.recentFrequency}×
                </div>
              </div>
              <span className="chip" style={{ background: sev.bg, color: sev.fg, fontSize: 10 }}>
                {errorPatternStatusLabel(p.status, lang)}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
              {p.llmSummary ?? errorPatternStudentCopy(p, lang)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
/**
 * Country config — 국가별 커리큘럼·로케일·통화·표기 규칙.
 * 새 국가 추가 시 여기 한 곳만 수정.
 */

export const COUNTRY_CODES = ['IN', 'KR', 'US', 'UK', 'AU', 'SG', 'AE', 'ID', 'GLOBAL'] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export type CountryConfig = {
  /** ISO 3166 코드 */
  code: CountryCode;
  /** UI 표시명 */
  name: string;
  /** 기본 UI 언어 (학습자가 처음 가입 시) */
  defaultLang: 'ko' | 'en' | 'hi';
  /** 통화 기호 — 단어 문제·결제 표시 */
  currency: string;
  /** 통화 ISO 코드 (Play Billing 용) */
  currencyCode: string;
  /** 날짜 형식 (date-fns 호환) */
  dateFormat: string;
  /** 숫자 포맷 — 천 단위 구분 / 소수점 */
  numberFormat: { thousands: ',' | '.' | ' '; decimal: '.' | ','; };
  /** 커리큘럼 표준 */
  curriculum: 'NCERT' | 'KSAT' | 'COMMON_CORE' | 'GCSE' | 'ACARA' | 'MOE_SG' | 'GENERIC';
  /** 학년 라벨 prefix (UI 표시용) */
  gradeLabel: 'Class' | 'Grade' | 'Year' | '학년';
  /** 시험 명칭 (모의고사 placeholder) */
  examNames: { mini: string; mock: string; recommended: string; wrongRedo: string };
  /** 출시 단계 */
  status: 'live' | 'beta' | 'planned';
};

export const COUNTRY_CONFIG: Record<CountryCode, CountryConfig> = {
  IN: {
    code: 'IN',
    name: 'Outside Korea',
    defaultLang: 'en',
    currency: '₩',
    currencyCode: 'KRW',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'GENERIC',
    gradeLabel: 'Grade',
    examNames: {
      mini: 'Topic Mini Test',
      mock: 'Full Mock Exam',
      recommended: 'AI Diagnostic Mock',
      wrongRedo: 'Review Test',
    },
    // Parked for the KR-first launch. 'planned' hides this legacy region from
    // onboarding and makes the register API reject country:'IN' cleanly.
    status: 'planned',
  },
  KR: {
    code: 'KR',
    name: '한국',
    defaultLang: 'ko',
    currency: '₩',
    currencyCode: 'KRW',
    dateFormat: 'yyyy-MM-dd',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'KSAT',
    gradeLabel: '학년',
    examNames: {
      mini: 'Unit Mini Test',
      mock: 'Full Mock Exam',
      recommended: 'AI-tailored Mock',
      wrongRedo: 'Wrong-Redo Exam',
    },
    status: 'live',
  },
  US: {
    code: 'US', name: 'Outside Korea (US)', defaultLang: 'en',
    currency: '$', currencyCode: 'USD', dateFormat: 'MM/dd/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'COMMON_CORE', gradeLabel: 'Grade',
    examNames: { mini: 'Chapter Quiz', mock: 'SAT Practice', recommended: 'AI Diagnostic', wrongRedo: 'Review Set' },
    status: 'planned',
  },
  UK: {
    code: 'UK', name: 'Outside Korea (UK)', defaultLang: 'en',
    currency: '£', currencyCode: 'GBP', dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'GCSE', gradeLabel: 'Year',
    examNames: { mini: 'Topic Quiz', mock: 'GCSE Mock', recommended: 'AI Diagnostic', wrongRedo: 'Review' },
    status: 'planned',
  },
  AU: {
    code: 'AU', name: 'Outside Korea (AU)', defaultLang: 'en',
    currency: 'A$', currencyCode: 'AUD', dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'ACARA', gradeLabel: 'Year',
    examNames: { mini: 'Topic Quiz', mock: 'NAPLAN Practice', recommended: 'AI Diagnostic', wrongRedo: 'Review' },
    status: 'planned',
  },
  SG: {
    code: 'SG', name: 'Outside Korea (SG)', defaultLang: 'en',
    currency: 'S$', currencyCode: 'SGD', dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'MOE_SG', gradeLabel: 'Grade',
    examNames: { mini: 'Topical Quiz', mock: 'O-Level Mock', recommended: 'AI Diagnostic', wrongRedo: 'Review' },
    status: 'planned',
  },
  AE: {
    code: 'AE', name: 'Outside Korea (AE)', defaultLang: 'en',
    currency: 'AED', currencyCode: 'AED', dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: ',', decimal: '.' },
    // Parked for the KR-first launch.
    curriculum: 'GENERIC', gradeLabel: 'Grade',
    examNames: { mini: 'Chapter Mini Test', mock: 'Board Mock Exam', recommended: 'AI Diagnostic Mock', wrongRedo: 'Revision Test' },
    // Parked alongside other non-KR markets for the KR-first launch.
    status: 'planned',
  },
  ID: {
    code: 'ID', name: 'Indonesia', defaultLang: 'en',
    currency: 'Rp', currencyCode: 'IDR', dateFormat: 'dd/MM/yyyy',
    numberFormat: { thousands: '.', decimal: ',' },
    // Merdeka curriculum + Bahasa content not built yet, and PSE registration
    // is pending — kept GENERIC and planned until those blockers clear.
    curriculum: 'GENERIC', gradeLabel: 'Grade',
    examNames: { mini: 'Chapter Quiz', mock: 'Mock Exam', recommended: 'AI Diagnostic', wrongRedo: 'Review' },
    status: 'planned',
  },
  GLOBAL: {
    code: 'GLOBAL', name: 'International', defaultLang: 'en',
    currency: '$', currencyCode: 'USD', dateFormat: 'yyyy-MM-dd',
    numberFormat: { thousands: ',', decimal: '.' },
    curriculum: 'GENERIC', gradeLabel: 'Grade',
    examNames: { mini: 'Mini Test', mock: 'Mock Exam', recommended: 'AI Diagnostic', wrongRedo: 'Review' },
    status: 'beta',
  },
};

/** 학년 enum → 국가별 표시 라벨 */
export function gradeLabelFor(country: CountryCode, grade: string): string {
  const num = ({
    CLASS_7: 7, CLASS_8: 8, CLASS_9: 9,
    CLASS_10: 10, CLASS_11: 11, CLASS_12: 12,
  } as Record<string, number>)[grade];
  if (!num) return grade;
  const cfg = COUNTRY_CONFIG[country];
  return `${cfg.gradeLabel} ${num}`;
}

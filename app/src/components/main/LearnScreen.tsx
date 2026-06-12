/* Learn tab — concept lesson hub.
 *
 *   country = 'IN' (default) → NCERT chapter tree (Class 7~12)
 *   country = 'KR'           → Korean 2022 개정 chapter tree (중1 ~ 고3)
 *
 * Both branches share the same shell + chip filter UX; only the data source
 * and label scheme differ. Phase 1 of the Korean track ships chapter metadata
 * only — practice problems land in a later phase.
 */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  fetchConceptLessons, fetchMe,
  fetchKoreanConceptLessons,
  type NcertClass,
  type KoreanGrade, type KoreanSubject, type KoreanConceptLessonSummary,
} from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';

const GRADE_TO_CLASS: Record<string, NcertClass> = {
  CLASS_7: 'CLASS_7', CLASS_8: 'CLASS_8', CLASS_9: 'CLASS_9',
  CLASS_10: 'CLASS_10', CLASS_11: 'CLASS_11', CLASS_12: 'CLASS_12',
};

const CLASS_LABEL: Record<NcertClass, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

const KOREAN_GRADE_LABEL: Record<KoreanGrade, string> = {
  MIDDLE_1: '중1', MIDDLE_2: '중2', MIDDLE_3: '중3',
  HIGH_1: '고1', HIGH_2: '고2', HIGH_3: '고3',
};

const KOREAN_SUBJECT_LABEL: Record<KoreanSubject, string> = {
  MIDDLE_MATH_1: '수학 1',
  MIDDLE_MATH_2: '수학 2',
  MIDDLE_MATH_3: '수학 3',
  HIGH_COMMON_1: '공통수학1',
  HIGH_COMMON_2: '공통수학2',
  HIGH_ALGEBRA: '대수',
  HIGH_CALCULUS_1: '미적분Ⅰ',
  HIGH_CALCULUS_2: '미적분Ⅱ',
  HIGH_STATISTICS: '확률과 통계',
  HIGH_GEOMETRY: '기하',
};

// User's onboarded gradeLevel uses NCERT class strings. Map to closest
// Korean grade so the default chip selection feels natural for KR users.
const NCERT_TO_KR_GRADE: Record<string, KoreanGrade> = {
  CLASS_7: 'MIDDLE_1', CLASS_8: 'MIDDLE_2', CLASS_9: 'MIDDLE_3',
  CLASS_10: 'HIGH_1', CLASS_11: 'HIGH_2', CLASS_12: 'HIGH_3',
};

export function LearnScreen() {
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  // Country-aware: KR users see the Korean 2022 curriculum hub; every other
  // country falls through to the NCERT hub (India default + the rest until
  // their own curriculum lands). Both components stay compiled so the
  // switch is data-driven (User.country flip) — no code change needed.
  if (me.data?.country === 'KR') return <KoreanLearnHub me={me.data ?? null} />;
  return <NcertLearnHub me={me.data ?? null} />;
}

// ────────────────────────────────────────────────────────────────────────
//  Korean curriculum hub
// ────────────────────────────────────────────────────────────────────────
function KoreanLearnHub({ me }: { me: { gradeLevel?: string | null } | null }) {
  const nav = useNavigate();
  const { t } = useT();
  const defaultGrade: KoreanGrade =
    NCERT_TO_KR_GRADE[me?.gradeLevel ?? 'CLASS_11'] ?? 'HIGH_2';
  const [grade, setGrade] = useState<KoreanGrade>(defaultGrade);
  const lessons = useQuery({
    queryKey: ['ko-lessons', grade],
    queryFn: () => fetchKoreanConceptLessons({ koreanGrade: grade }),
  });

  const grades: KoreanGrade[] = ['MIDDLE_1', 'MIDDLE_2', 'MIDDLE_3', 'HIGH_1', 'HIGH_2', 'HIGH_3'];

  // Group lessons by subject so chapters from 공통수학1 / 공통수학2 / 대수 /
  // 미적분Ⅰ / ... render under their own headers instead of one flat list.
  const grouped = groupBySubject(lessons.data ?? []);

  return (
    <div className="screen">
      <div className="app-head" style={{ paddingBottom: 0, flexShrink: 0 }}>
        <div>
          <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>
            {t('learn.tab.label')}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>
            {t('learn.tab.title')}
          </div>
        </div>
        <HeadAvatar />
      </div>
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <div className="filter-row">
          {grades.map((g) => (
            <span
              key={g}
              className={`filter-chip ${grade === g ? 'active' : ''}`}
              style={{ flex: '0 0 calc((100% - 30px) / 6)', textAlign: 'center' }}
              onClick={() => setGrade(g)}
            >
              {KOREAN_GRADE_LABEL[g]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px' }}>
        {lessons.isLoading && <Empty msg={t('learn.loading')} />}
        {lessons.data && lessons.data.length === 0 && <Empty msg={t('learn.empty')} />}

        {grouped.map(([subject, items]) => (
          <div key={subject} style={{ marginTop: 16 }}>
            <div className="section-h">
              <span className="label">{KOREAN_SUBJECT_LABEL[subject]}</span>
              <span className="more">{items.length}단원</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((l) => (
                <div
                  key={l.chapterCode}
                  className="plan-card"
                  onClick={() => nav(`/app/learn/${l.chapterCode}`)}
                >
                  {/* L5: mastered 챕터는 숫자 대신 ✓ 표시 (사용자 spec 2026-05-24).
                      mastered=true tint를 success 색으로 살짝 강조해서 한 눈에 띄게. */}
                  <div
                    className="badge"
                    style={{
                      background: l.mastered ? 'var(--p-success-tint)' : 'var(--p-primary-tint)',
                      color: l.mastered ? 'var(--p-success)' : 'var(--p-primary)',
                    }}
                  >
                    {l.mastered ? <Glyph.Check accent="currentColor" size={14} /> : l.chapterNumber}
                  </div>
                  <div className="info">
                    <div className="ttl">{l.titleKo}</div>
                    <div className="sub">{l.bigIdeaKo}</div>
                  </div>
                  <Glyph.ChevronR accent="var(--p-muted)" size={16} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function groupBySubject(
  rows: KoreanConceptLessonSummary[],
): Array<[KoreanSubject, KoreanConceptLessonSummary[]]> {
  // Order: preserve enum order so 공통수학1 → 공통수학2 → 대수 → 미적분Ⅰ …
  const SUBJECT_ORDER: KoreanSubject[] = [
    'MIDDLE_MATH_1', 'MIDDLE_MATH_2', 'MIDDLE_MATH_3',
    'HIGH_COMMON_1', 'HIGH_COMMON_2',
    'HIGH_ALGEBRA', 'HIGH_CALCULUS_1', 'HIGH_CALCULUS_2',
    'HIGH_STATISTICS', 'HIGH_GEOMETRY',
  ];
  const map = new Map<KoreanSubject, KoreanConceptLessonSummary[]>();
  for (const r of rows) {
    const arr = map.get(r.koreanSubject) ?? [];
    arr.push(r);
    map.set(r.koreanSubject, arr);
  }
  return SUBJECT_ORDER
    .filter((s) => map.has(s))
    .map((s) => [s, (map.get(s) ?? []).sort((a, b) => a.chapterNumber - b.chapterNumber)] as const);
}

// ────────────────────────────────────────────────────────────────────────
//  NCERT (India) hub — original behaviour preserved
// ────────────────────────────────────────────────────────────────────────
function NcertLearnHub({ me }: { me: { gradeLevel?: string | null } | null }) {
  const nav = useNavigate();
  const { t } = useT();
  const defaultClass: NcertClass = GRADE_TO_CLASS[me?.gradeLevel ?? 'CLASS_11'] ?? 'CLASS_11';
  const [ncertClass, setNcertClass] = useState<NcertClass>(defaultClass);
  const lessons = useQuery({ queryKey: ['lessons', ncertClass], queryFn: () => fetchConceptLessons(ncertClass) });

  const classes: NcertClass[] = ['CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'];

  return (
    <div className="screen">
      <div className="app-head" style={{ paddingBottom: 0, flexShrink: 0 }}>
        <div>
          <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('learn.tab.label')}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>{t('learn.tab.title')}</div>
        </div>
        <HeadAvatar />
      </div>
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <div className="filter-row">
          {classes.map((c) => (
            <span
              key={c}
              className={`filter-chip ${ncertClass === c ? 'active' : ''}`}
              style={{
                flex: '0 0 calc((100% - 18px) / 4)',
                textAlign: 'center',
              }}
              onClick={() => setNcertClass(c)}
            >
              {CLASS_LABEL[c]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px' }}>
        {lessons.isLoading && <Empty msg={t('learn.loading')} />}
        {lessons.data && lessons.data.length === 0 && <Empty msg={t('learn.empty')} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {(lessons.data ?? []).map((l) => (
            <div key={l.chapterCode} className="plan-card" onClick={() => nav(`/app/learn/${l.chapterCode}`)}>
              {/* L5: mastered chapter는 숫자 → ✓ (KR/NCERT 통일). */}
              <div
                className="badge"
                style={{
                  background: l.mastered ? 'var(--p-success-tint)' : 'var(--p-primary-tint)',
                  color: l.mastered ? 'var(--p-success)' : 'var(--p-primary)',
                }}
              >
                {l.mastered ? <Glyph.Check accent="currentColor" size={14} /> : l.chapterNumber}
              </div>
              <div className="info">
                <div className="ttl">{l.title}</div>
                <div className="sub">{l.bigIdea}</div>
              </div>
              <Glyph.ChevronR accent="var(--p-muted)" size={16} />
            </div>
          ))}
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5, margin: '12px 0' }}>
      {msg}
    </div>
  );
}

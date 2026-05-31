/* /app/admin/ko-study-problems/new — author one KR Study (single-step) problem.
 * Backed by POST /admin/korean-study-problems. Picker source is GET
 * /admin/korean-chapters (chapter + 현재 single-step pool 수). Per
 * [[feedback-no-llm-for-problem-content]] this is fully manual — no LLM hint
 * field, no auto-fill. Mirrors the seed file shape so authoring quality stays
 * uniform across hand-coded and admin-entered rows. */
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { TabBar } from '../main/TabBar';

type KoreanChapter = {
  id: string;
  chapterCode: string;
  titleKo: string;
  koreanGrade: string;
  koreanSubject: string;
  chapterNumber: number;
  studyProblemCount: number;
};

const DIFFICULTY_OPTS = ['MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER'] as const;
type Difficulty = (typeof DIFFICULTY_OPTS)[number];

// Matches Prisma ErrorCode enum (server/prisma/schema.prisma).
const ERROR_CODE_OPTS = [
  'SIGN', 'ALG', 'CON', 'FORMULA', 'GRAPH', 'UNIT', 'CALC', 'LOGIC',
  'CONDITION_MISSING', 'DENOMINATOR_ERROR', 'GEOMETRY_PROPERTY_ERROR',
  'RATIO_SCALE_ERROR', 'PROBABILITY_COUNTING_ERROR',
  'STATISTICS_INTERPRETATION_ERROR', 'SLOPE_INTERCEPT_CONFUSION',
  'CORRESPONDING_PART_ERROR', 'AREA_RATIO_ERROR', 'ADD_NUMERATOR_ONLY',
] as const;
type ErrorCode = (typeof ERROR_CODE_OPTS)[number];

type Option = { text: string; isCorrect: boolean; errorCode: ErrorCode | ''; rationale: string };
const emptyOption = (): Option => ({ text: '', isCorrect: false, errorCode: '', rationale: '' });

export function AdminKoreanStudyProblemNewScreen() {
  const nav = useNavigate();
  const chapters = useQuery({
    queryKey: ['admin-korean-chapters'],
    queryFn: () => get<KoreanChapter[]>('/admin/korean-chapters'),
  });

  const [chapterCode, setChapterCode] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('MIDDLE');
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [stem, setStem] = useState('');
  const [concept, setConcept] = useState('');
  const [requiredSkillsCsv, setRequiredSkillsCsv] = useState('');
  const [solution, setSolution] = useState('');
  const [options, setOptions] = useState<Option[]>([
    emptyOption(), emptyOption(), emptyOption(), emptyOption(), emptyOption(),
  ]);

  function patchOption(idx: number, patch: Partial<Option>) {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  }
  function setCorrect(idx: number) {
    setOptions((prev) => prev.map((o, i) => ({
      ...o,
      isCorrect: i === idx,
      // Correct option clears errorCode/rationale; only wrong options carry them.
      errorCode: i === idx ? '' : o.errorCode,
      rationale: i === idx ? '' : o.rationale,
    })));
  }

  const correctCount = options.filter((o) => o.isCorrect).length;
  const wrongMissingMeta = options.some((o) => !o.isCorrect && (!o.errorCode || !o.rationale.trim()));
  const anyEmpty = options.some((o) => !o.text.trim());
  const valid = !!chapterCode && stem.trim() && concept.trim() && solution.trim()
    && correctCount === 1 && !wrongMissingMeta && !anyEmpty;

  const submit = useMutation({
    mutationFn: () => post<{ id: string; chapterCode: string }>('/admin/korean-study-problems', {
      chapterCode,
      difficulty,
      difficultyLevel,
      stem: stem.trim(),
      concept: concept.trim(),
      requiredSkills: requiredSkillsCsv.split(',').map((s) => s.trim()).filter(Boolean),
      solution: solution.trim(),
      options: options.map((o) => ({
        text: o.text.trim(),
        isCorrect: o.isCorrect,
        errorCode: o.isCorrect ? null : (o.errorCode || null),
        rationale: o.isCorrect ? null : (o.rationale.trim() || null),
      })),
    }),
    onSuccess: (r) => {
      alert(`등록 완료 — Problem ${r.id}`);
      chapters.refetch();
      // Reset content fields, keep chapter + difficulty for batch entry.
      setStem(''); setConcept(''); setRequiredSkillsCsv(''); setSolution('');
      setOptions([emptyOption(), emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message;
      alert(`실패: ${Array.isArray(msg) ? msg.join(', ') : (msg ?? '알 수 없는 오류')}`);
    },
  });

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="ghost" onClick={() => nav(-1)} aria-label="뒤로" style={{ fontSize: 20, lineHeight: 1 }}>
            ←
          </button>
          <h1 className="screen-title" style={{ margin: 0 }}>한국 연습 문제 추가</h1>
        </div>
      </div>

      <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="챕터">
          <select
            value={chapterCode}
            onChange={(e) => setChapterCode(e.target.value)}
            style={selectStyle}
          >
            <option value="">— 챕터 선택 —</option>
            {(chapters.data ?? []).map((c) => (
              <option key={c.id} value={c.chapterCode}>
                {c.koreanGrade} · {c.koreanSubject} · CH{c.chapterNumber} · {c.titleKo}
                {'  '}(현재 {c.studyProblemCount}개)
              </option>
            ))}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="난이도" style={{ flex: 1 }}>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              style={selectStyle}
            >
              {DIFFICULTY_OPTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="레벨 (1~5)" style={{ flex: 1 }}>
            <input
              type="number" min={1} max={5}
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="문제 본문 (LaTeX 가능, $...$ inline)">
          <textarea
            value={stem} onChange={(e) => setStem(e.target.value)}
            rows={3} style={textareaStyle}
            placeholder="예) $-7 + (-2)$를 계산하시오."
          />
        </Field>

        <Field label="개념 (한 줄, 예: 정수의 덧셈)">
          <input value={concept} onChange={(e) => setConcept(e.target.value)} style={inputStyle} />
        </Field>

        <Field label="필요 스킬 (쉼표 구분, 선택)">
          <input
            value={requiredSkillsCsv} onChange={(e) => setRequiredSkillsCsv(e.target.value)}
            style={inputStyle}
            placeholder="예) signed-addition, absolute-value"
          />
        </Field>

        <Field label="풀이 (사용자에게 보일 해설)">
          <textarea
            value={solution} onChange={(e) => setSolution(e.target.value)}
            rows={4} style={textareaStyle}
            placeholder="예) 부호가 같으므로 절댓값을 더하고 같은 부호를 붙인다 → $-(7+2)=-9$"
          />
        </Field>

        <div>
          <h3 style={{ margin: '12px 0 8px', fontSize: 14, opacity: 0.7 }}>
            선택지 (정확히 5개, 정답 1개)
          </h3>
          {options.map((o, i) => (
            <div key={i} style={{
              border: '1px solid var(--p-border)', borderRadius: 12,
              padding: 12, marginBottom: 10,
              background: o.isCorrect ? 'oklch(0.97 0.05 145)' : 'var(--p-surface)',
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                  <input
                    type="radio" name="correct"
                    checked={o.isCorrect}
                    onChange={() => setCorrect(i)}
                  />
                  <span style={{ fontSize: 12, opacity: 0.8 }}>{i + 1}</span>
                </label>
                <input
                  value={o.text}
                  onChange={(e) => patchOption(i, { text: e.target.value })}
                  placeholder={`선택지 ${i + 1} 텍스트`}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              {!o.isCorrect && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <select
                    value={o.errorCode}
                    onChange={(e) => patchOption(i, { errorCode: e.target.value as ErrorCode | '' })}
                    style={{ ...selectStyle, flex: 1 }}
                  >
                    <option value="">— 오류 코드 —</option>
                    {ERROR_CODE_OPTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    value={o.rationale}
                    onChange={(e) => patchOption(i, { rationale: e.target.value })}
                    placeholder="왜 틀렸는지 (오답 노트용)"
                    style={{ ...inputStyle, flex: 2 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {!valid && (
          <div style={{ fontSize: 12, color: 'var(--p-danger)' }}>
            {correctCount !== 1 && '· 정답이 정확히 1개여야 합니다. '}
            {anyEmpty && '· 모든 선택지 텍스트를 입력하세요. '}
            {wrongMissingMeta && '· 오답에는 오류 코드와 설명이 모두 필요합니다. '}
          </div>
        )}

        <button
          className="cta"
          disabled={!valid || submit.isPending}
          onClick={() => submit.mutate()}
          style={{ marginTop: 8 }}
        >
          {submit.isPending ? '저장 중...' : '등록'}
        </button>
      </div>
      <TabBar />
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1px solid var(--p-border)',
  background: 'var(--p-surface)', fontSize: 14, fontFamily: 'inherit',
};
const textareaStyle: React.CSSProperties = { ...inputStyle, fontFamily: 'inherit', resize: 'vertical' };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'auto' };

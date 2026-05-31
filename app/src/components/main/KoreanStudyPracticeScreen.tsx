/* KoreanStudyPracticeScreen — KR Study single-step pool 풀이.
 *
 * Mastery 3-step과 별도. fetchKoreanStudyProblems로 챕터 단일-스텝 문제
 * 20개를 가져와 클라이언트 인덱스로 진행. 각 문제 = body + 필기 패드 +
 * 5지선다. POST /attempts (context: 'STUDY', stepIndex 1) 로 채점.
 *
 * NCERT StudyPracticeScreen와 유사 UX이지만 데이터 흐름이 다름 (server
 * pull-next 가 아니라 client-side 20개 batch). KR Study spec [[matheo-ux-spec-full]].
 */
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { post } from '../../lib/api';
import { fetchKoreanStudyProblems, type KoreanStudyProblem } from '../../lib/queries';
import { useShuffledChoices } from '../../lib/shuffle';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

type AttemptResp = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
};

export function KoreanStudyPracticeScreen() {
  const { chapterCode } = useParams<{ chapterCode: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const problems = useQuery({
    queryKey: ['ko-study', chapterCode],
    queryFn: () => fetchKoreanStudyProblems(chapterCode!),
    enabled: !!chapterCode,
  });

  const [idx, setIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResp | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  const list: KoreanStudyProblem[] = problems.data ?? [];
  const current = list[idx];
  const total = list.length;
  const done = total > 0 && idx >= total;
  // 보기 셔플: current 가 바뀔 때 (= 다른 choice id 집합) 자동 재셔플.
  const shuffledChoices = useShuffledChoices(current?.choices ?? []);

  const submit = useMutation({
    mutationFn: () => post<AttemptResp>('/attempts', {
      problemId: current!.id,
      choiceId: pickedId,
      stepIndex: current!.stepIndex,
      durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      context: 'STUDY',
    }),
    onSuccess: (r) => {
      setResult(r);
      if (r.isCorrect) setCorrectCount((n) => n + 1);
      else setWrongCount((n) => n + 1);
      if (!r.isCorrect) {
        qc.invalidateQueries({ queryKey: ['wn-list'] });
        qc.invalidateQueries({ queryKey: ['wn-stats'] });
      }
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      // 2026-05-29: studyProblems is now user-aware (solved-correct moves to
      // the back of the queue). Invalidating the chapter's ko-study query
      // ensures the next page surface reflects the updated order without a
      // full reload.
      qc.invalidateQueries({ queryKey: ['ko-study', chapterCode] });
    },
  });

  const locked = submit.isPending || result?.isCorrect === true;
  const pick = (id: string) => {
    if (locked) return;
    if (result && !result.isCorrect) setResult(null);
    setPickedId(id);
  };
  const advance = () => {
    setIdx(idx + 1);
    setPickedId(null);
    setResult(null);
    setStartedAt(Date.now());
    canvasRef.current?.clear();
  };

  if (problems.isLoading) {
    return <Shell><Centered msg="문제를 불러오는 중…" /></Shell>;
  }
  if (total === 0) {
    return (
      <Shell>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--p-muted)' }}>이 챕터의 연습 문제는 아직 준비 중입니다.</div>
          <button className="btn" onClick={() => nav('/app/study')}>문제풀이 탭으로</button>
        </div>
      </Shell>
    );
  }
  if (done) {
    return (
      <Shell>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>연습 완료</div>
          <div style={{ fontSize: 13, color: 'var(--p-ink-2)' }}>정답 {correctCount} / 오답 {wrongCount}</div>
          <button className="btn" onClick={() => nav('/app/study')}>문제풀이 탭으로<Glyph.ChevronR /></button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div style={{ padding: '12px 22px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
            <div className="math-big" style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
              <MathText text={current.stem} />
            </div>
          </div>

          {/* 필기 패드 — Study-style. 풀이 과정을 손으로 쓴 후 답 선택. */}
          <div>
            <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>풀이</div>
            <HandwritingCanvas ref={canvasRef} height={240} extendable />
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button type="button" className="btn outline" onClick={() => canvasRef.current?.undo()} style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}>되돌리기</button>
              <button type="button" className="btn outline" onClick={() => canvasRef.current?.clear()} style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}>지우기</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {shuffledChoices.map((c, i) => {
              const isPicked = pickedId === c.id;
              const isRevealedCorrect = result?.isCorrect && isPicked;
              const isWrongPick = result && !result.isCorrect && isPicked;
              const cls = isRevealedCorrect ? 'choice correct' : isPicked ? 'choice selected' : 'choice';
              return (
                <div key={c.id} className={cls} onClick={() => pick(c.id)} style={isWrongPick ? { borderColor: 'var(--p-danger)' } : undefined}>
                  <div className="letter">{LETTERS[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>

          {result && (
            <div className="card" style={{
              padding: 14, marginTop: 4,
              background: result.isCorrect ? 'var(--p-success-tint)' : 'var(--p-danger-tint)',
              borderColor: 'transparent',
            }}>
              <div style={{ fontWeight: 700, color: result.isCorrect ? 'var(--p-success)' : 'var(--p-danger)' }}>
                {result.isCorrect ? '정답입니다 ✓' : '다시 생각해봐요'}
              </div>
              {!result.isCorrect && result.selectedChoice?.rationale && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)' }}>
                  힌트: <MathText text={result.selectedChoice.rationale} />
                </div>
              )}
              {result.isCorrect && current.solution && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)' }}>
                  <strong>풀이:</strong> <MathText text={current.solution} />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            {!result ? (
              <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
                {submit.isPending ? '확인 중…' : '답 확인'}
                <Glyph.ChevronR />
              </button>
            ) : result.isCorrect ? (
              <button className="btn" onClick={advance}>
                {idx + 1 < total ? '다음 문제' : '연습 완료'}
                <Glyph.ChevronR />
              </button>
            ) : (
              <button className="btn outline" onClick={() => { setResult(null); setPickedId(null); }}>다시 시도</button>
            )}
          </div>
        </div>
      </div>
      <TabBar />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen">
      {children}
    </div>
  );
}
function Centered({ msg }: { msg: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)', fontSize: 13 }}>{msg}</div>
  );
}

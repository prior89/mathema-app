/* Test tab — entry point for the wrong-note review queue.
 *
 * The actual review (FIFO + 3-day cooldown + sequential gate) lives in
 * ReviewQueueScreen. This tab shows the current queue depth and routes the
 * user there. Auto-scheduled weekly/monthly reviews (cron) are a follow-up;
 * for now reviews are user-triggered.
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { fetchReviewQueueNext } from '../../lib/queries';
import * as M from '../../lib/mutations';
import { useT } from '../../lib/i18n';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';
import { useAuth } from '../../context/AuthContext';
import { findPendingRealExam } from '../../lib/pending-real-exam';

export function TestScreen() {
  const nav = useNavigate();
  const { t, lang } = useT();
  const { user } = useAuth();
  const pendingRealExam = useMemo(() => {
    if (typeof window === 'undefined') return null;
    if (!user?.id) return null;
    try { return findPendingRealExam(window.localStorage, user.id); } catch { return null; }
  }, [user?.id]);
  const queue = useQuery({ queryKey: ['queue-next'], queryFn: fetchReviewQueueNext });
  const [mockState, setMockState] = useState<'empty' | 'error' | null>(null);

  const startMock = useMutation({
    mutationFn: () => M.startTypedExam('real'),
    onSuccess: (exam) => {
      if (!exam.resultId || exam.problems.length === 0) {
        setMockState('empty');
        return;
      }
      nav(`/app/mocks/real/${exam.resultId}`, {
        state: {
          resultId: exam.resultId,
          userId: user?.id,
          name: exam.name,
          totalMinutes: exam.totalMinutes,
          problems: exam.problems,
          origin: 'test',
        },
      });
    },
    onError: () => setMockState('error'),
  });

  const ready = queue.data?.totalEligible ?? 0;
  const queueEmpty = queue.data && !queue.data.wrongNote;
  const hasPending = !!queue.data?.wrongNote;

  let nextCountdown: string | null = null;
  if (queueEmpty && queue.data?.nextEligibleAt) {
    const ms = new Date(queue.data.nextEligibleAt).getTime() - Date.now();
    if (ms > 0) {
      const h = Math.floor(ms / 3_600_000);
      const d = Math.floor(h / 24);
      const minutes = Math.max(1, Math.ceil(ms / 60_000));
      nextCountdown = d > 0
        ? t('test.duration.days', { n: d })
        : h > 0
          ? t('test.duration.hours', { n: h })
          : (lang === 'ko' ? `${minutes}분` : `${minutes} min`);
    }
  }

  return (
    <div className="screen tabbed-screen review-screen">
      <div className="app-scroll" style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('test.tab.label')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>{t('test.tab.title')}</div>
          </div>
          <HeadAvatar />
        </div>

        <div className="content-rail" style={{ padding: '12px 22px 0' }}>
          <div
            className="card review-hero"
            style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent' }}
          >
            <span className="review-hero-icon" aria-hidden="true">{hasPending ? <RotateCcw size={28} /> : <Clock3 size={28} />}</span>
            <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', color: 'var(--p-primary)', fontWeight: 700 }}>
              <Sparkles size={12} />{t('test.queue.eyebrow')}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 4, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              {queue.isError
                ? (lang === 'ko' ? '복습 목록을 불러오지 못했어요' : 'Could not load your review queue')
                : queue.isLoading
                ? t('test.queue.loading')
                : hasPending
                  ? t('test.queue.ready', { n: ready })
                  : t('test.queue.empty')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {queue.isError
                ? (lang === 'ko' ? '연결을 확인한 뒤 다시 시도해 주세요.' : 'Check your connection and try again.')
                : hasPending
                ? t('test.queue.sub.has')
                : nextCountdown
                  ? t('test.queue.sub.next', { countdown: nextCountdown })
                  : t('test.queue.sub.empty')}
            </div>
            <button
              className="btn"
              disabled={!queue.isError && !hasPending}
              onClick={() => queue.isError ? void queue.refetch() : nav('/app/review')}
              style={{ marginTop: 12, height: 44, fontSize: 13 }}
            >
              {queue.isError
                ? (lang === 'ko' ? '다시 시도' : 'Retry')
                : hasPending ? t('test.queue.start') : t('test.queue.nothing')}
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Rule reminder — explains the 3-day cooldown + forced order. */}
          <div className="section-h">
            <span className="label">{t('test.how.section')}</span>
          </div>
          <div className="card review-explainer" style={{ padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
            {t('test.how.body.pre')}
            <strong style={{ color: 'var(--p-ink)' }}>{t('test.how.body.threeDays')}</strong>
            {t('test.how.body.mid')}
            <strong style={{ color: 'var(--p-ink)' }}>{t('test.how.body.oneAtTime')}</strong>
            {t('test.how.body.order')}
          </div>

          {/* REAL currently uses JEE +4/-1 scoring. Do not expose it to the
              KR-only launch until a country-aware Korean exam model exists. */}
          {user?.country === 'IN' && (
            <>
              <div className="section-h">
                <span className="label">{t('test.mock.section')}</span>
              </div>
              <div className="card mock-challenge-card">
                <span className="mock-icon"><Trophy size={22} /></span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
                  {t('test.mock.title')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4, lineHeight: 1.5 }}>
                  {t('test.mock.desc')}
                </div>
                {pendingRealExam && (
                  <div className="alert" style={{ marginTop: 10, textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t('test.mock.resume.title')}</div>
                    <div style={{ marginTop: 3, fontSize: 12 }}>{t('test.mock.resume.desc')}</div>
                    <button
                      className="btn outline"
                      style={{ marginTop: 10, height: 40 }}
                      onClick={() => nav(`/app/mocks/real/${pendingRealExam.resultId}`)}
                    >
                      {t('test.mock.resume.cta')}
                    </button>
                  </div>
                )}
                {mockState && (
                  <div role="alert" style={{ fontSize: 12, color: 'var(--p-danger, #c0392b)', marginTop: 8 }}>
                    {mockState === 'empty'
                      ? t('test.mock.empty')
                      : (lang === 'ko' ? '시험을 시작하지 못했어요. 연결을 확인하고 다시 시도해 주세요.' : 'Could not start the exam. Check your connection and retry.')}
                  </div>
                )}
                <button
                  className="btn"
                  disabled={startMock.isPending || !!pendingRealExam}
                  onClick={() => { setMockState(null); startMock.mutate(); }}
                  style={{ marginTop: 12, height: 44, fontSize: 13 }}
                >
                  {startMock.isPending ? t('test.mock.starting') : t('test.mock.start')}
                  <ArrowRight size={17} />
                </button>
              </div>
            </>
          )}

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

/* Test tab — entry point for the wrong-note review queue.
 *
 * The actual review (FIFO + 3-day cooldown + sequential gate) lives in
 * ReviewQueueScreen. This tab shows the current queue depth and routes the
 * user there. Auto-scheduled weekly/monthly reviews (cron) are a follow-up;
 * for now reviews are user-triggered.
 */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { fetchReviewQueueNext } from '../../lib/queries';
import * as M from '../../lib/mutations';
import { useT } from '../../lib/i18n';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';

export function TestScreen() {
  const nav = useNavigate();
  const { t } = useT();
  const queue = useQuery({ queryKey: ['queue-next'], queryFn: fetchReviewQueueNext });
  const [mockEmpty, setMockEmpty] = useState(false);

  const startMock = useMutation({
    mutationFn: () => M.startTypedExam('real'),
    onSuccess: (exam) => {
      if (!exam.resultId || exam.problems.length === 0) {
        setMockEmpty(true);
        return;
      }
      nav(`/app/mocks/real/${exam.resultId}`, {
        state: {
          resultId: exam.resultId,
          name: exam.name,
          totalMinutes: exam.totalMinutes,
          problems: exam.problems,
          origin: 'test',
        },
      });
    },
    onError: () => setMockEmpty(true),
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
      nextCountdown = d > 0 ? t('test.duration.days', { n: d }) : t('test.duration.hours', { n: h });
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
              {queue.isLoading
                ? t('test.queue.loading')
                : hasPending
                  ? t('test.queue.ready', { n: ready })
                  : t('test.queue.empty')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {hasPending
                ? t('test.queue.sub.has')
                : nextCountdown
                  ? t('test.queue.sub.next', { countdown: nextCountdown })
                  : t('test.queue.sub.empty')}
            </div>
            <button
              className="btn"
              disabled={!hasPending}
              onClick={() => nav('/app/review')}
              style={{ marginTop: 12, height: 44, fontSize: 13 }}
            >
              {hasPending ? t('test.queue.start') : t('test.queue.nothing')}
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
            <span className="chip" style={{ padding: '1px 6px', fontSize: 10.5 }}>{t('test.how.body.comingSoon')}</span>
            {t('test.how.body.tail')}
          </div>

          {/* Full-paper REAL mock exam — timed, JEE marking, batch submit. */}
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
            {mockEmpty && (
              <div style={{ fontSize: 12, color: 'var(--p-danger, #c0392b)', marginTop: 8 }}>
                {t('test.mock.empty')}
              </div>
            )}
            <button
              className="btn"
              disabled={startMock.isPending}
              onClick={() => { setMockEmpty(false); startMock.mutate(); }}
              style={{ marginTop: 12, height: 44, fontSize: 13 }}
            >
              {startMock.isPending ? t('test.mock.starting') : t('test.mock.start')}
              <ArrowRight size={17} />
            </button>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

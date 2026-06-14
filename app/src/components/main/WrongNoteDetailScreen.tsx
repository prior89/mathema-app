/**
 * WrongNote detail — voluntary deep review (PR-13, Option A).
 *   SM-2 self-rating via POST /wrong-notes/:id/review (not check).
 *   ReviewQueueScreen keeps POST /wrong-notes/:id/check for forced queue.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Lightbulb, Sparkles } from 'lucide-react';
import {
  fetchProblemHint,
  fetchProblemSolution,
  fetchWrongNote,
  type WrongNoteInsightJson,
} from '../../lib/queries';
import { reviewWrongNote, updateWrongNoteStatus, type ReviewQuality } from '../../lib/mutations';
import { Sm2ReviewButtons } from './Sm2ReviewButtons';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { toast } from '../Toast';

export function WrongNoteDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { t } = useT();

  const detail = useQuery({
    queryKey: ['wn-detail', id],
    queryFn: () => fetchWrongNote(id!),
    enabled: !!id,
  });

  const hint = useQuery({
    queryKey: ['hint', detail.data?.problemId],
    queryFn: () => fetchProblemHint(detail.data!.problemId),
    enabled: !!detail.data?.problemId,
  });

  /* Retry-first (user verdict 2026-06-13): showing the answer up front made
     "solve it again" meaningless. Answer + solution stay hidden behind an
     explicit reveal; mastered notes show them right away. */
  const [revealed, setRevealed] = useState(false);
  const isMastered = (detail.data?.status ?? '').toLowerCase() === 'mastered';
  const showSolution = revealed || isMastered;

  const solution = useQuery({
    queryKey: ['problem-solution', detail.data?.problemId],
    queryFn: () => fetchProblemSolution(detail.data!.problemId),
    enabled: !!detail.data?.problemId && showSolution,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['wn-list'] });
    qc.invalidateQueries({ queryKey: ['wn-stats'] });
    qc.invalidateQueries({ queryKey: ['wn-recent'] });
    qc.invalidateQueries({ queryKey: ['wn-due'] });
    qc.invalidateQueries({ queryKey: ['wn-detail', id] });
    qc.invalidateQueries({ queryKey: ['queue-next'] });
  };

  const masterMut = useMutation({
    mutationFn: (noteId: string) => updateWrongNoteStatus(noteId, 'MASTERED'),
    onSuccess: () => {
      toast(t('toast.master.permanent'), 'success');
      invalidate();
    },
    onError: () => toast(t('toast.master.failed'), 'error'),
  });

  const reviewMut = useMutation({
    mutationFn: (q: ReviewQuality) => reviewWrongNote(id!, q),
    onSuccess: (r) => {
      const days = r.nextReviewAt
        ? Math.max(1, Math.ceil((new Date(r.nextReviewAt).getTime() - Date.now()) / 86400000))
        : 0;
      const next = days > 0 ? t('wn.due.inDays', { days }) : '—';
      if (r.autoMastered) toast(t('toast.review.autoMastered'), 'success');
      else if (r.lapsed) toast(t('toast.review.tryAgain', { date: next }), 'info');
      else toast(t('toast.review.done', { date: next }), 'success');
      invalidate();
    },
    onError: () => toast(t('toast.review.failed'), 'error'),
  });

  const note = detail.data;

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => nav('/app/notes')}
            aria-label={t('review.back')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {t('wn.detail.label')}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {note?.problem ?? t('wn.detail.fallbackTitle')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px 16px' }}>
        {detail.isLoading && (
          <div className="card" style={{ padding: 14, color: 'var(--p-muted)', fontSize: 13 }}>
            {t('common.loading')}
          </div>
        )}

        {note && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--p-muted)', flexWrap: 'wrap' }}>
              <span className="status-chip">{note.diff}</span>
              <span className="status-chip" style={{ background: 'var(--p-danger-tint)', color: 'var(--p-danger)' }}>
                {note.errorType}
              </span>
              <span>{note.unit} · {note.subUnit}</span>
              <span style={{ marginLeft: 'auto' }}>{note.date}</span>
            </div>

            {note.problemBody && (
              <Section title={t('wn.detail.problemBody')}>
                <div className="card" style={{ padding: 14, fontSize: 14, lineHeight: 1.65 }}>
                  <MathText text={note.problemBody} />
                </div>
              </Section>
            )}

            {!isMastered && (
              <button
                type="button"
                className="btn"
                style={{ width: '100%' }}
                onClick={() => nav(`/app/practice/${note.problemId}`)}
              >
                {t('wn.detail.practice')}
                <Glyph.ChevronR />
              </button>
            )}

            {note.insightJson
              ? <InsightJsonPanel data={note.insightJson} />
              : note.insight && (
                <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--p-primary)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Sparkles size={14} color="var(--p-primary)" style={{ marginTop: 3, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, lineHeight: 1.65 }}><MathText text={note.insight} /></div>
                  </div>
                </div>
              )}

            {note.problemConcept && (
              <Section title={t('wn.detail.concept')}>
                <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.65 }}>
                  <MathText text={note.problemConcept} />
                  {note.problemFormula && (
                    <div style={{ marginTop: 10, padding: 10, background: 'var(--p-surface-2)', borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: 'var(--p-muted)', marginBottom: 4 }}>{t('wn.detail.formula')}</div>
                      <MathText text={note.problemFormula} />
                    </div>
                  )}
                </div>
              </Section>
            )}

            {!showSolution ? (
              <button
                type="button"
                className="btn outline"
                style={{ width: '100%' }}
                onClick={() => setRevealed(true)}
              >
                {t('wn.detail.reveal')}
              </button>
            ) : (
              <>
                {solution.data && solution.data.steps.length > 0 && (
                  <Section title={t('wn.detail.solution')}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {solution.data.steps.map((s) => (
                        <div key={s.stepIndex} className="card" style={{ padding: 12 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--p-muted)', marginBottom: 6 }}>
                            {s.stepIndex}/{solution.data!.steps.length}
                          </div>
                          <MathText text={s.prompt} />
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {note.problemAnswer && (
                  <div className="card" style={{
                    padding: 14, display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--p-success-tint)', borderColor: 'transparent',
                  }}>
                    <CheckCircle2 size={16} color="var(--p-success)" />
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--p-success)', fontWeight: 700 }}>{t('wn.detail.answer')}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600 }}>
                        <MathText text={note.problemAnswer} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {hint.data?.hint && (
              <Section title={t('wn.detail.hint')}>
                <div className="card" style={{ padding: 12, fontSize: 13 }}><MathText text={hint.data.hint} /></div>
              </Section>
            )}

            {note.similar && note.similar.length > 0 && (
              <Section title={t('wn.detail.similar', { n: note.similar.length })}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {note.similar.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="card"
                      style={{
                        padding: 12,
                        textAlign: 'left',
                        cursor: 'pointer',
                        width: '100%',
                        color: 'var(--p-ink)',
                        fontFamily: 'inherit',
                      }}
                      onClick={() => nav(`/app/practice/${s.id}`)}
                    >
                      <div style={{ fontSize: 13, lineHeight: 1.55 }}>
                        <MathText text={s.preview} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 4 }}>
                        {s.chapter} · {s.difficulty}
                      </div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {!isMastered && (
              <Section title={t('wn.detail.review.label')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 11, color: 'var(--p-muted)' }}>
                  <Clock size={10} />
                  {/* No rep/EF readout (2026-06-12 audit): SM-2 internals mean
                      nothing to students — dueIn already says when it's back. */}
                  <span>{note.dueIn ?? t('wn.detail.review.unreviewed')}</span>
                </div>
                <Sm2ReviewButtons
                  disabled={reviewMut.isPending}
                  onSelect={(q) => reviewMut.mutate(q)}
                />
              </Section>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 8 }}>
              {!isMastered ? (
                <button
                  type="button"
                  className="chip"
                  disabled={masterMut.isPending}
                  onClick={() => masterMut.mutate(note.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <CheckCircle2 size={12} />
                  {masterMut.isPending ? t('common.loading') : t('wn.detail.permanentMaster')}
                </button>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--p-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} /> {t('wn.master.completed')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="section-h" style={{ marginBottom: 8 }}>
        <span className="label">{title}</span>
      </div>
      {children}
    </div>
  );
}

function InsightJsonPanel({ data }: { data: WrongNoteInsightJson }) {
  const { t } = useT();
  const calLabels = {
    over: t('wn.detail.insight.cal.over'),
    under: t('wn.detail.insight.cal.under'),
    aligned: t('wn.detail.insight.cal.aligned'),
  };

  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={14} color="var(--p-primary)" />
        <span style={{ fontSize: 12, fontWeight: 600 }}>{t('wn.detail.insight.title')}</span>
        <span className="chip" style={{ marginLeft: 'auto', fontSize: 10 }}>
          {calLabels[data.confidenceCalibration]}
        </span>
      </div>

      <InsightBlock label={t('wn.detail.insight.rootCause')} body={data.rootCause} />
      <InsightBlock label={t('wn.detail.insight.correctConcept')} body={data.correctConcept} icon={<Lightbulb size={12} />} />

      {data.drillSteps.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--p-muted)', marginBottom: 6 }}>{t('wn.detail.insight.drillSteps')}</div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            {data.drillSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 4 }}><MathText text={step} /></li>
            ))}
          </ol>
        </div>
      )}

      {data.similarPatterns.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--p-muted)', marginBottom: 6 }}>{t('wn.detail.insight.patterns')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.similarPatterns.map((p) => (
              <span key={p} className="chip" style={{ fontSize: 11 }}>{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightBlock({
  label, body, icon,
}: {
  label: string; body: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--p-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon}{label}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}><MathText text={body} /></div>
    </div>
  );
}

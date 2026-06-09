/* UploadProblemModal — student picks/takes/drops/pastes a problem photo or PDF;
 * backend OCR extracts the math text and sends it through the normal solver.
 *
 * After analysis the modal offers a "Practice now" CTA that deep-links into
 * SoloProblemScreen for the just-created Problem row. This bypasses the
 * 3-day cooldown that the Test review queue enforces — direct practice via
 * Notes is always immediate. */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  extractProblemText,
  solveExtractedText,
  OcrResult,
  UploadAnalysisResult,
} from '../../lib/queries';
import { useT } from '../../lib/i18n';
import MathText from '../MathText';
import { Glyph } from '../onboarding/Glyph';

type Props = {
  open: boolean;
  onClose: () => void;
  /** If provided, the modal opens with this file already chosen (skips the
   *  "pick" picker UI). Used by the Study tab's Take-a-photo / Upload
   *  buttons which own their own native <input type="file"> triggers. */
  initialFile?: File | null;
};

type Translate = ReturnType<typeof useT>['t'];

// 3-step Photomath-style flow (PR-16: OCR review before quota-gated solve):
//   pick          → user picks/takes a file
//   ocr-running   → 1-3 s OCR call (cheap, no quota)
//   ocr-review    → confidence badge + editable recognised text; user confirms
//   solve-running → solveExtractedText in flight (spinner)
//   result        → solve completed
//   error         → OCR or solve failed
type Phase = 'pick' | 'ocr-running' | 'ocr-review' | 'solve-running' | 'result' | 'error';

function normalizeOcrConfidence(raw: number | null | undefined): number | null {
  if (raw == null || !Number.isFinite(raw)) return null;
  const n = raw > 1 ? raw / 100 : raw;
  return Math.max(0, Math.min(1, n));
}

export function UploadProblemModal({ open, onClose, initialFile }: Props) {
  const nav = useNavigate();
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>('pick');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [editedOcrText, setEditedOcrText] = useState('');
  const [result, setResult] = useState<UploadAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Wall-clock time the user spent in the modal before tapping Analyze,
  // forwarded to math-helper so DailyActivity reflects real engagement.
  const startedAtRef = useRef<number>(Date.now());
  const requestSeqRef = useRef(0);

  useEffect(() => {
    if (!open) {
      requestSeqRef.current += 1;
      setPhase('pick');
      setFile(null);
      setOcrResult(null);
      setEditedOcrText('');
      setResult(null);
      setError(null);
      setStudentAnswer('');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } else {
      startedAtRef.current = Date.now();
      // If the caller pre-loaded a file (Study tab buttons that own their own
      // file input), surface it immediately as if the user had picked here.
      if (initialFile) {
        setFile(initialFile);
        if (initialFile.type.startsWith('image/')) {
          setPreviewUrl(URL.createObjectURL(initialFile));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []).find((item) => item.type.startsWith('image/'));
      if (pasted) onPick(pasted);
    };
    document.addEventListener('paste', onPaste);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('paste', onPaste);
      document.body.style.overflow = '';
    };
  }, [open, onClose, previewUrl]);

  if (!open) return null;

  const onPick = (f: File | null) => {
    requestSeqRef.current += 1;
    if (!f) {
      setFile(null);
      setPhase('pick');
      setOcrResult(null);
      setResult(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setPhase('pick');
    setError(null);
    setOcrResult(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const runOcr = async () => {
    if (!file) return;
    const requestSeq = requestSeqRef.current + 1;
    requestSeqRef.current = requestSeq;
    setPhase('ocr-running');
    setError(null);
    setOcrResult(null);
    setEditedOcrText('');
    try {
      const ocr = await extractProblemText(file);
      if (requestSeq !== requestSeqRef.current) return;
      setOcrResult(ocr);
      setEditedOcrText(ocr.text);
      setPhase('ocr-review');
    } catch (e) {
      if (requestSeq !== requestSeqRef.current) return;
      const msg = extractErrorMessage(e, t) ?? t('upload.error.failed');
      setError(msg);
      setPhase('error');
    }
  };

  const runSolve = async () => {
    if (!ocrResult) return;
    const question = editedOcrText.trim();
    if (!question) return;
    const requestSeq = requestSeqRef.current + 1;
    requestSeqRef.current = requestSeq;
    setPhase('solve-running');
    setError(null);
    try {
      const durationSec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
      const solveResponse = await solveExtractedText(question, studentAnswer, durationSec);
      if (requestSeq !== requestSeqRef.current) return;
      setResult({
        extractedText: question,
        latex: ocrResult.latex ?? null,
        confidence: ocrResult.confidence ?? null,
        source: ocrResult.source,
        result: solveResponse,
      });
      setPhase('result');
    } catch (e) {
      if (requestSeq !== requestSeqRef.current) return;
      const msg = extractErrorMessage(e, t) ?? t('upload.error.failed');
      setError(msg);
      setPhase('error');
    }
  };

  const practiceNow = () => {
    const problemId = result?.result.problemId;
    if (!problemId) return;
    onClose();
    nav(`/app/practice/${problemId}`);
  };

  const retry = () => {
    requestSeqRef.current += 1;
    setPhase('pick');
    setError(null);
    setOcrResult(null);
    setEditedOcrText('');
    setResult(null);
  };

  /** Return to picker — cancels any in-flight OCR/solve via requestSeq bump. */
  const retakePhoto = () => {
    requestSeqRef.current += 1;
    setPhase('pick');
    setOcrResult(null);
    setEditedOcrText('');
    setResult(null);
    setError(null);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(31,26,20,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 540, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto',
          background: 'var(--p-surface)', border: '1px solid var(--p-border)',
          borderRadius: 16, padding: 22, color: 'var(--p-ink)',
          boxShadow: '0 20px 60px rgba(31,26,20,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>{t('upload.title.eyebrow')}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '-0.01em', marginTop: 4 }}>
              {t('upload.title')}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('upload.closeAria')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-ink-2)', fontSize: 22, lineHeight: 1, padding: 4 }}
          >×</button>
        </div>

        {phase === 'pick' && (
          <PickPhase
            file={file}
            previewUrl={previewUrl}
            onPick={onPick}
            onAnalyze={runOcr}
            studentAnswer={studentAnswer}
            onStudentAnswer={setStudentAnswer}
            fileInputRef={fileInputRef}
          />
        )}

        {phase === 'ocr-running' && (
          <OcrRunningPhase
            fileName={file?.name ?? ''}
            previewUrl={previewUrl}
            onRetake={retakePhoto}
          />
        )}

        {phase === 'ocr-review' && ocrResult && (
          <OcrReviewPhase
            ocrResult={ocrResult}
            editedText={editedOcrText}
            onEditedText={setEditedOcrText}
            onRetake={retakePhoto}
            onSolve={runSolve}
          />
        )}

        {phase === 'solve-running' && ocrResult && (
          <SolveRunningPhase
            questionText={editedOcrText.trim() || ocrResult.text}
            onRetake={retakePhoto}
          />
        )}

        {phase === 'result' && result && (
          <ResultPhase
            result={result}
            onRetry={retry}
            onClose={onClose}
            onPracticeNow={result.result.problemId ? practiceNow : undefined}
          />
        )}

        {phase === 'error' && (
          <ErrorPhase error={error ?? t('upload.error.unknown')} onRetry={retry} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function extractErrorMessage(e: unknown, t: Translate): string | null {
  const data = (e as { response?: { data?: any } })?.response?.data;
  const code = data?.error?.code ?? data?.code;
  const message = data?.error?.message ?? data?.message ?? (e as Error)?.message;
  if (code === 'SolverUnavailable' || message === 'SolverUnavailable') {
    return t('upload.error.solverUnavailable');
  }
  if (Array.isArray(message)) return message.join('; ');
  return typeof message === 'string' ? message : null;
}

function PickPhase({
  file, previewUrl, onPick, onAnalyze, studentAnswer, onStudentAnswer, fileInputRef,
}: {
  file: File | null;
  previewUrl: string | null;
  onPick: (f: File | null) => void;
  onAnalyze: () => void;
  studentAnswer: string;
  onStudentAnswer: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const { t } = useT();
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--p-ink-2)', margin: '0 0 14px' }}>
        {t('upload.pick.intro')}
      </p>
      {/* Multi-part advisory — user-spec 2026-05-23: the SolveResponse schema
          returns one `answer` string per request, so a photo containing two
          labelled sub-problems forces the solver to merge them, often with the
          wrong-answer-for-the-wrong-part artefact the user saw (60000 for the
          (1)+(2) sequence problem). Solver prompt now demands a labelled
          multi-line answer when it detects parts, but the cleanest signal
          remains "one problem per upload". */}
      <div
        style={{
          padding: '10px 12px', marginBottom: 14, borderRadius: 8, fontSize: 12,
          background: 'var(--p-accent-tint)', color: 'var(--p-ink-2)', lineHeight: 1.45,
        }}
      >
        {t('upload.pick.tip')}
      </div>

      {/* Preview area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onPick(e.dataTransfer.files?.[0] ?? null);
        }}
        style={{
          border: '1.5px dashed var(--p-border)', borderRadius: 12,
          padding: 18, textAlign: 'center', background: 'var(--p-bg)', minHeight: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file?.name ?? 'preview'}
            style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, objectFit: 'contain' }}
          />
        ) : file ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{file.name}</div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 4 }}>
              {(file.size / 1024).toFixed(1)} KB · PDF
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--p-muted)', fontSize: 13 }}>
            {t('upload.pick.preview.empty')}
          </div>
        )}
      </div>

      <label style={{ ...fieldLabel, marginTop: 12 }}>{t('upload.pick.answer.label')}
        <input
          value={studentAnswer}
          onChange={(e) => onStudentAnswer(e.target.value)}
          style={inputStyle}
          placeholder={t('upload.pick.answer.placeholder')}
        />
      </label>

      {/* Two-button picker — capture forces the camera on mobile, the other
          opens gallery / Files / Finder. capture is ignored on desktop. */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => document.getElementById('upload-problem-camera')?.click()}
          style={{
            flex: 1, padding: '11px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none', cursor: 'pointer',
          }}
        >
          {t('upload.pick.takePhoto')}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            flex: 1, padding: '11px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'var(--p-surface)', color: 'var(--p-ink)', border: '1px solid var(--p-border)', cursor: 'pointer',
          }}
        >
          {t('upload.pick.chooseFile')}
        </button>
      </div>

      <input
        id="upload-problem-camera"
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <input
        ref={fileInputRef}
        id="upload-problem-file"
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        {file && (
          <button
            onClick={() => onPick(null)}
            style={{
              background: 'transparent', border: '1px solid var(--p-border)', color: 'var(--p-ink-2)',
              padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
            }}
          >{t('upload.pick.change')}</button>
        )}
        <button
          onClick={onAnalyze}
          disabled={!file}
          style={{
            background: file ? 'var(--p-primary)' : 'var(--p-border)',
            color: file ? 'var(--p-primary-fg)' : 'var(--p-muted)',
            border: 'none', padding: '10px 18px', borderRadius: 10,
            cursor: file ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600,
          }}
        >
          {t('upload.pick.analyze')}
        </button>
      </div>
    </div>
  );
}

/**
 * OCR-only phase (1-3 s typical). Two-stage status text swaps at 1.5 s so the
 * user always sees movement even when the network is on its slowest path.
 * Empirically the OCR API itself returns in 1-3 s; the second message is a
 * Doherty-Threshold cushion ("still working") rather than a true progress step.
 */
function OcrRunningPhase({
  fileName, previewUrl, onRetake,
}: {
  fileName: string;
  previewUrl: string | null;
  onRetake: () => void;
}) {
  const { t } = useT();
  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - started);
    }, 500);
    return () => window.clearInterval(timer);
  }, []);
  const activeStage = elapsedMs < 2500 ? 0 : elapsedMs < 6500 ? 1 : 2;
  const stageLabel = [
    t('upload.stage.preparing'),
    t('upload.stage.reading'),
    t('upload.stage.checking'),
  ][activeStage];
  return (
    <div style={{ padding: '8px 0 4px' }}>
      <style>{`@keyframes mathema-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 12, overflow: 'hidden',
            background: 'var(--p-bg)', border: '1px solid var(--p-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {previewUrl ? (
              <img src={previewUrl} alt={fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="caption" style={{ fontSize: 11 }}>PDF</span>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid var(--p-border)', borderTopColor: 'var(--p-primary)',
                animation: 'mathema-spin 0.9s linear infinite', flexShrink: 0,
              }} />
              <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--p-ink)' }}>{stageLabel}</div>
            </div>
            <div style={{
              marginTop: 6, fontSize: 12, color: 'var(--p-muted)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {fileName}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 14 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 4,
                borderRadius: 4,
                background: i <= activeStage ? 'var(--p-primary)' : 'var(--p-border)',
                transition: 'background .18s ease-out',
              }}
            />
          ))}
        </div>
      </div>

      {elapsedMs >= 8000 && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          borderRadius: 10,
          background: 'var(--p-primary-tint)',
          color: 'var(--p-ink-2)',
          fontSize: 12.5,
          lineHeight: 1.45,
        }}>
          {t('upload.stage.slow')}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
        <button
          type="button"
          onClick={onRetake}
          style={{
            background: 'transparent',
            border: '1px solid var(--p-border)',
            color: 'var(--p-ink-2)',
            padding: '8px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 12.5,
          }}
        >
          {t('upload.stage.retake')}
        </button>
      </div>
    </div>
  );
}

function OcrConfidenceBadge({ confidence }: { confidence: number | null | undefined }) {
  const { t } = useT();
  const norm = normalizeOcrConfidence(confidence);
  const pct = norm != null ? Math.round(norm * 100) : null;
  const tier = norm == null ? 'unknown' : norm >= 0.8 ? 'high' : norm >= 0.5 ? 'medium' : 'low';
  const bg = tier === 'high'
    ? 'var(--p-success-tint)'
    : tier === 'medium'
      ? 'var(--p-accent-tint)'
      : tier === 'low'
        ? 'var(--p-warning-tint)'
        : 'var(--p-surface-2)';
  const label = pct != null
    ? t(`upload.ocrReview.confidence.${tier}`, { pct })
    : t('upload.ocrReview.confidence.unknown');
  return (
    <span className="chip" style={{ fontSize: 10.5, background: bg, color: 'var(--p-ink)' }}>
      {label}
    </span>
  );
}

/** PR-16 — user verifies/edits OCR text before quota-gated solve starts. */
function OcrReviewPhase({
  ocrResult, editedText, onEditedText, onRetake, onSolve,
}: {
  ocrResult: OcrResult;
  editedText: string;
  onEditedText: (value: string) => void;
  onRetake: () => void;
  onSolve: () => void;
}) {
  const { t } = useT();
  const norm = normalizeOcrConfidence(ocrResult.confidence);
  const showLowWarning = norm == null || norm < 0.7;
  const canSolve = editedText.trim().length > 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('upload.ocrReview.title')}</div>
        <OcrConfidenceBadge confidence={ocrResult.confidence} />
      </div>

      {showLowWarning && (
        <div style={{
          marginTop: 10, padding: '10px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.45,
          background: 'var(--p-warning-tint)', color: 'var(--p-ink-2)',
        }}>
          {t('upload.ocrReview.lowWarning')}
        </div>
      )}

      <label style={{ ...fieldLabel, marginTop: 12 }}>
        {t('upload.ocrReview.editLabel')}
        <textarea
          value={editedText}
          onChange={(e) => onEditedText(e.target.value)}
          placeholder={t('upload.ocrReview.placeholder')}
          rows={5}
          style={{
            ...inputStyle,
            minHeight: 120,
            resize: 'vertical',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.5,
            textTransform: 'none',
          }}
        />
      </label>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          type="button"
          onClick={onRetake}
          className="btn outline"
          style={{ flex: 1 }}
        >
          {t('upload.ocrReview.retake')}
        </button>
        <button
          type="button"
          onClick={onSolve}
          disabled={!canSolve}
          className="btn"
          style={{ flex: 1, opacity: canSolve ? 1 : 0.55 }}
        >
          {t('upload.ocrReview.solve')}
        </button>
      </div>
    </div>
  );
}

/** Solve in flight — read-only confirmed text + rotating status labels. */
function SolveRunningPhase({
  questionText, onRetake,
}: {
  questionText: string;
  onRetake: () => void;
}) {
  const { t } = useT();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 4000);
    const t2 = setTimeout(() => setStage(2), 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const solvingLabel = [
    t('upload.solving.thinking'),
    t('upload.solving.writing'),
    t('upload.solving.almost'),
  ][stage];

  return (
    <div>
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('upload.ocrDone.title')}</div>
        <div className="math-big" style={{ fontSize: 15, marginTop: 6, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          <MathText text={questionText} />
        </div>
      </div>

      <button
        type="button"
        onClick={onRetake}
        style={{
          marginTop: 10,
          background: 'transparent',
          border: '1px solid var(--p-border)',
          color: 'var(--p-ink-2)',
          padding: '8px 14px',
          borderRadius: 10,
          cursor: 'pointer',
          fontSize: 12.5,
        }}
      >
        {t('upload.ocrDone.retake')}
      </button>

      <div style={{
        marginTop: 18,
        padding: '14px 16px',
        background: 'var(--p-primary-tint)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: '2.5px solid var(--p-border)', borderTopColor: 'var(--p-primary)',
          animation: 'mathema-spin 0.9s linear infinite', flexShrink: 0,
        }} />
        <div style={{ fontSize: 13, color: 'var(--p-ink)', fontWeight: 500 }}>
          {solvingLabel}
        </div>
      </div>
    </div>
  );
}

function ResultPhase({
  result, onRetry, onClose, onPracticeNow,
}: {
  result: UploadAnalysisResult;
  onRetry: () => void;
  onClose: () => void;
  onPracticeNow?: () => void;
}) {
  const { t } = useT();
  const solve = result.result;
  const checked = solve.isStudentCorrect !== undefined && solve.isStudentCorrect !== null;
  const conceptText = [solve.detected.chapter, solve.detected.topic].filter(Boolean).join(' · ');
  const hints = (solve.hints ?? []).filter(Boolean);
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const verification = solve.verification;
  const confidencePct = verification
    ? Math.round(Math.max(0, Math.min(1, verification.confidence)) * 100)
    : null;

  return (
    <div>
      {/* PROBLEM card -- matches the Mastery / Study problem card style */}
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('upload.result.problem.eyebrow')}</div>
        <div className="math-big" style={{ fontSize: 15, marginTop: 6, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          <MathText text={result.extractedText} />
        </div>
      </div>

      {/* Concept chip */}
      {conceptText && (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>{t('upload.result.concept.eyebrow')}</span>
          <span className="chip" style={{ fontSize: 11.5 }}>
            <MathText text={conceptText} />
          </span>
        </div>
      )}

      {verification && (
        <div className="card" style={{
          marginTop: 12, padding: 12,
          background: verification.isVerified ? 'var(--p-success-tint)' : 'var(--p-warning-tint)',
          borderColor: 'transparent',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Glyph.Check accent={verification.isVerified ? 'var(--p-success)' : 'var(--p-warning)'} size={14} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--p-ink)' }}>
              {verification.isVerified
                ? t('upload.result.verification.verified')
                : t('upload.result.verification.unverified')}
            </span>
            {confidencePct != null && (
              <span className="chip" style={{ fontSize: 10.5 }}>
                {t('upload.result.verification.confidence', { pct: confidencePct })}
              </span>
            )}
          </div>
          {verification.caution && (
            <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.5, color: 'var(--p-ink-2)' }}>
              <span style={{ fontWeight: 600 }}>{t('upload.result.verification.caution')}: </span>
              <MathText text={verification.caution} />
            </div>
          )}
          {verification.issues.length > 0 && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, lineHeight: 1.5, color: 'var(--p-ink-2)' }}>
              {verification.issues.map((issue, idx) => (
                <li key={idx}><MathText text={issue} /></li>
              ))}
            </ul>
          )}
        </div>
      )}

      {hints.length > 0 && (
        <div className="card" style={{ padding: 14, marginTop: 12, background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{t('upload.result.hints.eyebrow')}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {hints.slice(0, revealedHintCount).map((hint, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: 'var(--p-accent-tint)', fontSize: 13.5, lineHeight: 1.55,
                  color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap',
                }}
              >
                <MathText text={hint} />
              </div>
            ))}
          </div>
          {revealedHintCount < hints.length ? (
            <button
              type="button"
              className="btn outline"
              style={{ marginTop: 10, width: '100%' }}
              onClick={() => setRevealedHintCount((n) => Math.min(n + 1, hints.length))}
            >
              {t('upload.result.hints.next', { n: revealedHintCount + 1, total: hints.length })}
            </button>
          ) : (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--p-muted)' }}>
              {t('upload.result.hints.allShown')}
            </div>
          )}
        </div>
      )}

      {!solutionRevealed ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--p-muted)', marginBottom: 8 }}>
            {t('upload.result.reveal.hint')}
          </div>
          <button type="button" className="btn" style={{ width: '100%' }} onClick={() => setSolutionRevealed(true)}>
            {t('upload.result.reveal')}
          </button>
        </div>
      ) : (
        <>
          {(solve.steps && solve.steps.length > 0) || solve.explanation ? (
            <div className="card" style={{ padding: 14, marginTop: 12, background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{t('upload.result.solution.eyebrow')}</div>
              {solve.steps && solve.steps.length > 0 ? (
                <ol style={{
                  margin: 0,
                  paddingLeft: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 10,
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: 'var(--p-ink-2)',
                }}>
                  {solve.steps.map((step, idx) => (
                    <li key={idx} style={{ whiteSpace: 'pre-wrap' }}>
                      <MathText text={step} />
                    </li>
                  ))}
                </ol>
              ) : null}
              {solve.explanation && solve.steps && solve.steps.length > 0 ? (
                <div style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: '1px solid var(--p-border)',
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: 'var(--p-ink-3)',
                  fontStyle: 'italic',
                  whiteSpace: 'pre-wrap',
                }}>
                  <MathText text={solve.explanation} />
                </div>
              ) : null}
              {solve.explanation && (!solve.steps || solve.steps.length === 0) ? (
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap' }}>
                  <MathText text={solve.explanation} />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="card" style={{
            marginTop: 12, padding: '14px 16px',
            background: 'var(--p-primary-tint)', borderColor: 'var(--p-primary)',
          }}>
            <div className="eyebrow" style={{ fontSize: 10, color: 'var(--p-primary)' }}>{t('upload.result.answer.eyebrow')}</div>
            <div style={{ marginTop: 6, fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
              <MathText text={solve.answer || '—'} />
            </div>
          </div>
        </>
      )}

      {checked && (
        <div className="card" style={{
          marginTop: 12, padding: 12,
          background: solve.isStudentCorrect ? 'var(--p-success-tint)' : 'var(--p-warning-tint)',
          borderColor: 'transparent', fontSize: 13, fontWeight: 600,
          color: solve.isStudentCorrect ? 'var(--p-success)' : 'var(--p-warning)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Glyph.Check accent="currentColor" size={14} />
          <span>{solve.isStudentCorrect ? t('upload.result.correct') : t('upload.result.wrong')}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn outline" onClick={onRetry} style={{ flex: 1 }}>
          {t('upload.result.tryAnother')}
        </button>
        {onPracticeNow ? (
          <button className="btn" onClick={onPracticeNow} style={{ flex: 1 }}>
            {t('upload.result.saveNotes')}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn" onClick={onClose} style={{ flex: 1 }}>
            {t('upload.result.done')}
            <Glyph.ChevronR />
          </button>
        )}
      </div>
    </div>
  );
}

const fieldLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 11px', borderRadius: 8, border: '1px solid var(--p-border)', background: 'var(--p-surface)', color: 'var(--p-ink)', font: 'inherit', fontSize: 12.5 };

function ErrorPhase({ error, onRetry, onClose }: { error: string; onRetry: () => void; onClose: () => void }) {
  const { t } = useT();
  return (
    <div>
      <div style={{
        background: 'var(--p-danger-tint)', border: '1px solid var(--p-border)', color: 'var(--p-danger)',
        padding: 12, borderRadius: 10, fontSize: 13,
      }}>
        {error}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: '1px solid var(--p-border)', color: 'var(--p-ink-2)',
            padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
          }}
        >{t('upload.error.close')}</button>
        <button
          onClick={onRetry}
          style={{
            background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
            padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >{t('upload.error.retry')}</button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: 'var(--p-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--p-ink)' }}>{children}</div>
    </div>
  );
}

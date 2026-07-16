/* UploadProblemModal — student picks/takes/drops/pastes a problem photo or PDF;
 * backend OCR extracts the math text and sends it through the normal solver.
 *
 * After analysis the modal offers a "Practice now" CTA that deep-links into
 * SoloProblemScreen for the just-created Problem row. This bypasses the
 * 3-day cooldown that the Test review queue enforces — direct practice via
 * Notes is always immediate. */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  extractProblemText,
  solveExtractedText,
  reportProblem,
  OcrResult,
  UploadAnalysisResult,
} from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { compressImageForUpload } from '../../lib/image-compress';
import {
  CropRect, FULL_CROP, MIN_CROP_EDGE, cropImageFile, isEffectivelyFullCrop,
} from '../../lib/image-crop';
import { useBillingUiEnabled } from '../../lib/billing-flags';
import MathText from '../MathText';
import { Glyph } from '../onboarding/Glyph';
import { toast } from '../Toast';

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
  const billingUi = useBillingUiEnabled();
  const [phase, setPhase] = useState<Phase>('pick');
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Problem-region selection over the ORIGINAL picked photo (normalized).
  // Cropping before OCR is the structural misread fix: the problem gets the
  // full pixel budget instead of 1/3 of a page shot.
  const [cropRect, setCropRect] = useState<CropRect>(FULL_CROP);
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
      setQuotaBlocked(false);
      setStudentAnswer('');
      setCropRect(FULL_CROP);
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
      // Pick phase only. Once OCR/solve state exists, a stray Ctrl+V (e.g. while
      // the source-edit textarea is focused, or a leftover clipboard image on
      // the result) must not onPick-reset the modal and throw away a result the
      // user spent a solve credit on — same invariant as the backdrop guard.
      if (phase !== 'pick') return;
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
  }, [open, onClose, previewUrl, phase]);

  // Unmount safety net: the !open branch above revokes the object URL when the
  // modal closes normally, but practiceNow()/goUpgrade() navigate away and
  // unmount the whole tree while open — without this the multi-MB photo URL
  // leaks until page reload. Revoking an already-revoked URL is a no-op, so
  // this coexists with the manual revokes at the set sites.
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

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
    setCropRect(FULL_CROP);
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
      // Downscale the raw phone photo before upload — cuts mobile upload time
      // with no OCR accuracy loss (falls back to original).
      // Crop to the selected problem region first (no-op on a full selection),
      // then compress: the crop gets the whole pixel budget of MAX_EDGE.
      const source = previewUrl ? await cropImageFile(file, cropRect) : file;
      const toSend = await compressImageForUpload(source);
      // From here on, show the CROPPED+COMPRESSED image everywhere: it is what
      // OCR actually received (honest comparison target for spotting misreads)
      // and decodes ~4x cheaper than a 12MP original on low-end WebViews.
      if (toSend !== file && requestSeq === requestSeqRef.current) {
        // The previous (full-res) URL is revoked by the [previewUrl] effect cleanup.
        setPreviewUrl(URL.createObjectURL(toSend));
      }
      const ocr = await extractProblemText(toSend);
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
      if (isQuotaExceededError(e)) {
        // Contextual paywall trigger: the hard 403 is the highest-intent
        // moment, so surface the upgrade CTA right here instead of a raw error.
        setQuotaBlocked(true);
        setError(t('upload.error.quota'));
      } else {
        setError(extractErrorMessage(e, t) ?? t('upload.error.failed'));
      }
      setPhase('error');
    }
  };

  const practiceNow = () => {
    const problemId = result?.result.problemId;
    if (!problemId) return;
    onClose();
    nav(`/app/practice/${problemId}`);
  };

  /** Back on the picker the crop overlay must sit on the ORIGINAL photo again —
   *  runOcr may have swapped previewUrl to the cropped/compressed variant, and
   *  cropRect math is defined over the original file. */
  const restorePickPreview = () => {
    setCropRect(FULL_CROP);
    if (file?.type.startsWith('image/')) {
      // The swapped URL is revoked by the [previewUrl] effect cleanup.
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const retry = () => {
    requestSeqRef.current += 1;
    setPhase('pick');
    setError(null);
    setQuotaBlocked(false);
    setOcrResult(null);
    setEditedOcrText('');
    setResult(null);
    restorePickPreview();
  };

  const goUpgrade = () => {
    onClose();
    nav('/app/paywall?reason=quota');
  };

  /** Return to picker — cancels any in-flight OCR/solve via requestSeq bump. */
  const retakePhoto = () => {
    requestSeqRef.current += 1;
    setPhase('pick');
    setOcrResult(null);
    setEditedOcrText('');
    setResult(null);
    setError(null);
    restorePickPreview();
  };

  return (
    <div
      // Backdrop dismiss ONLY on the initial pick phase (nothing to lose). Once
      // OCR/solve is running or a result/error is shown, an accidental tap on the
      // backdrop must NOT close the modal and throw away a result the user waited
      // for and spent a solve credit on — they close explicitly with the ✕ button.
      onClick={phase === 'pick' ? onClose : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'var(--p-overlay)',
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
          boxShadow: 'var(--p-shadow-lg)',
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
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-ink-2)',
              fontSize: 22, lineHeight: 1, padding: 0,
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginRight: -10,
            }}
          >×</button>
        </div>

        {phase === 'pick' && (
          <PickPhase
            file={file}
            previewUrl={previewUrl}
            cropRect={cropRect}
            onCropRect={setCropRect}
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
            previewUrl={previewUrl}
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
            previewUrl={previewUrl}
            onRetry={retry}
            onClose={onClose}
            onPracticeNow={result.result.problemId ? practiceNow : undefined}
          />
        )}

        {phase === 'error' && (
          <ErrorPhase
            error={error ?? t('upload.error.unknown')}
            onRetry={retry}
            onClose={onClose}
            onUpgrade={quotaBlocked && billingUi ? goUpgrade : undefined}
          />
        )}
      </div>
    </div>
  );
}

/** PR-14 — per-step "why" accordion layered on PR-15 Socratic reveal. */
function SolutionStepsList({
  steps,
  rationales,
}: {
  steps: string[];
  rationales?: string[];
}) {
  const { t } = useT();
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

  const toggleWhy = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
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
      {steps.map((step, idx) => {
        const why = rationales?.[idx]?.trim();
        const isOpen = expanded.has(idx);
        return (
          <li key={idx}>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <MathText text={step} />
            </div>
            {why ? (
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => toggleWhy(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: 'var(--p-primary)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {isOpen ? t('upload.result.step.whyHide') : t('upload.result.step.why')}
                </button>
                {isOpen && (
                  <div style={{
                    marginTop: 6,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'var(--p-accent-tint)',
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: 'var(--p-ink-2)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    <MathText text={why} />
                  </div>
                )}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function isQuotaExceededError(e: unknown): boolean {
  const data = (e as { response?: { data?: any } })?.response?.data;
  // HttpExceptionFilter wraps the guard payload as { error: { error: 'QuotaExceeded', … } };
  // the bare shape is kept for safety with unwrapped responses. OcrQuotaExceeded
  // (the 40/day OCR ceiling) gets the same quota UX — without it the user saw a
  // raw "upload failed" and kept retrying a hard daily limit.
  const code = data?.error?.error ?? data?.error;
  return code === 'QuotaExceeded' || code === 'OcrQuotaExceeded';
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

const clamp01 = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type CropDragMode = 'move' | 'tl' | 'tr' | 'bl' | 'br';

function applyCropDrag(mode: CropDragMode, start: CropRect, dx: number, dy: number): CropRect {
  if (mode === 'move') {
    return {
      ...start,
      x: clamp01(start.x + dx, 0, 1 - start.w),
      y: clamp01(start.y + dy, 0, 1 - start.h),
    };
  }
  let x1 = start.x;
  let y1 = start.y;
  let x2 = start.x + start.w;
  let y2 = start.y + start.h;
  if (mode === 'tl' || mode === 'bl') x1 = clamp01(x1 + dx, 0, x2 - MIN_CROP_EDGE);
  if (mode === 'tr' || mode === 'br') x2 = clamp01(x2 + dx, x1 + MIN_CROP_EDGE, 1);
  if (mode === 'tl' || mode === 'tr') y1 = clamp01(y1 + dy, 0, y2 - MIN_CROP_EDGE);
  if (mode === 'bl' || mode === 'br') y2 = clamp01(y2 + dy, y1 + MIN_CROP_EDGE, 1);
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

/** Problem-region selector over the pick-phase preview (Photomath pattern).
 *  Defaults to the full photo so it costs zero taps when the shot is already
 *  tight; one drag on a full-page shot is the structural misread fix. Pointer
 *  events cover touch and mouse; drag deltas are normalized against this
 *  overlay's own box (inset:0 == the displayed image box). */
function CropOverlay({ rect, onRect }: { rect: CropRect; onRect: (r: CropRect) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ mode: CropDragMode; startX: number; startY: number; start: CropRect } | null>(null);

  const begin = (mode: CropDragMode) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { mode, startX: e.clientX, startY: e.clientY, start: rect };
  };
  const move = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const root = rootRef.current;
    if (!drag || !root) return;
    const bounds = root.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    const dx = (e.clientX - drag.startX) / bounds.width;
    const dy = (e.clientY - drag.startY) / bounds.height;
    onRect(applyCropDrag(drag.mode, drag.start, dx, dy));
  };
  const end = () => { dragRef.current = null; };

  const pct = (v: number) => `${v * 100}%`;
  const handleBase: React.CSSProperties = {
    position: 'absolute', width: 22, height: 22, borderRadius: '50%',
    background: 'var(--p-primary)', border: '2px solid var(--p-primary-fg)',
    touchAction: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
  };
  const handles: Array<{ mode: CropDragMode; style: React.CSSProperties }> = [
    { mode: 'tl', style: { left: -11, top: -11, cursor: 'nwse-resize' } },
    { mode: 'tr', style: { right: -11, top: -11, cursor: 'nesw-resize' } },
    { mode: 'bl', style: { left: -11, bottom: -11, cursor: 'nesw-resize' } },
    { mode: 'br', style: { right: -11, bottom: -11, cursor: 'nwse-resize' } },
  ];

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
      <div
        role="presentation"
        onPointerDown={begin('move')}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{
          position: 'absolute',
          left: pct(rect.x), top: pct(rect.y), width: pct(rect.w), height: pct(rect.h),
          border: '2px solid var(--p-primary)', borderRadius: 6,
          // Dim everything OUTSIDE the selection (clipped by the overflow:hidden root).
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
          touchAction: 'none', cursor: 'move', boxSizing: 'border-box',
        }}
      >
        {handles.map(({ mode, style }) => (
          <div
            key={mode}
            role="presentation"
            onPointerDown={begin(mode)}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            style={{ ...handleBase, ...style }}
          />
        ))}
      </div>
    </div>
  );
}

function PickPhase({
  file, previewUrl, cropRect, onCropRect, onPick, onAnalyze, studentAnswer, onStudentAnswer, fileInputRef,
}: {
  file: File | null;
  previewUrl: string | null;
  cropRect: CropRect;
  onCropRect: (rect: CropRect) => void;
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
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', lineHeight: 0 }}>
            <img
              src={previewUrl}
              alt={file?.name ?? 'preview'}
              style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 8, objectFit: 'contain', display: 'block' }}
            />
            <CropOverlay rect={cropRect} onRect={onCropRect} />
          </div>
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

      {previewUrl && (
        <p style={{ fontSize: 11.5, color: 'var(--p-muted)', margin: '6px 0 0', textAlign: 'center' }}>
          {t('upload.pick.cropHint')}
        </p>
      )}

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

/** Misread-comparison photo, shared by ocr-review and result. A full-page
    textbook shot fitted into a ~180px box cannot distinguish "−600n" from
    "−6000" — the exact incident this exists for — so tapping toggles a
    pannable 1:1 view. */
function ProblemPhotoView({ previewUrl, maxHeight, background }: {
  previewUrl: string;
  maxHeight: number;
  background: string;
}) {
  const { t } = useT();
  const [zoomed, setZoomed] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button
        type="button"
        aria-expanded={zoomed}
        onClick={() => setZoomed((z) => !z)}
        style={{
          display: 'block', width: '100%', padding: 0,
          cursor: zoomed ? 'zoom-out' : 'zoom-in',
          borderRadius: 10, border: '1px solid var(--p-border)', background,
          overflow: 'auto', maxHeight: zoomed ? 320 : maxHeight,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <img
          src={previewUrl}
          alt={t('upload.ocrReview.photoAlt')}
          style={zoomed
            ? { display: 'block', maxWidth: 'none' }
            : { display: 'block', width: '100%', maxHeight, objectFit: 'contain' }}
        />
      </button>
      <div style={{ fontSize: 10.5, color: 'var(--p-muted)', marginTop: 4, textAlign: 'center' }}>
        {zoomed ? t('upload.photo.zoomOutHint') : t('upload.photo.zoomInHint')}
      </div>
    </div>
  );
}

/** PR-16 — user verifies/edits OCR text before quota-gated solve starts. */
function OcrReviewPhase({
  ocrResult, previewUrl, editedText, onEditedText, onRetake, onSolve,
}: {
  ocrResult: OcrResult;
  previewUrl: string | null;
  editedText: string;
  onEditedText: (value: string) => void;
  onRetake: () => void;
  onSolve: () => void;
}) {
  const { t } = useT();
  const norm = normalizeOcrConfidence(ocrResult.confidence);
  const showLowWarning = norm == null || norm < 0.7;
  const canSolve = editedText.trim().length > 0;
  const [sourceOpen, setSourceOpen] = useState(showLowWarning);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('upload.ocrReview.title')}</div>
        <OcrConfidenceBadge confidence={ocrResult.confidence} />
      </div>

      {/* Original photo beside the recognized text — without it the user has no
          way to SPOT an OCR misread (a real incident: "−600n" was read as
          "−6000" and the solver faithfully solved the wrong problem while
          verification passed — it can only check the solution against the
          *received* text, never against the photo). */}
      {previewUrl && (
        <ProblemPhotoView previewUrl={previewUrl} maxHeight={180} background="var(--p-surface-2)" />
      )}

      {showLowWarning && (
        <div style={{
          marginTop: 10, padding: '10px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.45,
          background: 'var(--p-warning-tint)', color: 'var(--p-ink-2)',
        }}>
          {t('upload.ocrReview.lowWarning')}
        </div>
      )}

      {/* Live rendered preview of the OCR'd / recognised problem text.
          This is the key "문제인식확인" (recognition confirmation) moment.
          User can visually verify that formulas render correctly (via MathText + KaTeX)
          before committing to the quota-gated solve. If it looks broken they can edit the source below. */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, color: 'var(--p-muted)', marginBottom: 4 }}>
          {/* PDF uploads have no photo above — don't tell the user to compare
              against one that isn't there. */}
          {t(previewUrl ? 'upload.ocrReview.previewLabel' : 'upload.ocrReview.previewLabelNoPhoto')}
        </div>
        <div
          className="math-big"
          style={{
            fontSize: 15,
            padding: '8px 10px',
            background: 'var(--p-bg)',
            border: '1px solid var(--p-border)',
            borderRadius: 8,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
            minHeight: 48,
          }}
        >
          <MathText text={editedText} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="btn outline"
          onClick={() => setSourceOpen((open) => !open)}
          style={{ width: '100%', minHeight: 40, fontSize: 13 }}
        >
          {sourceOpen ? t('upload.ocrReview.closeSource') : t('upload.ocrReview.openSource')}
        </button>
        {sourceOpen && (
          <label style={{ ...fieldLabel, marginTop: 10 }}>
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
        )}
      </div>

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
  result, previewUrl, onRetry, onClose, onPracticeNow,
}: {
  result: UploadAnalysisResult;
  previewUrl: string | null;
  onRetry: () => void;
  onClose: () => void;
  onPracticeNow?: () => void;
}) {
  const { t } = useT();
  const solve = result.result;
  const checked = solve.isStudentCorrect !== undefined && solve.isStudentCorrect !== null;
  const conceptText = [solve.detected?.chapter, solve.detected?.topic].filter(Boolean).join(' · ');
  const hints = (solve.hints ?? []).filter(Boolean);
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  // Late misread-catch net: keep the photo one tap away on the result too, so
  // "wait, the book says −600n" can be verified without re-photographing.
  const [photoOpen, setPhotoOpen] = useState(false);
  const verification = solve.verification;
  const confidencePct = verification
    ? Math.round(Math.max(0, Math.min(1, verification.confidence)) * 100)
    : null;

  // "This solution looks off" — reachable right here on the result, not only
  // from the Practice screen. Reporting retires the cached solution (server
  // invalidates it) so the next solve re-solves — a direct answer to the #1
  // trust complaint about solver apps ("the AI won't admit it's wrong").
  const problemId = solve.problemId;
  const qc = useQueryClient();
  const [reporting, setReporting] = useState(false);
  const onReport = async () => {
    if (!problemId || reporting) return;
    if (!window.confirm(t('upload.result.report.confirm'))) return;
    setReporting(true);
    try {
      await reportProblem(problemId);
      // The server just EXCLUDEd the problem — drop every cache that could
      // still serve it (or its retired solution) so the "won't be recommended
      // again" promise holds without an app reload.
      qc.invalidateQueries({ queryKey: ['problem', problemId] });
      qc.invalidateQueries({ queryKey: ['practice-problems'] });
      qc.invalidateQueries({ queryKey: ['ko-practice'] });
      qc.invalidateQueries({ queryKey: ['queue-next'] });
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      toast(t('upload.result.report.done'), 'success');
    } catch {
      toast(t('upload.result.report.failed'), 'error');
    } finally {
      setReporting(false);
    }
  };

  return (
    <div>
      {/* PROBLEM card -- matches the Mastery / Study problem card style */}
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('upload.result.problem.eyebrow')}</div>
        <div className="math-big" style={{ fontSize: 15, marginTop: 6, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          <MathText text={result.extractedText} />
        </div>
        {previewUrl && (
          <>
            <button
              type="button"
              aria-expanded={photoOpen}
              onClick={() => setPhotoOpen((open) => !open)}
              style={{
                marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--p-muted)', fontSize: 11.5, padding: '10px 0',
                textDecoration: 'underline', textUnderlineOffset: 2,
              }}
            >
              {photoOpen ? t('upload.result.photo.hide') : t('upload.result.photo.show')}
            </button>
            {photoOpen && (
              <ProblemPhotoView previewUrl={previewUrl} maxHeight={220} background="var(--p-surface)" />
            )}
          </>
        )}
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
            {/* Confidence is only meaningful for a PASSED verification — showing
                "97%" beside "검증 미완료" read as a contradiction and eroded trust. */}
            {verification.isVerified && confidencePct != null && (
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
          {/* Competitors paywall the step-by-step ("show steps" behind premium)
              — the #1 complaint in their reviews. Ours is free within the daily
              quota, so we say so. */}
          <button type="button" className="btn" style={{ width: '100%' }} onClick={() => setSolutionRevealed(true)}>
            {t('upload.result.reveal')}
            <span className="chip" style={{ marginLeft: 8, background: 'var(--p-success-tint)', color: 'var(--p-success)', fontSize: 10, fontWeight: 700 }}>
              {t('upload.result.reveal.free')}
            </span>
          </button>
        </div>
      ) : (
        <>
          {(solve.steps && solve.steps.length > 0) || solve.explanation ? (
            <div className="card" style={{ padding: 14, marginTop: 12, background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{t('upload.result.solution.eyebrow')}</div>
              {solve.steps && solve.steps.length > 0 ? (
                <SolutionStepsList
                  steps={solve.steps}
                  rationales={solve.stepRationales}
                />
              ) : null}
              {solve.explanation && solve.steps && solve.steps.length > 0 ? (
                <div style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: '1px solid var(--p-border)',
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: 'var(--p-muted)',
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

      {problemId && (
        <button
          type="button"
          onClick={onReport}
          disabled={reporting}
          style={{
            display: 'block', margin: '10px auto 0', background: 'none', border: 'none',
            color: 'var(--p-muted)', fontSize: 12, cursor: 'pointer', padding: '6px 8px',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}
        >
          {reporting ? t('upload.result.report.working') : t('upload.result.report.cta')}
        </button>
      )}
    </div>
  );
}

const fieldLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 11px', borderRadius: 8, border: '1px solid var(--p-border)', background: 'var(--p-surface)', color: 'var(--p-ink)', font: 'inherit', fontSize: 12.5 };

function ErrorPhase({ error, onRetry, onClose, onUpgrade }: {
  error: string;
  onRetry: () => void;
  onClose: () => void;
  onUpgrade?: () => void;
}) {
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
        {onUpgrade ? (
          <button
            onClick={onUpgrade}
            style={{
              background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >{t('upload.error.quotaCta')}</button>
        ) : (
          <button
            onClick={onRetry}
            style={{
              background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >{t('upload.error.retry')}</button>
        )}
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

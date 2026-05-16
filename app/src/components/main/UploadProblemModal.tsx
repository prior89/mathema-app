/* UploadProblemModal — student picks/takes a photo of a problem (or a PDF),
 * we POST to /uploads/problem-image; backend returns analysis + draftId.
 * Draft already persisted PENDING — "save" button is just a UX confirmation that
 * the student wants it kept in their wrong-notes pipeline (no extra POST needed).
 */
import { useEffect, useRef, useState } from 'react';
import { uploadProblemImage, UploadAnalysisResult } from '../../lib/queries';
import MathText from '../MathText';
import { Glyph } from '../onboarding/Glyph';

type Props = { open: boolean; onClose: () => void };

type Phase = 'pick' | 'analyzing' | 'result' | 'error';

export function UploadProblemModal({ open, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<UploadAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setPhase('pick');
      setFile(null);
      setResult(null);
      setError(null);
      setSaved(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const onPick = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const analyze = async () => {
    if (!file) return;
    setPhase('analyzing');
    setError(null);
    try {
      const r = await uploadProblemImage(file);
      setResult(r);
      setPhase('result');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ?? (e as Error)?.message ?? 'Upload failed';
      setError(msg);
      setPhase('error');
    }
  };

  const retry = () => {
    setPhase('pick');
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
            <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--p-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
              Wrong notes
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em' }}>
              Upload a problem
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-ink-2)', fontSize: 22, lineHeight: 1, padding: 4 }}
          >×</button>
        </div>

        {phase === 'pick' && (
          <PickPhase
            file={file}
            previewUrl={previewUrl}
            onPick={onPick}
            onAnalyze={analyze}
            fileInputRef={fileInputRef}
          />
        )}

        {phase === 'analyzing' && <AnalyzingPhase fileName={file?.name ?? ''} />}

        {phase === 'result' && result && (
          <ResultPhase
            result={result}
            saved={saved}
            onSave={() => setSaved(true)}
            onRetry={retry}
            onClose={onClose}
          />
        )}

        {phase === 'error' && (
          <ErrorPhase error={error ?? 'Unknown error'} onRetry={retry} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function PickPhase({
  file, previewUrl, onPick, onAnalyze, fileInputRef,
}: {
  file: File | null;
  previewUrl: string | null;
  onPick: (f: File | null) => void;
  onAnalyze: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--p-ink-2)', margin: '0 0 14px' }}>
        Take a photo of the problem you're stuck on, or upload an image / PDF. AI will recognize the text, concept, and formula — then save it to your wrong notes for review.
      </p>

      {/* Preview area */}
      <div
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
            Take a photo or pick a file below.
          </div>
        )}
      </div>

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
          Take photo
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            flex: 1, padding: '11px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'var(--p-surface)', color: 'var(--p-ink)', border: '1px solid var(--p-border)', cursor: 'pointer',
          }}
        >
          Choose file
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
          >Change</button>
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
          Analyze
        </button>
      </div>
    </div>
  );
}

function AnalyzingPhase({ fileName }: { fileName: string }) {
  return (
    <div style={{ padding: '34px 8px', textAlign: 'center' }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        border: '3px solid var(--p-border)', borderTopColor: 'var(--p-primary)',
        margin: '0 auto 14px', animation: 'mathema-spin 0.9s linear infinite',
      }} />
      <style>{`@keyframes mathema-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Analyzing the problem</div>
      <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4 }}>
        {fileName}
      </div>
      <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 10 }}>
        Reading text, identifying concept, solving step-by-step. Usually 5–15 s.
      </div>
    </div>
  );
}

function ResultPhase({
  result, saved, onSave, onRetry, onClose,
}: {
  result: UploadAnalysisResult;
  saved: boolean;
  onSave: () => void;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <Section label="Problem">
        <MathText text={result.extractedText} />
      </Section>

      <Section label="Concept">
        <MathText text={result.analysis.concept || '—'} />
      </Section>

      <Section label="Formula">
        <MathText text={result.analysis.formula || '—'} />
      </Section>

      <Section label="Solution steps">
        {result.analysis.solutionSteps.length === 0 ? (
          <span style={{ color: 'var(--p-muted)' }}>—</span>
        ) : (
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {result.analysis.solutionSteps.map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <MathText text={s} />
              </li>
            ))}
          </ol>
        )}
      </Section>

      <div style={{
        background: 'var(--p-primary-tint)', border: '1px solid var(--p-primary)',
        borderRadius: 10, padding: '10px 14px', marginTop: 12,
      }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: 'var(--p-primary)', textTransform: 'uppercase' }}>
          Answer
        </div>
        <div style={{ marginTop: 4, fontSize: 15 }}>
          <MathText text={result.analysis.answer || '—'} />
        </div>
      </div>

      {saved && (
        <div style={{ marginTop: 12, padding: 10, background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 8, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Glyph.Check accent="#2E7D32" size={14} />
          <span>Saved to wrong notes. A reviewer will publish it for practice after a quick check.</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
        <button
          onClick={onRetry}
          style={{
            background: 'transparent', border: '1px solid var(--p-border)', color: 'var(--p-ink-2)',
            padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
          }}
        >Try another</button>
        {!saved ? (
          <button
            onClick={onSave}
            style={{
              background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >Save to wrong notes</button>
        ) : (
          <button
            onClick={onClose}
            style={{
              background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >Done</button>
        )}
      </div>
    </div>
  );
}

function ErrorPhase({ error, onRetry, onClose }: { error: string; onRetry: () => void; onClose: () => void }) {
  return (
    <div>
      <div style={{
        background: '#FDECEA', border: '1px solid #F8D7D6', color: '#811E1A',
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
        >Close</button>
        <button
          onClick={onRetry}
          style={{
            background: 'var(--p-primary)', color: 'var(--p-primary-fg)', border: 'none',
            padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >Try again</button>
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

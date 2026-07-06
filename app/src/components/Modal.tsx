import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { useT } from '../lib/i18n';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  width?: number | string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, subtitle, width = 640, children }: Props) {
  const { t } = useT();
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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'var(--p-overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 24px)', fontFamily: 'var(--font-ui)',
        animation: 'fadeIn 0.18s ease-out',
      }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto',
          backgroundColor: 'var(--p-surface)', border: '1px solid var(--p-border)',
          borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 5vw, 28px)', position: 'relative',
          color: 'var(--p-ink)',
          boxShadow: 'var(--p-shadow-lg)',
        }}
      >
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--p-ink-2)', padding: 0,
          }}
        >
          <X size={18} />
        </button>
        {(title || subtitle) && (
          <div style={{ marginBottom: 20 }}>
            {subtitle && (
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--p-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                {subtitle}
              </div>
            )}
            {title && (
              <h2 style={{
                fontSize: 'clamp(19px, 5vw, 23px)', fontWeight: 600, letterSpacing: '-0.02em', margin: 0,
                fontFamily: 'var(--font-display)', color: 'var(--p-ink)',
              }}>
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';
type ToastEvent = { id: number; kind: ToastKind; text: string };

let nextId = 1;
const EVENT = 'mathema-toast';

export function toast(text: string, kind: ToastKind = 'info') {
  window.dispatchEvent(new CustomEvent<ToastEvent>(EVENT, {
    detail: { id: nextId++, kind, text },
  }));
}

const ICON_COLOR: Record<ToastKind, string> = {
  success: 'var(--p-success)',
  error: 'var(--p-danger)',
  info: 'var(--p-primary)',
};

export function ToastHost() {
  const [items, setItems] = useState<ToastEvent[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastEvent>).detail;
      setItems((prev) => [...prev, detail]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== detail.id));
      }, 3500);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return (
    <div className="mathema-toast-host">
      {items.map((it) => {
        const Icon =
          it.kind === 'success' ? CheckCircle2 :
          it.kind === 'error' ? AlertCircle : Info;
        return (
          <div key={it.id} className={`mathema-toast ${it.kind}`}>
            <Icon size={16} color={ICON_COLOR[it.kind]} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{it.text}</span>
          </div>
        );
      })}
    </div>
  );
}
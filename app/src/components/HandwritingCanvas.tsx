/* HandwritingCanvas — pen/stylus/finger/mouse "workings" pad.
 *
 * This is a scratch surface: students draw their solution steps here while
 * they're thinking. Nothing is persisted — the canvas exists purely as a
 * thinking aid, mirroring how a student would scribble on paper before
 * writing the final answer in the text box below.
 *
 * Strokes are kept in a ref + redrawn from React state on undo/clear so the
 * common case (lots of points during a single stroke) never triggers a
 * re-render — only stroke commit does.
 */
import {
  forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from 'react';

type Point = { x: number; y: number };
type Stroke = Point[];

export type HandwritingCanvasHandle = {
  clear: () => void;
  undo: () => void;
};

type Props = {
  height?: number;
  /** Hex / CSS colour of the ink. Defaults to the sage ink token. */
  inkColor?: string;
};

export const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, Props>(
  function HandwritingCanvas({ height = 280, inkColor = '#1f1a14' }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Completed strokes drive the redraw effect; live in-progress points are
    // tracked via refs to avoid re-rendering on every pointer-move event.
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const drawingRef = useRef(false);
    const lastPointRef = useRef<Point | null>(null);
    const currentStrokeRef = useRef<Stroke>([]);
    const [dpr, setDpr] = useState(() => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1));

    useImperativeHandle(ref, () => ({
      clear: () => setStrokes([]),
      undo: () => setStrokes((prev) => prev.slice(0, -1)),
    }), []);

    // Size the canvas to its container × devicePixelRatio for crisp strokes
    // on high-DPI screens. Re-runs on viewport resize.
    useEffect(() => {
      const fit = () => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const w = wrapper.clientWidth;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(w * ratio));
        canvas.height = Math.max(1, Math.floor(height * ratio));
        canvas.style.width = `${w}px`;
        canvas.style.height = `${height}px`;
        setDpr(ratio);
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, [height]);

    // Redraw all completed strokes whenever the strokes array changes
    // (initial mount, undo, clear, or fresh stroke commit).
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = inkColor;
      for (const stroke of strokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    }, [strokes, dpr, inkColor]);

    function point(e: React.PointerEvent<HTMLCanvasElement>): Point {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function start(e: React.PointerEvent<HTMLCanvasElement>) {
      const p = point(e);
      drawingRef.current = true;
      lastPointRef.current = p;
      currentStrokeRef.current = [p];
      canvasRef.current?.setPointerCapture(e.pointerId);
    }

    function move(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawingRef.current) return;
      const p = point(e);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && lastPointRef.current) {
        // Draw the segment directly to the canvas — avoids re-rendering React
        // for every pointer-move event (would tank performance with stylus).
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = inkColor;
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      lastPointRef.current = p;
      currentStrokeRef.current.push(p);
    }

    function end(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      if (currentStrokeRef.current.length > 1) {
        const committed = currentStrokeRef.current;
        setStrokes((prev) => [...prev, committed]);
      }
      currentStrokeRef.current = [];
      lastPointRef.current = null;
      canvasRef.current?.releasePointerCapture(e.pointerId);
    }

    return (
      <div ref={wrapperRef} style={{ width: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height,
            background: 'var(--p-surface)',
            border: '1.5px dashed var(--p-border-strong)',
            borderRadius: 12,
            // Disable native pinch-zoom / scroll so pen strokes stay on the
            // canvas instead of scrolling the page (critical for touch UX).
            touchAction: 'none',
            cursor: 'crosshair',
          }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      </div>
    );
  },
);

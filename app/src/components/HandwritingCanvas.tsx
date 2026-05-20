/* HandwritingCanvas — pen/stylus/finger/mouse "workings" pad.
 *
 * This is a scratch surface: students draw their solution steps here while
 * they're thinking. Nothing is persisted — the canvas exists purely as a
 * thinking aid, mirroring how a student would scribble on paper before
 * writing the final answer in the text box below.
 *
 * Modes:
 *   • Fixed (default): a single fixed-height canvas. height + maxHeight equal.
 *   • Extendable (`extendable={true}`): the canvas grows downward as the user
 *     nears the bottom edge. The viewport (maxHeight) stays the same and
 *     scrolls vertically — so swiping up reveals fresh blank space without
 *     ever losing earlier strokes.
 *
 * Strokes are kept in a ref + redrawn from React state on undo/clear so the
 * common case (lots of points during a single stroke) never triggers a
 * re-render — only stroke commit does.
 */
import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';

type Point = { x: number; y: number };
type Stroke = Point[];

export type HandwritingCanvasHandle = {
  clear: () => void;
  undo: () => void;
};

type Props = {
  /** Visible viewport height in px. The user always sees this much. */
  height?: number;
  /** Hex / CSS colour of the ink. Defaults to the sage ink token. */
  inkColor?: string;
  /**
   * Grow the canvas downward as the user nears the bottom — implements the
   * "swipe to keep writing" UX. The inner canvas starts at `height * 2`
   * and adds 400px each time a stroke ends within 80px of the bottom.
   * The wrapper auto-scrolls to follow so the new blank area is visible
   * immediately, and the user can swipe down anytime to revisit earlier
   * strokes.
   */
  extendable?: boolean;
};

// Drawing area added each time a stroke reaches the bottom edge.
const EXTEND_STEP = 400;
// Within this many px of the bottom counts as "reached the end".
const EXTEND_TRIGGER_PADDING = 80;

export const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, Props>(
  function HandwritingCanvas({ height = 280, inkColor = '#1f1a14', extendable = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Inner canvas height — grows on demand when extendable=true.
    const [innerHeight, setInnerHeight] = useState<number>(extendable ? height * 2 : height);

    // Completed strokes drive the redraw effect; live in-progress points are
    // tracked via refs to avoid re-rendering on every pointer-move event.
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const drawingRef = useRef(false);
    const lastPointRef = useRef<Point | null>(null);
    const currentStrokeRef = useRef<Stroke>([]);
    const [dpr, setDpr] = useState(() => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1));

    useImperativeHandle(ref, () => ({
      clear: () => {
        setStrokes([]);
        setInnerHeight(extendable ? height * 2 : height);
        // Reset scroll back to the top so the cleared pad reads fresh.
        if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
      },
      undo: () => setStrokes((prev) => prev.slice(0, -1)),
    }), [extendable, height]);

    // Size the canvas to its container × devicePixelRatio for crisp strokes
    // on high-DPI screens. Re-runs on viewport resize and when innerHeight
    // grows.
    useEffect(() => {
      const fit = () => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const w = wrapper.clientWidth;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(w * ratio));
        canvas.height = Math.max(1, Math.floor(innerHeight * ratio));
        canvas.style.width = `${w}px`;
        canvas.style.height = `${innerHeight}px`;
        setDpr(ratio);
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, [innerHeight]);

    // Redraw all completed strokes whenever the strokes array changes
    // (initial mount, undo, clear, fresh stroke commit, or canvas grow).
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
    }, [strokes, dpr, inkColor, innerHeight]);

    // When the canvas grows, auto-scroll the wrapper so the freshly added
    // blank area is immediately visible without forcing the user to swipe.
    const prevInnerHeightRef = useRef<number>(innerHeight);
    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (innerHeight > prevInnerHeightRef.current) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
      prevInnerHeightRef.current = innerHeight;
    }, [innerHeight]);

    const point = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Point => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

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
        // Extend the canvas when the user reaches near the current bottom.
        if (extendable) {
          let maxY = 0;
          for (const pt of committed) if (pt.y > maxY) maxY = pt.y;
          if (maxY > innerHeight - EXTEND_TRIGGER_PADDING) {
            setInnerHeight((h) => h + EXTEND_STEP);
          }
        }
      }
      currentStrokeRef.current = [];
      lastPointRef.current = null;
      canvasRef.current?.releasePointerCapture(e.pointerId);
    }

    return (
      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          // The wrapper is the user-facing viewport. When the inner canvas
          // grows beyond `height`, the wrapper scrolls and the student can
          // swipe up/down to reach earlier or newer strokes.
          maxHeight: height,
          overflowY: extendable ? 'auto' : 'hidden',
          // Allow vertical pan in the gutter (scrollbar / margins). The
          // canvas itself sets touchAction:none below so pen strokes win
          // inside the drawing area.
          touchAction: extendable ? 'pan-y' : 'none',
          borderRadius: 12,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: innerHeight,
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

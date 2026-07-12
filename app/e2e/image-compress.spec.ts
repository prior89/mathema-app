import { test, expect } from '@playwright/test';

/**
 * Real-browser test of compressImageForUpload. jsdom can't encode canvas, so the
 * unit test only covers passthrough/fallback; here we run the ACTUAL function in
 * Chromium (imported live from the Vite dev server) against a real large photo.
 */
test.describe('compressImageForUpload (real Chromium)', () => {
  test('downscales an over-MAX_EDGE photo to the cap and shrinks bytes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const r = await page.evaluate(async () => {
      const { compressImageForUpload, MAX_EDGE } = await import('/src/lib/image-compress.ts');

      // Build a busy 3000×2000 JPEG so it isn't trivially tiny.
      const canvas = document.createElement('canvas');
      canvas.width = 3000;
      canvas.height = 2000;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 3000, 2000);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#101010');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 3000, 2000);
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `hsl(${(i * 11) % 360}, 70%, 50%)`;
        ctx.fillRect((i * 137) % 3000, (i * 89) % 2000, 90, 90);
      }
      const srcBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95),
      );
      const srcFile = new File([srcBlob], 'photo.jpg', { type: 'image/jpeg' });

      const out = await compressImageForUpload(srcFile);
      const bmp = await createImageBitmap(out);
      return {
        MAX_EDGE,
        inSize: srcFile.size,
        outSize: out.size,
        outW: bmp.width,
        outH: bmp.height,
        outType: out.type,
        changed: out !== srcFile,
      };
    });

    expect(r.changed).toBe(true);
    expect(Math.max(r.outW, r.outH)).toBeLessThanOrEqual(r.MAX_EDGE);
    expect(r.outW).toBe(r.MAX_EDGE); // 3000 is the longest edge
    expect(r.outH).toBe(Math.round(2000 * (r.MAX_EDGE / 3000)));
    expect(r.outType).toBe('image/jpeg');
    expect(r.outSize).toBeLessThan(r.inSize); // genuinely smaller payload
  });

  test('leaves a small-pixels small-bytes image untouched', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const sameRef = await page.evaluate(async () => {
      const { compressImageForUpload } = await import('/src/lib/image-compress.ts');
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#aabbcc';
      ctx.fillRect(0, 0, 800, 600);
      const blob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), 'image/jpeg', 0.9),
      );
      const f = new File([blob], 'small.jpg', { type: 'image/jpeg' });
      const out = await compressImageForUpload(f);
      return out === f;
    });

    expect(sameRef).toBe(true);
  });

  // The band the MAX_EDGE bump legalized (1601–2200px) must stay untouched only
  // when the BYTES are small too — a lossless PNG screenshot in that band used
  // to be re-encoded to a small JPEG and must not silently ship raw multi-MB.
  test('mid-band (≤MAX_EDGE) small JPEG passes through; huge PNG is re-encoded', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const r = await page.evaluate(async () => {
      const { compressImageForUpload, MAX_EDGE, BYTE_CEILING } =
        await import('/src/lib/image-compress.ts');

      const draw = (w: number, h: number, noisy: boolean) => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        if (noisy) {
          // Per-pixel RANDOM noise defeats PNG compression → multi-MB file.
          // (A deterministic i-based formula degenerates under float precision
          // loss and compresses to ~45KB — not a realistic huge screenshot.)
          const img = ctx.createImageData(w, h);
          for (let i = 0; i < img.data.length; i += 4) {
            img.data[i] = (Math.random() * 256) | 0;
            img.data[i + 1] = (Math.random() * 256) | 0;
            img.data[i + 2] = (Math.random() * 256) | 0;
            img.data[i + 3] = 255;
          }
          ctx.putImageData(img, 0, 0);
        } else {
          ctx.fillStyle = '#dde5ee';
          ctx.fillRect(0, 0, w, h);
        }
        return canvas;
      };
      const toFile = (canvas: HTMLCanvasElement, type: string, name: string) =>
        new Promise<File>((res) =>
          canvas.toBlob((b) => res(new File([b!], name, { type })), type, 0.9),
        );

      // (a) 2000px flat JPEG — inside the band, tiny bytes → must pass through.
      const midJpeg = await toFile(draw(2000, 1400, false), 'image/jpeg', 'mid.jpg');
      const midOut = await compressImageForUpload(midJpeg);

      // (b) 1920×1080 noisy PNG — inside the band but huge → must re-encode.
      const bigPng = await toFile(draw(1920, 1080, true), 'image/png', 'shot.png');
      const bigOut = await compressImageForUpload(bigPng);
      const bigBmp = await createImageBitmap(bigOut);

      return {
        MAX_EDGE,
        BYTE_CEILING,
        midUntouched: midOut === midJpeg,
        midSize: midJpeg.size,
        bigInSize: bigPng.size,
        bigChanged: bigOut !== bigPng,
        bigOutSize: bigOut.size,
        bigOutType: bigOut.type,
        bigOutW: bigBmp.width,
        bigOutH: bigBmp.height,
      };
    });

    expect(r.midSize).toBeLessThanOrEqual(r.BYTE_CEILING); // fixture sanity
    expect(r.midUntouched).toBe(true);

    expect(r.bigInSize).toBeGreaterThan(r.BYTE_CEILING); // fixture sanity
    expect(r.bigChanged).toBe(true);
    expect(r.bigOutType).toBe('image/jpeg');
    expect(r.bigOutW).toBe(1920); // dimensions already fit — only bytes shrink
    expect(r.bigOutH).toBe(1080);
    expect(r.bigOutSize).toBeLessThan(r.bigInSize);
  });
});

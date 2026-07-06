import { test, expect } from '@playwright/test';

/**
 * Real-browser test of compressImageForUpload. jsdom can't encode canvas, so the
 * unit test only covers passthrough/fallback; here we run the ACTUAL function in
 * Chromium (imported live from the Vite dev server) against a real large photo.
 */
test.describe('compressImageForUpload (real Chromium)', () => {
  test('downscales a 3000×2000 photo to 1600px longest edge and shrinks bytes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const r = await page.evaluate(async () => {
      const { compressImageForUpload } = await import('/src/lib/image-compress.ts');

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
        inSize: srcFile.size,
        outSize: out.size,
        outW: bmp.width,
        outH: bmp.height,
        outType: out.type,
        changed: out !== srcFile,
      };
    });

    expect(r.changed).toBe(true);
    expect(Math.max(r.outW, r.outH)).toBeLessThanOrEqual(1600);
    expect(r.outW).toBe(1600); // 3000 longest → 1600
    expect(r.outH).toBe(1067); // 2000 × (1600/3000) rounded
    expect(r.outType).toBe('image/jpeg');
    expect(r.outSize).toBeLessThan(r.inSize); // genuinely smaller payload
  });

  test('leaves an already-small (≤1600px) image untouched', async ({ page }) => {
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
});

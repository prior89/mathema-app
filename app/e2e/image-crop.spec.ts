import { test, expect } from '@playwright/test';

/**
 * Real-browser test of cropImageFile — jsdom can't decode/encode canvas, so the
 * actual function runs in Chromium, imported live from the Vite dev server, and
 * we verify the crop geometry by sampling pixel colors of the output.
 */
test.describe('cropImageFile (real Chromium)', () => {
  test('crops the selected normalized region (pixel-verified)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const r = await page.evaluate(async () => {
      const { cropImageFile } = await import('/src/lib/image-crop.ts');

      // 2000×1000: left half solid red, right half solid blue.
      const canvas = document.createElement('canvas');
      canvas.width = 2000;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 1000, 1000);
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(1000, 0, 1000, 1000);
      const srcFile = await new Promise<File>((res) =>
        canvas.toBlob((b) => res(new File([b!], 'halves.png', { type: 'image/png' })), 'image/png'),
      );

      // Select the right half.
      const out = await cropImageFile(srcFile, { x: 0.5, y: 0, w: 0.5, h: 1 });
      const bmp = await createImageBitmap(out);
      const probe = document.createElement('canvas');
      probe.width = bmp.width;
      probe.height = bmp.height;
      const pctx = probe.getContext('2d')!;
      pctx.drawImage(bmp, 0, 0);
      const center = pctx.getImageData(Math.floor(bmp.width / 2), Math.floor(bmp.height / 2), 1, 1).data;

      return {
        changed: out !== srcFile,
        outW: bmp.width,
        outH: bmp.height,
        outType: out.type,
        centerRgb: [center[0], center[1], center[2]],
      };
    });

    expect(r.changed).toBe(true);
    expect(r.outW).toBe(1000);
    expect(r.outH).toBe(1000);
    expect(r.outType).toBe('image/jpeg');
    // Center of the right-half crop must be blue (JPEG tolerance).
    expect(r.centerRgb[2]).toBeGreaterThan(200);
    expect(r.centerRgb[0]).toBeLessThan(60);
  });

  test('near-full selection and non-images pass through untouched', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const r = await page.evaluate(async () => {
      const { cropImageFile, FULL_CROP } = await import('/src/lib/image-crop.ts');

      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      canvas.getContext('2d')!.fillRect(0, 0, 600, 400);
      const img = await new Promise<File>((res) =>
        canvas.toBlob((b) => res(new File([b!], 'x.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.9),
      );
      const pdf = new File([new Uint8Array([37, 80, 68, 70])], 'doc.pdf', { type: 'application/pdf' });

      const fullOut = await cropImageFile(img, FULL_CROP);
      // 1% handle drift on each edge still counts as "no crop".
      const driftOut = await cropImageFile(img, { x: 0.01, y: 0.01, w: 0.98, h: 0.98 });
      const pdfOut = await cropImageFile(pdf, { x: 0.5, y: 0, w: 0.5, h: 1 });

      return {
        fullUntouched: fullOut === img,
        driftUntouched: driftOut === img,
        pdfUntouched: pdfOut === pdf,
      };
    });

    expect(r.fullUntouched).toBe(true);
    expect(r.driftUntouched).toBe(true);
    expect(r.pdfUntouched).toBe(true);
  });
});

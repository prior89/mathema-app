import { describe, expect, it } from 'vitest';
import { compressImageForUpload } from './image-compress';

describe('compressImageForUpload', () => {
  it('passes non-image files (e.g. PDF) through untouched', async () => {
    const pdf = new File([new Uint8Array([1, 2, 3])], 'problem.pdf', {
      type: 'application/pdf',
    });
    const out = await compressImageForUpload(pdf);
    expect(out).toBe(pdf); // same reference — no re-encode attempted
  });

  it('falls back to the original when the image cannot be decoded', async () => {
    // jsdom has no real createImageBitmap/canvas encoder, so a raster file hits
    // the catch path and must return the original rather than throwing.
    const fake = new File([new Uint8Array([0, 1, 2, 3])], 'photo.jpg', {
      type: 'image/jpeg',
    });
    const out = await compressImageForUpload(fake);
    expect(out).toBe(fake);
  });
});

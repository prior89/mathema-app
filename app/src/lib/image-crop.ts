/**
 * Crop a picked photo to the user-selected problem region before OCR.
 *
 * The single biggest OCR-misread driver is a full-page textbook shot where the
 * problem occupies a fraction of the frame (real incident: "-600n" read as
 * "-6000"). Cropping to the problem is the industry-standard fix (Photomath,
 * Qanda both crop before recognition): the problem then uses the FULL pixel
 * budget instead of 1/3 of it, independent of any compression cap.
 *
 * Crop happens at natural resolution with high JPEG quality — the compression
 * pass (image-compress.ts) runs after and owns the final size/quality tradeoff.
 * Image-only, and any decode/encode failure falls back to the original file so
 * it can never block a solve.
 */

/** Normalized selection over the displayed image, all values in [0, 1]. */
export type CropRect = { x: number; y: number; w: number; h: number };

export const FULL_CROP: CropRect = { x: 0, y: 0, w: 1, h: 1 };

/** Smallest allowed selection edge (normalized) — keeps handles grabbable and
 *  the crop meaningful. Shared by the overlay drag math and sanity checks. */
export const MIN_CROP_EDGE = 0.12;

const CROP_JPEG_QUALITY = 0.92;
// Treat near-full selections as "no crop": a few px of accidental handle drift
// must not cost a lossy re-encode of the whole photo.
const FULL_TOLERANCE = 0.02;

export function isEffectivelyFullCrop(rect: CropRect): boolean {
  return (
    rect.x <= FULL_TOLERANCE
    && rect.y <= FULL_TOLERANCE
    && rect.x + rect.w >= 1 - FULL_TOLERANCE
    && rect.y + rect.h >= 1 - FULL_TOLERANCE
  );
}

export async function cropImageFile(file: File, rect: CropRect): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (isEffectivelyFullCrop(rect)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const sx = Math.round(Math.max(0, Math.min(1, rect.x)) * bitmap.width);
    const sy = Math.round(Math.max(0, Math.min(1, rect.y)) * bitmap.height);
    const sw = Math.round(Math.min(1 - rect.x, rect.w) * bitmap.width);
    const sh = Math.round(Math.min(1 - rect.y, rect.h) * bitmap.height);
    // A degenerate selection can't carry a math problem — send the original.
    if (sw < 32 || sh < 32) {
      bitmap.close?.();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', CROP_JPEG_QUALITY),
    );
    if (!blob) return file;

    const name = `${file.name.replace(/\.[^.]+$/, '')}-crop.jpg`;
    return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    return file;
  }
}

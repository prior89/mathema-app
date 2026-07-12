/**
 * Downscale a captured photo before it is sent to OCR.
 *
 * A raw phone photo is 3–8 MB; it is uploaded, base64'd server-side (+37%), and
 * shipped to Mathpix and the OpenAI vision model. The win is upload time and
 * request payload — NOT vision token cost: at detail:'high' OpenAI normalizes
 * the short side to 768px before tiling, so tile count is aspect-ratio-bound
 * and identical for any input this size. Downscale-only, image-only, and it
 * falls back to the original on any decode/encode failure so it can never block
 * or degrade a solve.
 */
// 2200px (was 1600): a full-page textbook shot puts the problem in ~1/3 of the
// frame, and at 1600px the ∑-limit sub/superscripts land around 8px — a real
// misread incident dropped "-600n"→"-6000" on such a photo. 2200px keeps dense
// scripts legible while still cutting a 4000px phone photo to ~1/3 the pixels.
export const MAX_EDGE = 2200;
// 0.82: the misread incident above was a RESOLUTION problem; raising quality
// does not sharpen 8px glyphs, it only multiplies the payload the module
// exists to shrink.
export const JPEG_QUALITY = 0.82;
// Dimensionally-small files can still be huge (a 1920×1080 lossless PNG
// screenshot is 4–6 MB and Mathpix rejects oversized data-URLs). Re-encode
// anything above this many bytes even when it already fits MAX_EDGE.
export const BYTE_CEILING = 1_500_000;

export async function compressImageForUpload(file: File): Promise<File> {
  // Only touch raster photos — leave PDFs and anything else exactly as-is.
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    if (longest <= MAX_EDGE && file.size <= BYTE_CEILING) {
      bitmap.close?.();
      return file; // small in pixels AND bytes — don't re-encode
    }
    const scale = Math.min(1, MAX_EDGE / longest); // never upscale
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    // Never upsize: if re-encoding didn't shrink it, keep the original.
    if (!blob || blob.size >= file.size) return file;

    const name = `${file.name.replace(/\.[^.]+$/, '')}.jpg`;
    return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    // HEIC the canvas can't decode, OOM on a huge image, etc. → send the original.
    return file;
  }
}

/**
 * Downscale a captured photo before it is sent to OCR.
 *
 * A raw phone photo is 3–8 MB; it is uploaded, base64'd server-side, and sent to
 * both Mathpix and the OpenAI vision model at detail:'high'. Resizing to ~2200px
 * on the longest edge cuts mobile upload time AND the vision tile count with no
 * OCR accuracy loss for a single math problem. Downscale-only, image-only, and it
 * falls back to the original on any decode/encode failure so it can never block or
 * degrade a solve.
 */
// 2200px (was 1600): a full-page textbook shot puts the problem in ~1/3 of the
// frame, and at 1600px the ∑-limit sub/superscripts land around 8px — a real
// misread incident dropped "-600n"→"-6000" on such a photo. 2200px keeps dense
// scripts legible while still cutting a 4000px phone photo to ~1/3 the pixels.
const MAX_EDGE = 2200;
const JPEG_QUALITY = 0.85;

export async function compressImageForUpload(file: File): Promise<File> {
  // Only touch raster photos — leave PDFs and anything else exactly as-is.
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    if (longest <= MAX_EDGE) {
      bitmap.close?.();
      return file; // already small enough — don't re-encode
    }
    const scale = MAX_EDGE / longest;
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

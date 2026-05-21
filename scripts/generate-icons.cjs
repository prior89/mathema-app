#!/usr/bin/env node
/**
 * Generate Android launcher icons + adaptive-icon foreground at every density
 * from a single 512x512 source PNG.
 *
 * Usage: node scripts/generate-icons.cjs <source.png>
 * Default source: store-assets/matheo-icon-512.png (copied here from Downloads).
 */
const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs');

const SOURCE = process.argv[2] || path.resolve(__dirname, '..', 'store-assets', 'matheo-icon-512.png');
const RES_ROOT = path.resolve(__dirname, '..', 'app', 'android', 'app', 'src', 'main', 'res');

const DENSITIES = {
  'mipmap-mdpi':    { launcher: 48,  foreground: 108 },
  'mipmap-hdpi':    { launcher: 72,  foreground: 162 },
  'mipmap-xhdpi':   { launcher: 96,  foreground: 216 },
  'mipmap-xxhdpi':  { launcher: 144, foreground: 324 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432 },
};

async function ensureDir(d) {
  await fs.promises.mkdir(d, { recursive: true });
}

async function writeResized(srcBuf, out, size) {
  await sharp(srcBuf).resize(size, size, { kernel: 'lanczos3' }).png().toFile(out);
  console.log(`  ${path.basename(path.dirname(out))}/${path.basename(out)}  ${size}x${size}`);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }
  const srcBuf = await fs.promises.readFile(SOURCE);
  for (const [dir, sizes] of Object.entries(DENSITIES)) {
    const target = path.join(RES_ROOT, dir);
    await ensureDir(target);
    await writeResized(srcBuf, path.join(target, 'ic_launcher.png'), sizes.launcher);
    await writeResized(srcBuf, path.join(target, 'ic_launcher_round.png'), sizes.launcher);
    await writeResized(srcBuf, path.join(target, 'ic_launcher_foreground.png'), sizes.foreground);
  }
  // Play Store listing icon -- always 512x512.
  const storeOut = path.resolve(__dirname, '..', 'store-assets', 'matheo-icon-512.png');
  if (path.resolve(SOURCE) !== storeOut) {
    await ensureDir(path.dirname(storeOut));
    await writeResized(srcBuf, storeOut, 512);
  }
  console.log('done.');
}
main().catch((e) => { console.error(e); process.exit(1); });

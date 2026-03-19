#!/usr/bin/env node
/**
 * Pre-build image optimizer.
 * Converts every JPG/JPEG/PNG in public/galleries/ to WebP (quality 92, max 2400px).
 * Skips files whose .webp counterpart is already newer than the source.
 * If the generated WebP is larger than the source, it is deleted (browser falls back to original).
 */

import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GALLERIES_DIR = join(__dirname, "..", "public", "galleries");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 92;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function isNewer(src, dest) {
  try {
    const [s, d] = await Promise.all([stat(src), stat(dest)]);
    return d.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

function fmtKB(bytes) {
  return (bytes / 1024).toFixed(0) + " KB";
}

let processed = 0;
let skipped = 0;
let noGain = 0;

for await (const file of walk(GALLERIES_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!EXTENSIONS.has(ext)) continue;
const webpPath = join(dirname(file), basename(file, ext) + ".webp");

  if (await isNewer(file, webpPath)) {
    skipped++;
    continue;
  }

  const srcStat = await stat(file);
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath);

  const destStat = await stat(webpPath);

  if (destStat.size >= srcStat.size) {
    // WebP is not smaller — delete it so the browser uses the original
    await unlink(webpPath);
    console.log(`  – ${basename(file)}: WebP not smaller, keeping original`);
    noGain++;
    continue;
  }

  const ratio = ((1 - destStat.size / srcStat.size) * 100).toFixed(0);
  console.log(
    `  ✓ ${basename(file)} → ${basename(webpPath)}  ${fmtKB(srcStat.size)} → ${fmtKB(destStat.size)} (−${ratio}%)`
  );
  processed++;
}

console.log(
  `\nImages: ${processed} optimized, ${skipped} already up to date, ${noGain} kept original.\n`
);

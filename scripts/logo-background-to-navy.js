/**
 * Sostituisce lo sfondo nero del logo PNG con il blu navy del sito (#1A2B45).
 * Uso: node scripts/logo-background-to-navy.js
 */
const sharp = require("sharp");
const path = require("path");

const NAVY = { r: 26, g: 43, b: 69 }; // #1A2B45
const BLACK_THRESHOLD = 40; // pixel con r,g,b sotto questa soglia = nero da sostituire

const logoPath = path.join(__dirname, "..", "public", "logo-agenda-legale.png");

async function main() {
  const image = sharp(logoPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;
    if (a < 10) continue;
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i] = NAVY.r;
      data[i + 1] = NAVY.g;
      data[i + 2] = NAVY.b;
    }
  }

  const fs = require("fs");
  const outPath = path.join(__dirname, "..", "public", "logo-agenda-legale-navy.png");
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outPath);
  fs.unlinkSync(logoPath);
  fs.renameSync(outPath, logoPath);
  console.log("Logo aggiornato: sfondo nero sostituito con navy.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

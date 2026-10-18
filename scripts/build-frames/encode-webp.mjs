// Encode extracted PNG frames to WebP and write public/build/manifest.json.
//
//   node scripts/build-frames/encode-webp.mjs --src tmp/build-frames --out public/build --source video
//
// Expects <src>/desktop/*.png and <src>/mobile/*.png in playback order.
// The manifest is built from the files written, not from targets.

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { printSummary } from "./summary.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith("--")) pairs.push([arg.slice(2), all[i + 1]]);
    return pairs;
  }, []),
);

const src = args.src;
const out = args.out ?? "public/build";
const source = args.source ?? "video";

// Mobile frames must stay under this budget (frames:check fails at 4 MB).
const MOBILE_BUDGET_BYTES = 3.8 * 1024 * 1024;
const MIN_MOBILE_QUALITY = 50;

const sets = {
  desktop: { quality: 70 },
  mobile: { quality: 65, budget: MOBILE_BUDGET_BYTES },
};

function pngsIn(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => join(dir, f));
}

async function encodeSet(name, { quality, budget }) {
  const frames = pngsIn(join(src, name));
  if (frames.length === 0) throw new Error(`No PNG frames in ${join(src, name)}`);

  const dir = join(out, name);
  let q = quality;

  for (;;) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });

    let bytes = 0;
    for (const [i, frame] of frames.entries()) {
      const file = join(dir, `frame_${String(i + 1).padStart(4, "0")}.webp`);
      const info = await sharp(frame).webp({ quality: q, effort: 6, smartSubsample: true }).toFile(file);
      bytes += info.size;
    }

    if (!budget || bytes <= budget || q <= MIN_MOBILE_QUALITY) {
      if (budget && bytes > budget) console.warn(`! ${name} frames still over budget at q${q}`);
      console.log(`→ ${name}: ${frames.length} frames at WebP q${q}`);
      return { frames, quality: q };
    }
    console.log(`→ ${name}: ${(bytes / 1024 / 1024).toFixed(2)} MB at q${q} is over budget, retrying at q${q - 5}`);
    q -= 5;
  }
}

async function main() {
  if (!src) throw new Error("--src is required");
  mkdirSync(out, { recursive: true });

  const desktop = await encodeSet("desktop", sets.desktop);
  await encodeSet("mobile", sets.mobile);

  await sharp(desktop.frames[0]).webp({ quality: 72, effort: 6 }).toFile(join(out, "poster.webp"));
  await sharp(desktop.frames.at(-1)).webp({ quality: 80, effort: 6 }).toFile(join(out, "final.webp"));

  const describe = async (name) => {
    const dir = join(out, name);
    const files = readdirSync(dir).filter((f) => /^frame_\d{4}\.webp$/.test(f)).sort();
    const { width, height } = await sharp(join(dir, files[0])).metadata();
    return { count: files.length, width, height };
  };

  const mp4 = join(out, "build-mobile.mp4");
  const manifest = {
    source,
    desktop: await describe("desktop"),
    mobile: await describe("mobile"),
    poster: "/build/poster.webp",
    final: "/build/final.webp",
    video: existsSync(mp4) ? "/build/build-mobile.mp4" : null,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`→ manifest.json written (${statSync(join(out, "manifest.json")).size} B)`);

  printSummary(out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

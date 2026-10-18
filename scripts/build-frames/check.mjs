// npm run frames:check
// Prints frame counts and sizes per folder, checks the manifest matches the
// files on disk, and fails if the mobile set is over 4 MB.

import { existsSync, readFileSync } from "node:fs";
import { MOBILE_LIMIT_BYTES, MP4_LIMIT_BYTES, printSummary } from "./summary.mjs";

const out = "public/build";
const { desktop, mobile, mp4 } = printSummary(out);
const errors = [];

if (!existsSync(`${out}/manifest.json`)) {
  errors.push("manifest.json is missing. Run npm run frames:video.");
} else {
  const manifest = JSON.parse(readFileSync(`${out}/manifest.json`, "utf8"));
  if (manifest.desktop?.count !== desktop.count) errors.push(`manifest desktop.count ${manifest.desktop?.count} ≠ ${desktop.count} files`);
  if (manifest.mobile?.count !== mobile.count) errors.push(`manifest mobile.count ${manifest.mobile?.count} ≠ ${mobile.count} files`);
  console.log(`\nmanifest: source=${manifest.source}, desktop ${manifest.desktop?.width}x${manifest.desktop?.height}, mobile ${manifest.mobile?.width}x${manifest.mobile?.height}`);
}

if (mobile.bytes > MOBILE_LIMIT_BYTES) errors.push(`mobile frames are ${(mobile.bytes / 1024 / 1024).toFixed(2)} MB (limit 4 MB)`);
if (mp4 !== null && mp4 > MP4_LIMIT_BYTES) console.warn(`warning: build-mobile.mp4 is ${(mp4 / 1024 / 1024).toFixed(2)} MB (target < 2 MB)`);

if (errors.length) {
  console.error(`\n✗ frames:check failed\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log("\n✓ frames:check passed");

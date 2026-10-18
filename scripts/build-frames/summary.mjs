// Size summary for public/build, shared by encode-webp.mjs and check.mjs.

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const MOBILE_LIMIT_BYTES = 4 * 1024 * 1024;
export const MP4_LIMIT_BYTES = 2 * 1024 * 1024;

const kb = (bytes) => `${Math.round(bytes / 1024).toLocaleString("en-GB")} KB`;

function folderStats(dir) {
  if (!existsSync(dir)) return { count: 0, bytes: 0 };
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const bytes = files.reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
  return { count: files.length, bytes };
}

const fileBytes = (file) => (existsSync(file) ? statSync(file).size : null);

export function printSummary(out = "public/build") {
  const desktop = folderStats(join(out, "desktop"));
  const mobile = folderStats(join(out, "mobile"));
  const files = ["poster.webp", "final.webp", "build-mobile.mp4", "manifest.json"].map((f) => [f, fileBytes(join(out, f))]);

  const rows = [
    ["desktop/", `${desktop.count} frames`, kb(desktop.bytes), desktop.count ? `avg ${kb(desktop.bytes / desktop.count)}` : ""],
    ["mobile/", `${mobile.count} frames`, kb(mobile.bytes), mobile.count ? `avg ${kb(mobile.bytes / mobile.count)}` : ""],
    ...files.map(([f, b]) => [f, b === null ? "missing" : "", b === null ? "" : kb(b), ""]),
  ];

  console.log(`\nSize summary (${out})`);
  for (const r of rows) console.log(`  ${r[0].padEnd(18)}${r[1].padEnd(12)}${r[2].padStart(10)}  ${r[3]}`);

  return { desktop, mobile, mp4: fileBytes(join(out, "build-mobile.mp4")) };
}

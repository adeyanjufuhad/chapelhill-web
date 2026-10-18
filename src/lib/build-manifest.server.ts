import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { BuildManifest } from "@/components/hero/build-manifest";

/**
 * Reads public/build/manifest.json synchronously so the result is prerendered
 * into the static shell. Returns null when no frames have been generated yet.
 */
export function readBuildManifest(): BuildManifest | null {
  try {
    const file = path.join(process.cwd(), "public", "build", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(file, "utf8")) as BuildManifest;
    if (!manifest.desktop?.count || !manifest.mobile?.count) return null;
    return manifest;
  } catch {
    return null;
  }
}

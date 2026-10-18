// Minimal .env.local loader for the db scripts (Next.js loads it for the app itself).
import { existsSync, readFileSync } from "node:fs";

export function loadEnv(file = ".env.local") {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (.env.local)");
}

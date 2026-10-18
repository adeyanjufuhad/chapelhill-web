// Cross-platform launcher for from-video.sh. npm runs scripts through cmd.exe
// on Windows, where `bash` is usually not on PATH, so locate Git for
// Windows' bash from `git --exec-path`.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function findBash() {
  if (process.platform !== "win32") return "bash";
  const candidates = [];
  try {
    // e.g. C:/Program Files/Git/mingw64/libexec/git-core → C:/Program Files/Git/bin/bash.exe
    const execPath = execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim();
    candidates.push(resolve(execPath, "../../../bin/bash.exe"), resolve(execPath, "../../../usr/bin/bash.exe"));
  } catch {
    // git not on PATH; fall through to the default install locations
  }
  candidates.push("C:/Program Files/Git/bin/bash.exe", "C:/Program Files (x86)/Git/bin/bash.exe");
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error("Could not find bash. Install Git for Windows or run scripts/build-frames/from-video.sh from Git Bash.");
    process.exit(1);
  }
  return found;
}

const script = join(dirname(fileURLToPath(import.meta.url)), "from-video.sh");
const result = spawnSync(findBash(), [script, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);

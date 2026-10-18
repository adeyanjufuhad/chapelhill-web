#!/usr/bin/env bash
# Build the scroll-hero frame sequence from the construction video.
#
# Usage:
#   npm run frames:video
#   npm run frames:video -- --input assets/video/my-take.mp4
#   npm run frames:video -- --trim-start 0.5 --trim-end 1
#   npm run frames:video -- --trim-start 0.5,0,1.2 --trim-end 0,0.8,0   # per clip
#
# Inputs (first match wins):
#   1. --input <file> (repeatable, kept in the order given)
#   2. assets/video/clip-*.mp4, in name order (clip-a, clip-b, clip-c)
#   3. every other assets/video/*.mp4 except build-full.mp4, in name order
#
# Output contract (read by <BuildSequenceHero /> through manifest.json only):
#   assets/video/build-full.mp4            trimmed + concatenated, no audio
#   public/build/desktop/frame_0001.webp…  min(1920, source)w, WebP q70, ~150 frames
#   public/build/mobile/frame_0001.webp…   960w, WebP q65, ~90 frames
#   public/build/poster.webp, final.webp   first / last frame
#   public/build/build-mobile.mp4          H.264, no audio, faststart, < 2 MB
#   public/build/manifest.json

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

DESKTOP_COUNT=150
MOBILE_COUNT=90
DESKTOP_MAX_WIDTH=1920
MOBILE_WIDTH=960
MP4_MAX_BYTES=$((2 * 1024 * 1024))

inputs=()
trim_start="0"
trim_end="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --input) inputs+=("$2"); shift 2 ;;
    --trim-start) trim_start="$2"; shift 2 ;;
    --trim-end) trim_end="$2"; shift 2 ;;
    --desktop-count) DESKTOP_COUNT="$2"; shift 2 ;;
    --mobile-count) MOBILE_COUNT="$2"; shift 2 ;;
    -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# Prefer system ffmpeg/ffprobe; fall back to the npm static binaries.
FFMPEG="$(command -v ffmpeg || node -p 'require("ffmpeg-static")')"
FFPROBE="$(command -v ffprobe || node -p 'require("ffprobe-static").path')"

if [[ ${#inputs[@]} -eq 0 ]]; then
  shopt -s nullglob
  inputs=(assets/video/clip-*.mp4)
  if [[ ${#inputs[@]} -eq 0 ]]; then
    for f in assets/video/*.mp4; do
      [[ "$(basename "$f")" == "build-full.mp4" ]] || inputs+=("$f")
    done
  fi
  shopt -u nullglob
fi

if [[ ${#inputs[@]} -eq 0 ]]; then
  echo "No input video. Put clips in assets/video/ (clip-a.mp4, clip-b.mp4, …) or pass --input <file>." >&2
  exit 1
fi

probe_duration() {
  "$FFPROBE" -v error -show_entries format=duration -of default=nw=1:nk=1 "$1" | tr -d '\r'
}

probe_dims() {
  "$FFPROBE" -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$1" | tr -d '\r'
}

# Value for clip $2 from a single value or a comma-separated per-clip list in $1.
pick() {
  local list="$1" idx="$2"
  IFS=',' read -r -a parts <<< "$list"
  if [[ ${#parts[@]} -eq 1 ]]; then echo "${parts[0]}"; else echo "${parts[$idx]:-0}"; fi
}

file_size() { node -p "require('fs').statSync(process.argv[1]).size" "$1"; }

TMP="$ROOT/tmp/build-frames"
rm -rf "$TMP"
mkdir -p "$TMP/desktop" "$TMP/mobile" public/build

base_dims="$(probe_dims "${inputs[0]}")"
base_w="${base_dims%x*}"
base_h="${base_dims#*x}"

echo "→ ${#inputs[@]} input clip(s), base resolution ${base_w}x${base_h}"

# 1. Trim each clip, normalise to the first clip's size/fps, concatenate, strip audio.
ff_inputs=()
filter=""
concat_in=""
for i in "${!inputs[@]}"; do
  clip="${inputs[$i]}"
  dur="$(probe_duration "$clip")"
  ts="$(pick "$trim_start" "$i")"
  te="$(pick "$trim_end" "$i")"
  end="$(node -p "Math.max(0, $dur - $te).toFixed(3)")"
  echo "  clip $((i + 1)): $clip  ${dur}s  keep ${ts}s → ${end}s"
  ff_inputs+=(-i "$clip")
  filter+="[$i:v]trim=start=${ts}:end=${end},setpts=PTS-STARTPTS,scale=${base_w}:${base_h}:flags=lanczos,setsar=1,fps=24[v$i];"
  concat_in+="[v$i]"
done
filter+="${concat_in}concat=n=${#inputs[@]}:v=1:a=0[v]"

"$FFMPEG" -v error -y "${ff_inputs[@]}" -filter_complex "$filter" -map "[v]" -an \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart assets/video/build-full.mp4

total="$(probe_duration assets/video/build-full.mp4)"
echo "→ assets/video/build-full.mp4  ${total}s (measured with ffprobe)"

# 2. Extract evenly spaced frames across the real duration. Never upscale.
extract() {
  local count="$1" width="$2" dir="$3"
  local fps
  fps="$(node -p "($count / $total).toFixed(6)")"
  "$FFMPEG" -v error -y -i assets/video/build-full.mp4 \
    -vf "fps=${fps}:round=down,scale='min(${width},iw)':-2:flags=lanczos" \
    -frames:v "$count" -compression_level 1 "$dir/%04d.png"
}

extract "$DESKTOP_COUNT" "$DESKTOP_MAX_WIDTH" "$TMP/desktop"
extract "$MOBILE_COUNT" "$MOBILE_WIDTH" "$TMP/mobile"

# 3. Mobile MP4 fallback: CRF first, then two-pass at a computed bitrate if over budget.
mp4=public/build/build-mobile.mp4
"$FFMPEG" -v error -y -i assets/video/build-full.mp4 -an \
  -vf "scale=${MOBILE_WIDTH}:-2:flags=lanczos" -c:v libx264 -preset slow -crf 30 \
  -g 24 -pix_fmt yuv420p -movflags +faststart "$mp4"

if (( $(file_size "$mp4") > MP4_MAX_BYTES )); then
  kbps="$(node -p "Math.floor(($MP4_MAX_BYTES * 8 * 0.9) / $total / 1000)")"
  echo "→ build-mobile.mp4 over 2 MB at CRF 30, re-encoding two-pass at ${kbps} kb/s"
  passlog="$TMP/x264pass"
  "$FFMPEG" -v error -y -i assets/video/build-full.mp4 -an -vf "scale=${MOBILE_WIDTH}:-2:flags=lanczos" \
    -c:v libx264 -preset slow -b:v "${kbps}k" -g 24 -pix_fmt yuv420p -pass 1 -passlogfile "$passlog" -f mp4 "$TMP/null.mp4"
  "$FFMPEG" -v error -y -i assets/video/build-full.mp4 -an -vf "scale=${MOBILE_WIDTH}:-2:flags=lanczos" \
    -c:v libx264 -preset slow -b:v "${kbps}k" -maxrate "$((kbps * 2))k" -bufsize "$((kbps * 2))k" -g 24 \
    -pix_fmt yuv420p -pass 2 -passlogfile "$passlog" -movflags +faststart "$mp4"
fi

# 4. WebP encoding, poster/final, manifest from the files actually written, size summary.
node scripts/build-frames/encode-webp.mjs --src "$TMP" --out public/build --source video

rm -rf "$TMP"

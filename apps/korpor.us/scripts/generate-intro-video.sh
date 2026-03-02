#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
POSTER="${APP_DIR}/static/videos/korporus-intro-draft.svg"
OUT="${APP_DIR}/static/videos/korporus-intro-draft.mp4"
TMP_PNG="${APP_DIR}/static/videos/.korporus-intro-draft.tmp.png"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but was not found in PATH." >&2
  exit 1
fi

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "rsvg-convert is required but was not found in PATH." >&2
  exit 1
fi

if [[ ! -f "${POSTER}" ]]; then
  echo "Poster not found: ${POSTER}" >&2
  exit 1
fi

mkdir -p "$(dirname "${OUT}")"

rsvg-convert -w 1920 -h 1080 "${POSTER}" -o "${TMP_PNG}"

# Generate a deterministic 12s draft intro clip with subtle motion from the poster.
ffmpeg -y \
  -loop 1 \
  -i "${TMP_PNG}" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -t 12 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(1.12,1+0.0004*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,fade=t=in:st=0:d=0.75,fade=t=out:st=11:d=1.0,format=yuv420p" \
  -r 30 \
  -c:v libx264 \
  -preset medium \
  -profile:v high \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  -shortest \
  "${OUT}"

rm -f "${TMP_PNG}"

echo "Generated ${OUT}"

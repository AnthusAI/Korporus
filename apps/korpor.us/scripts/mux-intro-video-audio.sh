#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

VIDEO_IN="${APP_DIR}/static/videos/korporus-intro-draft.mp4"
AUDIO_IN="${APP_DIR}/static/videos/korporus-intro-draft-voice.m4a"
VIDEO_OUT="${APP_DIR}/static/videos/korporus-intro-draft.mp4"
VIDEO_TMP="${APP_DIR}/static/videos/.korporus-intro-draft.with-audio.tmp.mp4"
VIDEO_BACKUP="${APP_DIR}/static/videos/korporus-intro-draft.silent.mp4"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but was not found in PATH." >&2
  exit 1
fi

if [[ ! -f "${VIDEO_IN}" ]]; then
  echo "Video not found: ${VIDEO_IN}" >&2
  exit 1
fi

if [[ ! -f "${AUDIO_IN}" ]]; then
  echo "Audio not found: ${AUDIO_IN}" >&2
  exit 1
fi

cp "${VIDEO_IN}" "${VIDEO_BACKUP}"

ffmpeg -y \
  -i "${VIDEO_IN}" \
  -i "${AUDIO_IN}" \
  -map 0:v:0 \
  -map 1:a:0 \
  -c:v copy \
  -c:a aac \
  -b:a 160k \
  -shortest \
  -movflags +faststart \
  "${VIDEO_TMP}" >/dev/null 2>&1

mv "${VIDEO_TMP}" "${VIDEO_OUT}"

echo "Created ${VIDEO_OUT} with narration audio."
echo "Backup of prior video saved at ${VIDEO_BACKUP}."

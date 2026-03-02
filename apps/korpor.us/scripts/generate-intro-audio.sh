#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

TEXT_FILE="${INTRO_VOICEOVER_TEXT_FILE:-${SCRIPT_DIR}/intro-voiceover.txt}"
OUT_MP3="${APP_DIR}/static/videos/korporus-intro-draft-voice.mp3"
OUT_M4A="${APP_DIR}/static/videos/korporus-intro-draft-voice.m4a"

MODEL="${OPENAI_TTS_MODEL:-gpt-4o-mini-tts}"
VOICE="${OPENAI_TTS_VOICE:-alloy}"
INSTRUCTIONS="${OPENAI_TTS_INSTRUCTIONS:-Warm, clear, calm narration for a product intro video.}"

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is required." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but was not found in PATH." >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but was not found in PATH." >&2
  exit 1
fi

if [[ ! -f "${TEXT_FILE}" ]]; then
  echo "Voiceover text file not found: ${TEXT_FILE}" >&2
  exit 1
fi

mkdir -p "${APP_DIR}/static/videos"

TEXT="$(tr '\n' ' ' < "${TEXT_FILE}" | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//')"
ESCAPED_TEXT="$(printf '%s' "${TEXT}" | sed 's/\\/\\\\/g; s/"/\\"/g')"
ESCAPED_INSTRUCTIONS="$(printf '%s' "${INSTRUCTIONS}" | sed 's/\\/\\\\/g; s/"/\\"/g')"

curl -sS https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"${MODEL}\",\"voice\":\"${VOICE}\",\"response_format\":\"mp3\",\"input\":\"${ESCAPED_TEXT}\",\"instructions\":\"${ESCAPED_INSTRUCTIONS}\"}" \
  --output "${OUT_MP3}"

if [[ ! -s "${OUT_MP3}" ]]; then
  echo "TTS generation failed: ${OUT_MP3} is empty." >&2
  exit 1
fi

ffmpeg -y \
  -i "${OUT_MP3}" \
  -c:a aac \
  -b:a 160k \
  "${OUT_M4A}" >/dev/null 2>&1

echo "Generated ${OUT_MP3}"
echo "Generated ${OUT_M4A}"

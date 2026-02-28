#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MIG_DIR="$ROOT_DIR/packages/db/migrations"

if [ ! -d "$MIG_DIR" ]; then
  echo ""
  exit 0
fi

latest="$(ls "$MIG_DIR"/*.sql 2>/dev/null | while read -r f; do b=$(basename \"$f\"); echo \"${b%%_*}\"; done | sort | tail -n1)"
echo "${latest:-}"

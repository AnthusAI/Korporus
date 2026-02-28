#!/usr/bin/env python3
"""
Run a sandboxed workload in E2B and print output.

Required env vars:
  E2B_API_KEY
  TEMPLATE_ID
Optional:
  E2B_DOMAIN (default: e2b.korpor.us)
"""

import os
import sys

from e2b import Sandbox


def _env(key: str, default: str | None = None) -> str:
    value = os.environ.get(key, default)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


def main() -> int:
    api_key = _env("E2B_API_KEY")
    template_id = _env("TEMPLATE_ID")
    domain = os.environ.get("E2B_DOMAIN", "e2b.korpor.us")

    sbx = Sandbox.create(
        template=template_id,
        timeout=300,
        domain=domain,
        api_key=api_key,
    )
    try:
        cmd = (
            "python - <<'PY'\n"
            "print('hello from e2b')\n"
            "print(2+2)\n"
            "PY"
        )
        result = sbx.commands.run(cmd)
        print("exit:", result.exit_code)
        print("stdout:\n", result.stdout)
        print("stderr:\n", result.stderr)
    finally:
        sbx.kill()

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)

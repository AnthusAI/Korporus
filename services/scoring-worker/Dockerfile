# ── builder stage ─────────────────────────────────────────────────────────────
# git is required only to clone Plexus from GitHub during pip install.
# It is kept out of the final image by using a multi-stage build.
FROM python:3.11-slim@sha256:0b23cfb7425d065008b778022a17b1551c82f8b4866ee5a7a200084b7e2eafbf AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY services/scoring-worker/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r /tmp/requirements.txt

# Pre-download NLTK data so it is never fetched at runtime.
# PYTHONPATH must point to the --prefix'd site-packages since pip used --prefix=/install.
RUN PYTHONPATH=/install/lib/python3.11/site-packages \
    python -c "\
import nltk; \
nltk.download('punkt', quiet=True, download_dir='/install/nltk_data'); \
nltk.download('punkt_tab', quiet=True, download_dir='/install/nltk_data')"


# ── final stage ───────────────────────────────────────────────────────────────
FROM python:3.11-slim@sha256:0b23cfb7425d065008b778022a17b1551c82f8b4866ee5a7a200084b7e2eafbf

# Prevent .pyc files and enable unbuffered stdout/stderr (critical for container logs)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    NLTK_DATA=/usr/local/share/nltk_data:/tmp/nltk_data

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libcurl4 \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages and NLTK data from builder
COPY --from=builder /install /usr/local

RUN groupadd -r appgroup && useradd -r -g appgroup -M -s /sbin/nologin appuser

WORKDIR /app

# Copy application code last — changes here don't invalidate the dependency layers above
COPY services/scoring-worker/worker.py ./worker.py

EXPOSE 8080

# Create writable runtime directories owned by appuser
RUN mkdir -p /tmp/scorecards /tmp/nltk_data /tmp/mpl \
    && chown -R appuser:appgroup /tmp/scorecards /tmp/nltk_data /tmp/mpl

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/livez')" || exit 1

ENTRYPOINT ["python", "worker.py"]

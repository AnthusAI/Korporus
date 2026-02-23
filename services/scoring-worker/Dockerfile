FROM python:3.11-slim

# Prevent .pyc files and enable unbuffered stdout/stderr (critical for container logs)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libpq5 \
    libcurl4 \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies before copying app code for better layer caching
COPY services/scoring-worker/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Pre-download NLTK data into the image so it's never fetched at runtime
RUN python -c "\
import nltk; \
nltk.download('punkt', quiet=True, download_dir='/usr/local/share/nltk_data'); \
nltk.download('punkt_tab', quiet=True, download_dir='/usr/local/share/nltk_data')"

RUN groupadd -r appgroup && useradd -r -g appgroup -M -s /sbin/nologin appuser

WORKDIR /app

# Copy application code last — changes here don't invalidate the dependency layers above
COPY services/scoring-worker/worker.py ./worker.py

EXPOSE 8080

# Create writable runtime dirs and hand them to the non-root user
RUN mkdir -p /tmp/scorecards /tmp/nltk_data /tmp/mpl \
    && chown -R appuser:appgroup /tmp/scorecards /tmp/nltk_data /tmp/mpl

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD pgrep -f worker.py || exit 1

ENTRYPOINT ["python", "worker.py"]

#!/usr/bin/env python3
"""
Scoring Worker

Long-lived worker process for asynchronous scoring. No Lambda dependency.

Phase 1: Validates configuration and runs a long-lived worker loop.
         Transport (RabbitMQ) is wired in during Phase 2.

Environment Variables:
    PLEXUS_ACCOUNT_KEY: Plexus account key
    PLEXUS_API_KEY: Plexus API key
    PLEXUS_API_URL: Plexus API URL
    PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI: PostgreSQL connection URI for LangGraph
"""

import asyncio
import json
import logging
import os
import signal
import sys
import traceback
from decimal import Decimal
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread

import aio_pika

os.environ.setdefault('SCORECARD_CACHE_DIR', '/tmp/scorecards')
os.environ.setdefault('NLTK_DATA', '/usr/local/share/nltk_data:/tmp/nltk_data')
os.environ.setdefault('MPLBACKEND', 'Agg')
os.environ.setdefault('MPLCONFIGDIR', '/tmp/mpl')

REQUIRED_VARS = [
    'PLEXUS_ACCOUNT_KEY',
    'PLEXUS_API_KEY',
    'PLEXUS_API_URL',
    'PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI',
    'PLEXUS_RABBITMQ_URL',
    'PLEXUS_RABBITMQ_REQUEST_QUEUE',
    'PLEXUS_RABBITMQ_RESPONSE_QUEUE',
]

DEFAULT_PREFETCH = 1
DEFAULT_HEALTH_HOST = "0.0.0.0"
DEFAULT_HEALTH_PORT = 8080


class HealthState:
    def __init__(self):
        self.ready = False


health_state = HealthState()


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/healthz", "/livez"):
            self._send(200, {"status": "alive"})
            return
        if self.path == "/readyz":
            if health_state.ready:
                self._send(200, {"status": "ready"})
            else:
                self._send(503, {"status": "not_ready"})
            return
        self._send(404, {"error": "not_found"})

    def log_message(self, format, *args):
        # Silence default HTTP server logs (we use main logger)
        return

    def _send(self, status, body):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def start_health_server():
    host = os.environ.get("PLEXUS_HEALTH_HOST", DEFAULT_HEALTH_HOST)
    port = int(os.environ.get("PLEXUS_HEALTH_PORT", DEFAULT_HEALTH_PORT))
    server = HTTPServer((host, port), HealthHandler)

    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    logging.info(f"Health server listening on {host}:{port}")
    return server


def _json_safe(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, dict):
        return {k: _json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_safe(v) for v in value]
    return value


class RabbitMQJobProcessor:
    """Processes scoring jobs pulled from RabbitMQ."""

    def __init__(self):
        self.client = None
        self.account_id = None
        self.account_key = os.environ.get('PLEXUS_ACCOUNT_KEY')
        self.scoring_mode = os.environ.get('PLEXUS_SCORING_MODE', 'real').lower()

    async def initialize(self):
        if self.scoring_mode == 'mock':
            logging.info("Scoring mode: mock")
            return

        from plexus.dashboard.api.client import PlexusDashboardClient
        from plexus.dashboard.api.models.account import Account

        self.client = PlexusDashboardClient()
        logging.info(f"Resolving account: {self.account_key}")
        account = await asyncio.to_thread(Account.get_by_key, self.account_key, self.client)
        if not account:
            raise ValueError(f"No account found with key: {self.account_key}")
        self.account_id = account.id
        logging.info(f"Initialized with account: {account.name} (ID: {self.account_id})")

    async def process_scoring_job(self, scoring_job_id: str, request_id: str) -> dict:
        if self.scoring_mode == 'mock':
            return {
                "value": "mock",
                "explanation": f"mock scoring for {scoring_job_id}",
                "cost": None,
            }

        from datetime import datetime, timezone
        from plexus.dashboard.api.models.scoring_job import ScoringJob
        from plexus.dashboard.api.models.scorecard import Scorecard
        from plexus.dashboard.api.models.score import Score
        from plexus.dashboard.api.models.item import Item
        from plexus.utils.request_log_capture import capture_request_logs
        from plexus.utils.scoring import (
            create_scorecard_instance_for_single_score,
            resolve_scorecard_id,
            resolve_score_id,
            get_text_from_item,
            get_metadata_from_item,
            get_external_id_from_item,
        )

        with capture_request_logs(request_id) as (_req_id, get_logs):
            logging.info(f"Processing scoring_job_id={scoring_job_id} request_id={request_id}")

            scoring_job = await asyncio.to_thread(ScoringJob.get_by_id, scoring_job_id, self.client)
            if not scoring_job:
                raise ValueError(f"ScoringJob not found: {scoring_job_id}")

            await asyncio.to_thread(
                scoring_job.update,
                status='IN_PROGRESS',
                startedAt=datetime.now(timezone.utc).isoformat()
            )

            scorecard = await asyncio.to_thread(Scorecard.get_by_id, scoring_job.scorecardId, self.client)
            scorecard_external_id = scorecard.externalId if scorecard else None

            score = await asyncio.to_thread(Score.get_by_id, scoring_job.scoreId, self.client)
            score_external_id = score.externalId if score else None

            dynamo_scorecard_id = await resolve_scorecard_id(scorecard_external_id, self.account_id, self.client)
            if not dynamo_scorecard_id:
                raise Exception(f"Could not resolve scorecard ID: {scorecard_external_id}")

            resolved_score_info = await resolve_score_id(score_external_id, dynamo_scorecard_id, self.client)
            if not resolved_score_info:
                raise Exception(f"Could not resolve score ID: {score_external_id}")

            dynamo_score_id = resolved_score_info['id']

            item = None
            try:
                item = await asyncio.to_thread(Item.get_by_id, scoring_job.itemId, self.client)
            except Exception as e:
                logging.warning(f"Could not fetch Item {scoring_job.itemId}: {e}")

            transcript_text = item.text if item and item.text else await get_text_from_item(scoring_job.itemId, self.client)
            if not transcript_text and not item:
                raise Exception(f"No transcript found for item {scoring_job.itemId}")

            metadata = await get_metadata_from_item(scoring_job.itemId, self.client) or {}
            if isinstance(metadata, dict):
                for key, value in list(metadata.items()):
                    if isinstance(value, str):
                        try:
                            metadata[key] = json.loads(value)
                        except (json.JSONDecodeError, ValueError):
                            pass

            external_id = await get_external_id_from_item(scoring_job.itemId, self.client)
            if not external_id:
                raise Exception(f"No external_id found for item {scoring_job.itemId}")

            scorecard_instance = await create_scorecard_instance_for_single_score(
                scorecard_external_id,
                score_external_id,
            )
            if not scorecard_instance:
                raise Exception(f"Failed to create scorecard instance for {scorecard_external_id}")

            score_results = await scorecard_instance.score_entire_text(
                text=transcript_text or "",
                metadata=metadata,
                modality="API",
                item=item,
            )

            result = score_results.get(dynamo_score_id)
            if not result:
                raise Exception(f"No result returned for score {dynamo_score_id}")

            value = str(result.value) if result.value is not None else None
            explanation = (getattr(result, 'explanation', None) or
                          (result.metadata.get('explanation', '') if result.metadata else ''))

            if value and value.upper() == "ERROR":
                await asyncio.to_thread(
                    scoring_job.update,
                    status='FAILED',
                    errorMessage=explanation[:255] if explanation else "Scoring returned ERROR",
                    completedAt=datetime.now(timezone.utc).isoformat()
                )
                raise ValueError(f"Scoring returned ERROR: {explanation[:255] if explanation else 'No explanation'}")

            _ = get_logs()
            cost = _json_safe(result.metadata.get('cost')) if result.metadata else None

            await asyncio.to_thread(
                scoring_job.update,
                status='COMPLETED',
                completedAt=datetime.now(timezone.utc).isoformat()
            )

            return {
                "value": value,
                "explanation": explanation,
                "cost": cost,
            }


async def start_rabbitmq_consumer(shutdown: asyncio.Event):
    rabbitmq_url = os.environ['PLEXUS_RABBITMQ_URL']
    request_queue_name = os.environ['PLEXUS_RABBITMQ_REQUEST_QUEUE']
    response_queue_name = os.environ['PLEXUS_RABBITMQ_RESPONSE_QUEUE']
    prefetch = int(os.environ.get('PLEXUS_RABBITMQ_PREFETCH', DEFAULT_PREFETCH))

    processor = RabbitMQJobProcessor()
    await processor.initialize()

    while not shutdown.is_set():
        try:
            connection = await aio_pika.connect_robust(rabbitmq_url)
            channel = await connection.channel(publisher_confirms=True)
            await channel.set_qos(prefetch_count=prefetch)

            request_queue = await channel.declare_queue(request_queue_name, durable=True)
            response_queue = await channel.declare_queue(response_queue_name, durable=True)

            health_state.ready = True
            logging.info("Connected to RabbitMQ and declared queues")

            async def monitor_connection():
                while not shutdown.is_set():
                    if connection.is_closed or channel.is_closed:
                        health_state.ready = False
                        return
                    await asyncio.sleep(1)

            monitor_task = asyncio.create_task(monitor_connection())

            async def on_message(message: aio_pika.IncomingMessage):
                request_id = None
                try:
                    payload = json.loads(message.body.decode())
                    request_id = payload.get("request_id")
                    scoring_job_id = payload.get("scoring_job_id")
                    if not request_id or not scoring_job_id:
                        logging.error(
                            f"Invalid message (missing request_id or scoring_job_id): {payload}"
                        )
                        await message.reject(requeue=False)
                        return

                    result_payload = await processor.process_scoring_job(scoring_job_id, request_id)

                    response = {
                        "request_id": request_id,
                        "status": "success",
                        "value": result_payload.get("value"),
                        "explanation": result_payload.get("explanation"),
                        "cost": result_payload.get("cost"),
                    }
                    response_message = aio_pika.Message(
                        body=json.dumps(response).encode(),
                        delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                    )
                    await channel.default_exchange.publish(
                        response_message,
                        routing_key=response_queue.name,
                    )
                    await message.ack()
                    logging.info(f"Processed request_id={request_id} scoring_job_id={scoring_job_id}")

                except Exception as e:
                    logging.error(f"Failed to process message request_id={request_id}: {e}")
                    logging.error(traceback.format_exc())
                    try:
                        await message.reject(requeue=False)
                    except Exception:
                        logging.error("Failed to reject message")

            consumer_tag = await request_queue.consume(on_message)
            logging.info("RabbitMQ consumer started")

            await shutdown.wait()
            await request_queue.cancel(consumer_tag)
            await channel.close()
            await connection.close()
            health_state.ready = False
            monitor_task.cancel()
        except Exception as e:
            health_state.ready = False
            logging.error(f"RabbitMQ connection error: {e}")
            logging.error(traceback.format_exc())
            await asyncio.sleep(5)


def validate_config():
    missing = [v for v in REQUIRED_VARS if not os.environ.get(v)]
    if missing:
        for var in missing:
            logging.error(f"Missing required environment variable: {var}")
        sys.exit(1)


async def run():
    validate_config()
    logging.info("Configuration validated")

    shutdown = asyncio.Event()

    def handle_signal(*_):
        logging.info("Shutdown signal received, stopping worker")
        shutdown.set()

    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    logging.info("Worker started")

    health_server = start_health_server()
    await start_rabbitmq_consumer(shutdown)
    health_server.shutdown()

    logging.info("Worker stopped")


if __name__ == '__main__':
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(message)s',
        stream=sys.stdout,
    )
    asyncio.run(run())

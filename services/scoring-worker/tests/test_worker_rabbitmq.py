"""
RabbitMQ integration tests for the scoring worker.
"""

import json
import time

import pika
import requests

from .conftest import (
    REQUIRED_ENV,
    container_with_env,
    wait_for_worker_ready,
)


def _connect_pika(rabbit):
    host = rabbit.get_container_host_ip()
    port = int(rabbit.get_exposed_port(5672))
    params = pika.ConnectionParameters(host=host, port=port, heartbeat=30)
    return pika.BlockingConnection(params)


def _get_message(channel, queue_name, timeout=10):
    end = time.time() + timeout
    while time.time() < end:
        method, properties, body = channel.basic_get(queue=queue_name, auto_ack=True)
        if body:
            return json.loads(body)
        time.sleep(0.2)
    return None


def test_worker_consumes_request_and_publishes_result(rabbitmq_setup):
    rabbit, network = rabbitmq_setup
    with container_with_env(REQUIRED_ENV, network) as container:
        wait_for_worker_ready(container)

        host = container.get_container_host_ip()
        port = container.get_exposed_port(8080)
        ready = requests.get(f"http://{host}:{port}/readyz", timeout=5)
        assert ready.status_code == 200

        connection = _connect_pika(rabbit)
        channel = connection.channel()
        channel.queue_declare(queue=REQUIRED_ENV["PLEXUS_RABBITMQ_REQUEST_QUEUE"], durable=True)
        channel.queue_declare(queue=REQUIRED_ENV["PLEXUS_RABBITMQ_RESPONSE_QUEUE"], durable=True)

        request = {"request_id": "req-1", "scoring_job_id": "job-1"}
        channel.basic_publish(
            exchange="",
            routing_key=REQUIRED_ENV["PLEXUS_RABBITMQ_REQUEST_QUEUE"],
            body=json.dumps(request).encode(),
        )

        response = _get_message(channel, REQUIRED_ENV["PLEXUS_RABBITMQ_RESPONSE_QUEUE"], timeout=15)
        assert response is not None, "Expected a response message"
        assert response["request_id"] == "req-1"
        assert response["status"] == "success"
        assert response["value"] == "mock"
        assert "mock scoring for job-1" in response["explanation"]
        assert response["cost"] is None

        # Ensure request queue is empty after ack
        method, properties, body = channel.basic_get(
            queue=REQUIRED_ENV["PLEXUS_RABBITMQ_REQUEST_QUEUE"], auto_ack=True
        )
        assert body is None

        connection.close()


def test_worker_failure_does_not_publish_success(rabbitmq_setup):
    rabbit, network = rabbitmq_setup
    with container_with_env(REQUIRED_ENV, network) as container:
        wait_for_worker_ready(container)

        connection = _connect_pika(rabbit)
        channel = connection.channel()
        channel.queue_declare(queue=REQUIRED_ENV["PLEXUS_RABBITMQ_REQUEST_QUEUE"], durable=True)
        channel.queue_declare(queue=REQUIRED_ENV["PLEXUS_RABBITMQ_RESPONSE_QUEUE"], durable=True)

        request = {"request_id": "req-2"}
        channel.basic_publish(
            exchange="",
            routing_key=REQUIRED_ENV["PLEXUS_RABBITMQ_REQUEST_QUEUE"],
            body=json.dumps(request).encode(),
        )

        response = _get_message(channel, REQUIRED_ENV["PLEXUS_RABBITMQ_RESPONSE_QUEUE"], timeout=5)
        assert response is None, "Did not expect a success response"

        logs = container.get_logs()
        stdout = logs[0].decode()
        assert "req-2" in stdout

        connection.close()


def test_readiness_reports_not_ready_when_rabbitmq_down(rabbitmq_teardown_setup):
    rabbit, network = rabbitmq_teardown_setup
    with container_with_env(REQUIRED_ENV, network) as container:
        wait_for_worker_ready(container)
        host = container.get_container_host_ip()
        port = container.get_exposed_port(8080)

        # Stop RabbitMQ to force readiness to fail
        rabbit.get_wrapped_container().stop(timeout=10)

        end = time.time() + 15
        status = None
        while time.time() < end:
            try:
                resp = requests.get(f"http://{host}:{port}/readyz", timeout=2)
                status = resp.status_code
                if status == 503:
                    break
            except Exception:
                pass
            time.sleep(1)

        assert status == 503

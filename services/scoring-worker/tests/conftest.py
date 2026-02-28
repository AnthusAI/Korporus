"""
Shared fixtures and helpers for scoring-worker integration tests.
"""

import warnings

import pytest
from testcontainers.core.container import DockerContainer
from testcontainers.core.network import Network
from testcontainers.core.waiting_utils import wait_for_logs
from testcontainers.rabbitmq import RabbitMqContainer

IMAGE_NAME = "scoring-worker:latest"

REQUIRED_ENV = {
    "PLEXUS_ACCOUNT_KEY": "test-account",
    "PLEXUS_API_KEY": "test-api-key",
    "PLEXUS_API_URL": "https://test.example.com/graphql",
    "PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI": "postgresql://test:test@localhost/test",
    "PLEXUS_RABBITMQ_URL": "amqp://guest:guest@rabbitmq:5672/",
    "PLEXUS_RABBITMQ_REQUEST_QUEUE": "plexus_scoring_requests",
    "PLEXUS_RABBITMQ_RESPONSE_QUEUE": "plexus_scoring_responses",
}

# Optional env vars included by default in most test containers (e.g. mock mode)
# but NOT validated as required by the worker itself.
DEFAULT_OPTIONAL_ENV = {
    "PLEXUS_SCORING_MODE": "mock",
}


def wait_for_worker_ready(container, log_line="RabbitMQ consumer started", timeout=30):
    """Wait until the worker logs the given line, suppressing deprecation noise."""
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        wait_for_logs(container, log_line, timeout=timeout)


def container_with_env(env: dict, network: Network, include_optional: bool = True) -> DockerContainer:
    """Build a DockerContainer with the given environment variables.

    By default, DEFAULT_OPTIONAL_ENV values are merged in (lower priority than env).
    Pass include_optional=False for tests that need a clean env (e.g. missing-config tests).
    """
    c = DockerContainer(IMAGE_NAME).with_network(network).with_exposed_ports(8080)
    merged = {**(DEFAULT_OPTIONAL_ENV if include_optional else {}), **env}
    for key, value in merged.items():
        c = c.with_env(key, value)
    return c


@pytest.fixture(scope="module")
def rabbitmq_network():
    """Module-scoped Docker network with a running RabbitMQ container."""
    with Network() as network:
        rabbit = RabbitMqContainer("rabbitmq:3-management")
        rabbit.with_network(network)
        rabbit.with_network_aliases("rabbitmq")
        with rabbit:
            yield network


@pytest.fixture(scope="module")
def rabbitmq_setup():
    """Module-scoped Docker network + RabbitMQ container (yields both)."""
    with Network() as network:
        rabbit = RabbitMqContainer("rabbitmq:3-management")
        rabbit.with_network(network)
        rabbit.with_network_aliases("rabbitmq")
        with rabbit:
            yield rabbit, network


@pytest.fixture(scope="function")
def rabbitmq_teardown_setup():
    """
    Function-scoped RabbitMQ fixture for tests that stop RabbitMQ mid-test.
    Using function scope ensures a fresh container for each test, so stopping
    it does not affect any other test.
    """
    with Network() as network:
        rabbit = RabbitMqContainer("rabbitmq:3-management")
        rabbit.with_network(network)
        rabbit.with_network_aliases("rabbitmq")
        with rabbit:
            yield rabbit, network

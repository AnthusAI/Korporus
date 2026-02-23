"""
Container integration tests for the scoring worker.

Scenario: Worker starts in generic container runtime
  Given a worker container image exists
  When the container is started with required configuration
  Then a long-lived worker process starts
  And the worker does not require AWS Lambda handlers
  And the worker remains running

Scenario: Worker fails fast if required configuration is missing
  Given required configuration variables are not provided
  When the container starts
  Then the worker exits with a non-zero status
  And logs clearly identify the missing configuration
"""

import time
import warnings

import pytest
from testcontainers.core.container import DockerContainer
from testcontainers.core.network import Network
from testcontainers.rabbitmq import RabbitMqContainer
from testcontainers.core.waiting_utils import wait_for_logs
import requests


def wait_for_worker_ready(container, timeout=30):
    """Wait until the worker logs 'Worker started', suppressing deprecation noise."""
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        wait_for_logs(container, "Worker started", timeout=timeout)

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

OPTIONAL_ENV = {
    "PLEXUS_SCORING_MODE": "mock",
}


@pytest.fixture(scope="module")
def rabbitmq_network():
    with Network() as network:
        rabbit = RabbitMqContainer("rabbitmq:3-management")
        rabbit.with_network(network)
        rabbit.with_network_aliases("rabbitmq")
        with rabbit:
            yield network


def container_with_env(env: dict, network: Network) -> DockerContainer:
    """Build a DockerContainer with the given environment variables."""
    c = DockerContainer(IMAGE_NAME).with_network(network).with_exposed_ports(8080)
    merged = {**OPTIONAL_ENV, **env}
    for key, value in merged.items():
        c = c.with_env(key, value)
    return c


class TestWorkerStartsInGenericContainerRuntime:
    """
    Scenario: Worker starts in generic container runtime
    """

    def test_long_lived_worker_process_starts(self, rabbitmq_network):
        """Worker logs 'Worker started' after configuration is validated."""
        with container_with_env(REQUIRED_ENV, rabbitmq_network) as container:
            wait_for_worker_ready(container)
            logs = container.get_logs()
            stdout = logs[0].decode()
            assert "Worker started" in stdout

    def test_worker_does_not_require_lambda_handlers(self, rabbitmq_network):
        """No Lambda-specific modules or entry points are present in the image."""
        with container_with_env(REQUIRED_ENV, rabbitmq_network) as container:
            wait_for_worker_ready(container)
            # Verify awslambdaric is not importable
            exit_code, output = container.exec(
                ["python", "-c", "import awslambdaric"]
            )
            assert exit_code != 0, "awslambdaric should not be installed"

    def test_worker_remains_running(self, rabbitmq_network):
        """Container stays alive for at least 5 seconds after startup."""
        with container_with_env(REQUIRED_ENV, rabbitmq_network) as container:
            wait_for_worker_ready(container)
            time.sleep(5)
            container.get_wrapped_container().reload()
            assert container.get_wrapped_container().status == "running"

    def test_worker_shuts_down_gracefully_on_sigterm(self, rabbitmq_network):
        """SIGTERM causes clean shutdown with a zero exit code."""
        with container_with_env(REQUIRED_ENV, rabbitmq_network) as container:
            wait_for_worker_ready(container)
            container.get_wrapped_container().stop(timeout=10)
            container.get_wrapped_container().reload()
            logs = container.get_logs()
            stdout = logs[0].decode()
            assert "Shutdown signal received" in stdout
            assert container.get_wrapped_container().attrs["State"]["ExitCode"] == 0

    def test_liveness_endpoint_reports_alive(self, rabbitmq_network):
        """Liveness endpoint returns 200 while worker is running."""
        with container_with_env(REQUIRED_ENV, rabbitmq_network) as container:
            wait_for_worker_ready(container)
            host = container.get_container_host_ip()
            port = container.get_exposed_port(8080)
            resp = requests.get(f"http://{host}:{port}/healthz", timeout=5)
            assert resp.status_code == 200


class TestWorkerFailsFastOnMissingConfiguration:
    """
    Scenario: Worker fails fast if required configuration is missing
    """

    @pytest.mark.parametrize("missing_var", list(REQUIRED_ENV.keys()))
    def test_exits_nonzero_when_single_var_missing(self, missing_var, rabbitmq_network):
        """Removing any one required variable causes a non-zero exit."""
        env = {k: v for k, v in REQUIRED_ENV.items() if k != missing_var}
        container = container_with_env(env, rabbitmq_network)
        container.start()
        # Give the process a moment to exit
        timeout = time.time() + 10
        while time.time() < timeout:
            container.get_wrapped_container().reload()
            if container.get_wrapped_container().status != "running":
                break
            time.sleep(0.2)
        container.get_wrapped_container().reload()
        exit_code = container.get_wrapped_container().attrs["State"]["ExitCode"]
        assert exit_code != 0, f"Expected non-zero exit when {missing_var} is missing"
        container.stop()

    @pytest.mark.parametrize("missing_var", list(REQUIRED_ENV.keys()))
    def test_logs_identify_missing_variable(self, missing_var, rabbitmq_network):
        """The missing variable name appears in the container logs."""
        env = {k: v for k, v in REQUIRED_ENV.items() if k != missing_var}
        container = container_with_env(env, rabbitmq_network)
        container.start()
        timeout = time.time() + 10
        while time.time() < timeout:
            container.get_wrapped_container().reload()
            if container.get_wrapped_container().status != "running":
                break
            time.sleep(0.2)
        logs = container.get_logs()
        stdout = logs[0].decode()
        assert missing_var in stdout, (
            f"Expected '{missing_var}' to appear in logs when it is missing"
        )
        container.stop()

    def test_exits_nonzero_when_all_vars_missing(self, rabbitmq_network):
        """Container with no environment variables exits non-zero."""
        container = container_with_env({}, rabbitmq_network)
        container.start()
        timeout = time.time() + 10
        while time.time() < timeout:
            container.get_wrapped_container().reload()
            if container.get_wrapped_container().status != "running":
                break
            time.sleep(0.2)
        container.get_wrapped_container().reload()
        exit_code = container.get_wrapped_container().attrs["State"]["ExitCode"]
        assert exit_code != 0
        container.stop()

    def test_all_missing_vars_logged_at_once(self, rabbitmq_network):
        """All missing variables are reported in a single run, not just the first."""
        container = container_with_env({}, rabbitmq_network)
        container.start()
        timeout = time.time() + 10
        while time.time() < timeout:
            container.get_wrapped_container().reload()
            if container.get_wrapped_container().status != "running":
                break
            time.sleep(0.2)
        logs = container.get_logs()
        stdout = logs[0].decode()
        for var in REQUIRED_ENV:
            assert var in stdout, f"Expected '{var}' to be reported as missing"
        container.stop()

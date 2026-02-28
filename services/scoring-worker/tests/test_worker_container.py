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

import pytest
import requests

from .conftest import (
    REQUIRED_ENV,
    container_with_env,
    wait_for_worker_ready,
)


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

    def _wait_for_exit(self, container, timeout=10):
        """Poll until the container stops running or timeout expires."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            container.get_wrapped_container().reload()
            if container.get_wrapped_container().status != "running":
                return
            time.sleep(0.2)

    @pytest.mark.parametrize("missing_var", list(REQUIRED_ENV.keys()))
    def test_exits_nonzero_when_single_var_missing(self, missing_var, rabbitmq_network):
        """Removing any one required variable causes a non-zero exit."""
        env = {k: v for k, v in REQUIRED_ENV.items() if k != missing_var}
        container = container_with_env(env, rabbitmq_network, include_optional=False)
        container.start()
        try:
            self._wait_for_exit(container)
            container.get_wrapped_container().reload()
            exit_code = container.get_wrapped_container().attrs["State"]["ExitCode"]
            assert exit_code != 0, f"Expected non-zero exit when {missing_var} is missing"
        finally:
            container.stop()

    @pytest.mark.parametrize("missing_var", list(REQUIRED_ENV.keys()))
    def test_logs_identify_missing_variable(self, missing_var, rabbitmq_network):
        """The missing variable name appears in the container logs."""
        env = {k: v for k, v in REQUIRED_ENV.items() if k != missing_var}
        container = container_with_env(env, rabbitmq_network, include_optional=False)
        container.start()
        try:
            self._wait_for_exit(container)
            logs = container.get_logs()
            stdout = logs[0].decode()
            assert missing_var in stdout, (
                f"Expected '{missing_var}' to appear in logs when it is missing"
            )
        finally:
            container.stop()

    def test_exits_nonzero_when_all_vars_missing(self, rabbitmq_network):
        """Container with no environment variables exits non-zero."""
        container = container_with_env({}, rabbitmq_network, include_optional=False)
        container.start()
        try:
            self._wait_for_exit(container)
            container.get_wrapped_container().reload()
            exit_code = container.get_wrapped_container().attrs["State"]["ExitCode"]
            assert exit_code != 0
        finally:
            container.stop()

    def test_all_missing_vars_logged_at_once(self, rabbitmq_network):
        """All missing variables are reported in a single run, not just the first."""
        container = container_with_env({}, rabbitmq_network, include_optional=False)
        container.start()
        try:
            self._wait_for_exit(container)
            logs = container.get_logs()
            stdout = logs[0].decode()
            for var in REQUIRED_ENV:
                assert var in stdout, f"Expected '{var}' to be reported as missing"
        finally:
            container.stop()

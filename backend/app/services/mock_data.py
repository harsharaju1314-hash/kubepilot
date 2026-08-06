import time
from datetime import datetime, timedelta
from typing import List, Dict, Any

class K8sMockStateEngine:
    def __init__(self):
        self._init_data()

    def _init_data(self):
        self.namespaces = ["default", "kube-system", "production", "monitoring", "staging"]

        self.nodes = [
            {
                "name": "minikube-node-01",
                "status": "Ready",
                "role": "control-plane,worker",
                "version": "v1.28.3",
                "internal_ip": "192.168.49.2",
                "cpu_capacity_cores": 8.0,
                "cpu_usage_percentage": 42.5,
                "memory_capacity_gb": 16.0,
                "memory_usage_percentage": 61.2,
                "pods_count": 14,
                "os_image": "Ubuntu 22.04 LTS"
            },
            {
                "name": "minikube-node-02",
                "status": "Ready",
                "role": "worker",
                "version": "v1.28.3",
                "internal_ip": "192.168.49.3",
                "cpu_capacity_cores": 8.0,
                "cpu_usage_percentage": 78.1,
                "memory_capacity_gb": 16.0,
                "memory_usage_percentage": 84.6,
                "pods_count": 18,
                "os_image": "Ubuntu 22.04 LTS"
            }
        ]

        self.deployments = [
            {
                "name": "payment-service",
                "namespace": "production",
                "replicas": 3,
                "ready_replicas": 2,
                "updated_replicas": 3,
                "available_replicas": 2,
                "creation_timestamp": "2026-08-01T10:15:00Z",
                "strategy": "RollingUpdate",
                "labels": {"app": "payment-service", "tier": "backend", "env": "prod"},
                "images": ["ghcr.io/company/payment-service:v2.4.1"]
            },
            {
                "name": "auth-service",
                "namespace": "production",
                "replicas": 2,
                "ready_replicas": 2,
                "updated_replicas": 2,
                "available_replicas": 2,
                "creation_timestamp": "2026-07-28T14:30:00Z",
                "strategy": "RollingUpdate",
                "labels": {"app": "auth-service", "tier": "backend"},
                "images": ["ghcr.io/company/auth-service:v1.8.0"]
            },
            {
                "name": "analytics-worker",
                "namespace": "production",
                "replicas": 2,
                "ready_replicas": 0,
                "updated_replicas": 2,
                "available_replicas": 0,
                "creation_timestamp": "2026-08-06T08:00:00Z",
                "strategy": "RollingUpdate",
                "labels": {"app": "analytics-worker", "tier": "worker"},
                "images": ["ghcr.io/company/analytics-worker:v3.0.0-rc1"]
            },
            {
                "name": "frontend-web",
                "namespace": "production",
                "replicas": 4,
                "ready_replicas": 4,
                "updated_replicas": 4,
                "available_replicas": 4,
                "creation_timestamp": "2026-07-20T09:00:00Z",
                "strategy": "RollingUpdate",
                "labels": {"app": "frontend-web", "tier": "frontend"},
                "images": ["ghcr.io/company/frontend-web:v4.1.2"]
            },
            {
                "name": "prometheus-server",
                "namespace": "monitoring",
                "replicas": 1,
                "ready_replicas": 1,
                "updated_replicas": 1,
                "available_replicas": 1,
                "creation_timestamp": "2026-06-15T12:00:00Z",
                "strategy": "Recreate",
                "labels": {"app": "prometheus", "component": "server"},
                "images": ["prom/prometheus:v2.45.0"]
            }
        ]

        self.pods = [
            {
                "name": "payment-service-75b897858-a912b",
                "namespace": "production",
                "status": "CrashLoopBackOff",
                "ip": "10.244.1.15",
                "node": "minikube-node-02",
                "creation_timestamp": "2026-08-06T18:22:10Z",
                "restart_count": 8,
                "cpu_usage_m": 450,
                "memory_usage_mb": 512,
                "labels": {"app": "payment-service", "pod-template-hash": "75b897858"},
                "environment_vars": {
                    "DB_HOST": "postgres-prod.internal",
                    "DB_PORT": "5432",
                    "DB_TIMEOUT_MS": "3000",
                    "REDIS_URL": "redis://cache-service:6379",
                    "LOG_LEVEL": "DEBUG"
                },
                "containers": [
                    {
                        "name": "payment-app",
                        "image": "ghcr.io/company/payment-service:v2.4.1",
                        "ready": False,
                        "restart_count": 8,
                        "state": "waiting (CrashLoopBackOff)",
                        "started_at": "2026-08-06T19:55:00Z"
                    }
                ]
            },
            {
                "name": "payment-service-75b897858-k4p91",
                "namespace": "production",
                "status": "Running",
                "ip": "10.244.1.16",
                "node": "minikube-node-01",
                "creation_timestamp": "2026-08-06T18:22:10Z",
                "restart_count": 0,
                "cpu_usage_m": 120,
                "memory_usage_mb": 240,
                "labels": {"app": "payment-service", "pod-template-hash": "75b897858"},
                "environment_vars": {"DB_HOST": "postgres-prod.internal", "LOG_LEVEL": "INFO"},
                "containers": [
                    {
                        "name": "payment-app",
                        "image": "ghcr.io/company/payment-service:v2.4.1",
                        "ready": True,
                        "restart_count": 0,
                        "state": "running",
                        "started_at": "2026-08-06T18:22:12Z"
                    }
                ]
            },
            {
                "name": "analytics-worker-99d8b74c-x89qq",
                "namespace": "production",
                "status": "OOMKilled",
                "ip": "10.244.2.44",
                "node": "minikube-node-02",
                "creation_timestamp": "2026-08-06T19:10:00Z",
                "restart_count": 4,
                "cpu_usage_m": 980,
                "memory_usage_mb": 2048,
                "labels": {"app": "analytics-worker"},
                "environment_vars": {"BATCH_SIZE": "50000", "JAVA_OPTS": "-Xmx2048m"},
                "containers": [
                    {
                        "name": "analytics-processor",
                        "image": "ghcr.io/company/analytics-worker:v3.0.0-rc1",
                        "ready": False,
                        "restart_count": 4,
                        "state": "terminated (OOMKilled - Exit Code 137)",
                        "started_at": "2026-08-06T19:40:00Z"
                    }
                ]
            },
            {
                "name": "auth-service-67f7884d5f-m001a",
                "namespace": "production",
                "status": "Running",
                "ip": "10.244.1.20",
                "node": "minikube-node-01",
                "creation_timestamp": "2026-07-28T14:30:00Z",
                "restart_count": 0,
                "cpu_usage_m": 85,
                "memory_usage_mb": 180,
                "labels": {"app": "auth-service"},
                "environment_vars": {"JWT_SECRET_REF": "vault-secret-key"},
                "containers": [
                    {
                        "name": "auth-api",
                        "image": "ghcr.io/company/auth-service:v1.8.0",
                        "ready": True,
                        "restart_count": 0,
                        "state": "running",
                        "started_at": "2026-07-28T14:30:10Z"
                    }
                ]
            },
            {
                "name": "frontend-web-54b9d888f4-z92aa",
                "namespace": "production",
                "status": "Running",
                "ip": "10.244.1.33",
                "node": "minikube-node-01",
                "creation_timestamp": "2026-07-20T09:00:00Z",
                "restart_count": 0,
                "cpu_usage_m": 60,
                "memory_usage_mb": 120,
                "labels": {"app": "frontend-web"},
                "environment_vars": {"NEXT_PUBLIC_API_URL": "https://api.company.com"},
                "containers": [
                    {
                        "name": "nextjs-web",
                        "image": "ghcr.io/company/frontend-web:v4.1.2",
                        "ready": True,
                        "restart_count": 0,
                        "state": "running",
                        "started_at": "2026-07-20T09:00:05Z"
                    }
                ]
            },
            {
                "name": "redis-cache-0",
                "namespace": "production",
                "status": "Running",
                "ip": "10.244.1.09",
                "node": "minikube-node-01",
                "creation_timestamp": "2026-07-15T08:00:00Z",
                "restart_count": 0,
                "cpu_usage_m": 40,
                "memory_usage_mb": 95,
                "labels": {"app": "redis-cache"},
                "environment_vars": {"MAXMEMORY": "512mb"},
                "containers": [
                    {
                        "name": "redis",
                        "image": "redis:7.0-alpine",
                        "ready": True,
                        "restart_count": 0,
                        "state": "running",
                        "started_at": "2026-07-15T08:00:02Z"
                    }
                ]
            },
            {
                "name": "prometheus-server-0",
                "namespace": "monitoring",
                "status": "Running",
                "ip": "10.244.2.11",
                "node": "minikube-node-02",
                "creation_timestamp": "2026-06-15T12:00:00Z",
                "restart_count": 1,
                "cpu_usage_m": 210,
                "memory_usage_mb": 780,
                "labels": {"app": "prometheus"},
                "environment_vars": {"STORAGE_RETENTION": "15d"},
                "containers": [
                    {
                        "name": "prometheus",
                        "image": "prom/prometheus:v2.45.0",
                        "ready": True,
                        "restart_count": 1,
                        "state": "running",
                        "started_at": "2026-07-01T04:00:00Z"
                    }
                ]
            },
            {
                "name": "coredns-5dd5756b68-8x7lq",
                "namespace": "kube-system",
                "status": "Running",
                "ip": "10.244.0.3",
                "node": "minikube-node-01",
                "creation_timestamp": "2026-06-01T00:00:00Z",
                "restart_count": 0,
                "cpu_usage_m": 15,
                "memory_usage_mb": 45,
                "labels": {"k8s-app": "kube-dns"},
                "environment_vars": {},
                "containers": [
                    {
                        "name": "coredns",
                        "image": "registry.k8s.io/coredns/coredns:v1.10.1",
                        "ready": True,
                        "restart_count": 0,
                        "state": "running",
                        "started_at": "2026-06-01T00:00:05Z"
                    }
                ]
            }
        ]

        self.services = [
            {
                "name": "payment-service-lb",
                "namespace": "production",
                "type": "LoadBalancer",
                "cluster_ip": "10.96.140.22",
                "external_ip": "35.230.112.4",
                "ports": [{"name": "http", "port": 8080, "targetPort": 8080, "protocol": "TCP"}],
                "selector": {"app": "payment-service"},
                "creation_timestamp": "2026-08-01T10:15:00Z"
            },
            {
                "name": "auth-service-clusterip",
                "namespace": "production",
                "type": "ClusterIP",
                "cluster_ip": "10.96.88.91",
                "external_ip": None,
                "ports": [{"name": "http", "port": 3000, "targetPort": 3000, "protocol": "TCP"}],
                "selector": {"app": "auth-service"},
                "creation_timestamp": "2026-07-28T14:30:00Z"
            },
            {
                "name": "postgres-prod",
                "namespace": "production",
                "type": "ClusterIP",
                "cluster_ip": "10.96.0.45",
                "external_ip": None,
                "ports": [{"name": "postgres", "port": 5432, "targetPort": 5432, "protocol": "TCP"}],
                "selector": {"app": "postgres"},
                "creation_timestamp": "2026-07-10T11:00:00Z"
            }
        ]

        self.events = [
            {
                "id": "evt-101",
                "type": "Warning",
                "reason": "BackOff",
                "message": "Back-off restarting failed container payment-app in pod payment-service-75b897858-a912b_production",
                "object": "Pod/payment-service-75b897858-a912b",
                "namespace": "production",
                "timestamp": "2026-08-06T20:01:15Z",
                "count": 8
            },
            {
                "id": "evt-102",
                "type": "Warning",
                "reason": "OOMKilled",
                "message": "Container analytics-processor in pod analytics-worker-99d8b74c-x89qq was killed due to memory limit (2048Mi) exceeded",
                "object": "Pod/analytics-worker-99d8b74c-x89qq",
                "namespace": "production",
                "timestamp": "2026-08-06T19:40:02Z",
                "count": 4
            },
            {
                "id": "evt-103",
                "type": "Warning",
                "reason": "Unhealthy",
                "message": "Readiness probe failed: HTTP probe failed with statuscode: 500 Connection timed out after 3000ms",
                "object": "Pod/payment-service-75b897858-a912b",
                "namespace": "production",
                "timestamp": "2026-08-06T19:55:12Z",
                "count": 12
            },
            {
                "id": "evt-104",
                "type": "Normal",
                "reason": "Scheduled",
                "message": "Successfully assigned production/frontend-web-54b9d888f4-z92aa to minikube-node-01",
                "object": "Pod/frontend-web-54b9d888f4-z92aa",
                "namespace": "production",
                "timestamp": "2026-07-20T09:00:01Z",
                "count": 1
            }
        ]

    def get_logs(self, pod_name: str, lines: int = 100) -> str:
        if "payment-service" in pod_name:
            return """2026-08-06T20:00:01.102Z [INFO] [main] Starting Payment Service v2.4.1 on port 8080...
2026-08-06T20:00:01.450Z [INFO] [db.config] Reading environment variables: DB_HOST=postgres-prod.internal, DB_PORT=5432, DB_TIMEOUT_MS=3000
2026-08-06T20:00:01.890Z [INFO] [db.connection] Initiating PostgreSQL connection pool (min=5, max=20)...
2026-08-06T20:00:04.895Z [ERROR] [db.connection] Failed to connect to PostgreSQL at postgres-prod.internal:5432. Error: ConnectionTimedOut: Connection attempt timed out after 3000ms
2026-08-06T20:00:04.896Z [WARN] [db.retry] Connection failed. Retry attempt 1/3 in 1000ms...
2026-08-06T20:00:08.899Z [ERROR] [db.connection] Failed to connect to PostgreSQL at postgres-prod.internal:5432. Error: ConnectionTimedOut: Connection attempt timed out after 3000ms
2026-08-06T20:00:08.900Z [CRITICAL] [main] Fatal initialization error: Cannot connect to primary database. SocketException: Connection timed out. Exiting application with exit code 1.
2026-08-06T20:00:08.905Z [INFO] [main] Process terminated. Stack trace:
  at com.company.payment.db.PostgresPool.connect(PostgresPool.java:142)
  at com.company.payment.Application.main(Application.java:58)"""
        elif "analytics-worker" in pod_name:
            return """2026-08-06T19:39:45.001Z [INFO] [analytics] Processing batch #89120 (50,000 records)...
2026-08-06T19:39:50.412Z [WARN] [jvm.gc] GC worker warning: Heap memory utilization at 96.4% (1975MB / 2048MB). High pressure!
2026-08-06T19:39:58.890Z [ERROR] [java.lang.OutOfMemoryError] Java heap space memory limits exceeded! Allocated 2048MiB exhausted.
2026-08-06T19:40:00.000Z [FATAL] [kernel] Kubelet terminated process 4812 (java) with SIGKILL (Exit Code 137) - OOMKilled by Linux kernel cgroup driver."""
        else:
            return f"""2026-08-06T20:05:00.000Z [INFO] Container {pod_name} initialized.
2026-08-06T20:05:01.120Z [INFO] Health check endpoints listening on HTTP :8080/healthz.
2026-08-06T20:05:02.400Z [INFO] Request metrics logged: 200 OK GET /api/v1/status (12ms).
2026-08-06T20:05:05.100Z [INFO] Heartbeat active. Pod operation healthy."""

mock_state = K8sMockStateEngine()

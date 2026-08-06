import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "KubePilot API"
    assert data["status"] == "online"

def test_cluster_health_endpoint():
    response = client.get("/api/v1/cluster/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "total_pods" in data
    assert data["total_pods"] > 0

def test_get_pods():
    response = client.get("/api/v1/pods")
    assert response.status_code == 200
    pods = response.json()
    assert isinstance(pods, list)
    assert len(pods) > 0

def test_get_pod_detail():
    response = client.get("/api/v1/pods/production/payment-service-75b897858-a912b")
    assert response.status_code == 200
    pod = response.json()
    assert pod["name"] == "payment-service-75b897858-a912b"
    assert pod["status"] == "CrashLoopBackOff"

def test_get_pod_logs():
    response = client.get("/api/v1/logs/payment-service-75b897858-a912b?namespace=production")
    assert response.status_code == 200
    data = response.json()
    assert "DB_HOST=postgres-prod.internal" in data["logs"]

def test_get_deployments():
    response = client.get("/api/v1/deployments")
    assert response.status_code == 200
    deps = response.json()
    assert len(deps) > 0

def test_get_nodes():
    response = client.get("/api/v1/nodes")
    assert response.status_code == 200
    nodes = response.json()
    assert len(nodes) > 0

def test_prometheus_metrics_endpoint():
    response = client.get("/api/v1/metrics/prometheus")
    assert response.status_code == 200
    assert "kubepilot_cluster_pods_total" in response.text
    assert "kubepilot_cpu_utilization_percent" in response.text

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ai_log_analyzer():
    payload = {
        "pod_name": "payment-service-75b897858-a912b",
        "namespace": "production",
        "custom_prompt": "Diagnose database connectivity issue"
    }
    response = client.post("/api/v1/ai/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["pod_name"] == "payment-service-75b897858-a912b"
    assert data["severity"] in ["Low", "Medium", "High", "Critical"]
    assert "Database" in data["root_cause"] or "Connection" in data["root_cause"]
    assert len(data["suggested_fixes"]) > 0

def test_ai_deployment_summary():
    payload = {
        "timeframe": "24h",
        "namespace": "production"
    }
    response = client.post("/api/v1/ai/summary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary_text" in data
    assert len(data["restarted_pods"]) > 0

from fastapi import APIRouter, Response
from app.schemas.k8s import ResourceMetrics
from app.services.kubernetes.k8s_service import k8s_service
from app.utils.prometheus import generate_prometheus_metrics

router = APIRouter()

@router.get("/metrics", response_model=ResourceMetrics)
def get_metrics():
    """Retrieve time-series resource utilization metrics for CPU and Memory."""
    return k8s_service.get_metrics()

@router.get("/metrics/prometheus")
def get_prometheus_metrics():
    """Expose Prometheus-compatible exposition format metrics for observability scrapers."""
    health_data = k8s_service.get_cluster_health()
    metrics_text = generate_prometheus_metrics(health_data)
    return Response(content=metrics_text, media_type="text/plain; version=0.0.4")

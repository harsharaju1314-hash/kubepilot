from fastapi import APIRouter
from app.schemas.k8s import ResourceMetrics
from app.services.k8s_service import k8s_service

router = APIRouter()

@router.get("/metrics", response_model=ResourceMetrics)
def get_metrics():
    """Retrieve time-series resource utilization metrics for CPU and Memory."""
    return k8s_service.get_metrics()

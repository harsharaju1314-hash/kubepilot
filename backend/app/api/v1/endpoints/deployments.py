from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.k8s import DeploymentItem
from app.services.k8s_service import k8s_service

router = APIRouter()

@router.get("/deployments", response_model=List[DeploymentItem])
def get_deployments(namespace: Optional[str] = Query(None)):
    """Retrieve Kubernetes deployments with replica status and strategy."""
    return k8s_service.get_deployments(namespace=namespace)

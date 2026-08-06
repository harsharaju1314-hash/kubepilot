from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.k8s import ServiceItem
from app.services.kubernetes.k8s_service import k8s_service

router = APIRouter()

@router.get("/services", response_model=List[ServiceItem])
def get_services(namespace: Optional[str] = Query(None)):
    """Retrieve Kubernetes services, ports, and ClusterIPs."""
    return k8s_service.get_services(namespace=namespace)

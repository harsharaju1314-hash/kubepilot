from typing import List
from fastapi import APIRouter
from app.schemas.k8s import NodeItem
from app.services.kubernetes.k8s_service import k8s_service

router = APIRouter()

@router.get("/nodes", response_model=List[NodeItem])
def get_nodes():
    """Retrieve Kubernetes cluster nodes and resource capacity/usage."""
    return k8s_service.get_nodes()

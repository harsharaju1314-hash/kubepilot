from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.k8s import ClusterHealth, NamespaceItem, K8sEvent
from app.services.kubernetes.k8s_service import k8s_service

router = APIRouter()

@router.get("/cluster/health", response_model=ClusterHealth)
def get_cluster_health():
    """Retrieve aggregate Kubernetes cluster health summary, metrics, and warnings."""
    return k8s_service.get_cluster_health()

@router.get("/namespaces", response_model=List[NamespaceItem])
def get_namespaces():
    """Retrieve list of all Kubernetes namespaces."""
    return k8s_service.get_namespaces()

@router.get("/events", response_model=List[K8sEvent])
def get_events(namespace: Optional[str] = Query(None)):
    """Retrieve Kubernetes cluster warnings and lifecycle events."""
    return k8s_service.get_events(namespace=namespace)

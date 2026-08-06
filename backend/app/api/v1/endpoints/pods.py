from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.k8s import PodItem, PodDetail
from app.services.k8s_service import k8s_service

router = APIRouter()

@router.get("/pods", response_model=List[PodItem])
def get_pods(
    namespace: Optional[str] = Query(None, description="Filter by namespace"),
    status: Optional[str] = Query(None, description="Filter by status e.g. Running, CrashLoopBackOff")
):
    """Retrieve all Kubernetes pods across namespaces with optional status filters."""
    return k8s_service.get_pods(namespace=namespace, status=status)

@router.get("/pods/{namespace}/{name}", response_model=PodDetail)
def get_pod_detail(namespace: str, name: str):
    """Retrieve detailed specs, environment variables, events, and container info for a pod."""
    pod = k8s_service.get_pod_detail(namespace=namespace, name=name)
    if not pod:
        raise HTTPException(status_code=404, detail=f"Pod '{name}' in namespace '{namespace}' not found.")
    return pod

@router.get("/logs/{pod_name}")
def get_pod_logs(
    pod_name: str,
    namespace: str = Query("production"),
    lines: int = Query(100, ge=1, le=2000)
):
    """Fetch container stdout/stderr logs for a specific pod."""
    logs = k8s_service.get_pod_logs(namespace=namespace, name=pod_name, lines=lines)
    return {"pod_name": pod_name, "namespace": namespace, "lines": lines, "logs": logs}

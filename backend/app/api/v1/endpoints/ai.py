from fastapi import APIRouter, HTTPException
from app.schemas.ai import (
    LogAnalysisRequest, LogAnalysisResponse,
    DeploymentSummaryRequest, DeploymentSummaryResponse
)
from app.services.kubernetes.k8s_service import k8s_service
from app.services.ai.ai_service import ai_service

router = APIRouter()

@router.post("/ai/analyze", response_model=LogAnalysisResponse)
def analyze_pod_logs(request: LogAnalysisRequest):
    """Analyze pod logs and metadata using LangChain AI to diagnose failure root causes and suggest remedies."""
    logs = k8s_service.get_pod_logs(namespace=request.namespace, name=request.pod_name, lines=request.lines or 100)
    pod_detail = k8s_service.get_pod_detail(namespace=request.namespace, name=request.pod_name)
    
    if not logs:
        raise HTTPException(status_code=400, detail=f"No logs available for pod '{request.pod_name}'.")

    return ai_service.analyze_pod_logs(
        pod_name=request.pod_name,
        namespace=request.namespace,
        logs=logs,
        pod_spec=pod_detail,
        custom_prompt=request.custom_prompt
    )

@router.post("/ai/summary", response_model=DeploymentSummaryResponse)
def generate_deployment_summary(request: DeploymentSummaryRequest):
    """Generate an AI-driven summary of recent cluster changes, scaling events, and deployments ('What changed today?')."""
    return ai_service.generate_deployment_summary(
        timeframe=request.timeframe,
        namespace=request.namespace
    )

from typing import List, Optional
from pydantic import BaseModel, Field

class LogAnalysisRequest(BaseModel):
    pod_name: str
    namespace: str
    container_name: Optional[str] = None
    custom_prompt: Optional[str] = None
    lines: Optional[int] = 100

class LogAnalysisResponse(BaseModel):
    pod_name: str
    namespace: str
    severity: str = Field(description="Low, Medium, High, or Critical")
    root_cause: str = Field(description="Primary root cause identified from logs and pod metadata")
    explanation: str = Field(description="Detailed technical breakdown of why this error occurred")
    suggested_fixes: List[str] = Field(description="Step-by-step actionable recommendations to resolve the issue")
    doc_links: List[str] = Field(default=[], description="Relevant Kubernetes or cloud documentation links")
    analyzed_at: str

class DeploymentSummaryRequest(BaseModel):
    timeframe: str = Field(default="24h", description="e.g. 1h, 6h, 24h, 7d")
    namespace: Optional[str] = None

class DeploymentSummaryResponse(BaseModel):
    timeframe: str
    summary_text: str
    new_deployments: List[str]
    failed_deployments: List[str]
    restarted_pods: List[str]
    scaling_events: List[str]
    deleted_resources: List[str]
    generated_at: str

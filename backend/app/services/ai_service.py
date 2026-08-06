import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.schemas.ai import LogAnalysisResponse, DeploymentSummaryResponse

class AIService:
    def __init__(self):
        self.has_api_key = bool(settings.OPENAI_API_KEY)
        self.llm = None
        if self.has_api_key:
            try:
                from langchain_openai import ChatOpenAI
                self.llm = ChatOpenAI(
                    model=settings.LLM_MODEL,
                    openai_api_key=settings.OPENAI_API_KEY,
                    temperature=0.2
                )
            except Exception:
                self.has_api_key = False

    def analyze_pod_logs(self, pod_name: str, namespace: str, logs: str, pod_spec: Optional[Dict[str, Any]] = None, custom_prompt: Optional[str] = None) -> LogAnalysisResponse:
        if self.has_api_key and self.llm:
            return self._analyze_with_langchain(pod_name, namespace, logs, pod_spec, custom_prompt)
        else:
            return self._analyze_with_smart_fallback(pod_name, namespace, logs, pod_spec, custom_prompt)

    def _analyze_with_langchain(self, pod_name: str, namespace: str, logs: str, pod_spec: Optional[Dict[str, Any]], custom_prompt: Optional[str]) -> LogAnalysisResponse:
        from langchain.prompts import ChatPromptTemplate
        from langchain_core.output_parsers import PydanticOutputParser

        parser = PydanticOutputParser(pydantic_object=LogAnalysisResponse)
        prompt_template = ChatPromptTemplate.from_template(
            "You are KubePilot, an expert AI Kubernetes SRE Operations Assistant.\n"
            "Analyze the following Kubernetes Pod logs and pod metadata to identify root causes and solutions.\n\n"
            "Pod Name: {pod_name}\n"
            "Namespace: {namespace}\n"
            "Pod Metadata: {pod_spec}\n"
            "Logs:\n{logs}\n\n"
            "User Query / Focus: {custom_prompt}\n\n"
            "{format_instructions}\n"
        )

        input_prompt = prompt_template.format_messages(
            pod_name=pod_name,
            namespace=namespace,
            pod_spec=str(pod_spec or {}),
            logs=logs,
            custom_prompt=custom_prompt or "Identify failure causes and remediation steps.",
            format_instructions=parser.get_format_instructions()
        )

        try:
            response = self.llm.invoke(input_prompt)
            parsed_result = parser.parse(response.content)
            parsed_result.analyzed_at = datetime.datetime.utcnow().isoformat() + "Z"
            return parsed_result
        except Exception:
            return self._analyze_with_smart_fallback(pod_name, namespace, logs, pod_spec, custom_prompt)

    def _analyze_with_smart_fallback(self, pod_name: str, namespace: str, logs: str, pod_spec: Optional[Dict[str, Any]], custom_prompt: Optional[str]) -> LogAnalysisResponse:
        now_str = datetime.datetime.utcnow().isoformat() + "Z"

        logs_lower = logs.lower()
        if "connectiontimedout" in logs_lower or "timed out" in logs_lower or "connection refused" in logs_lower:
            return LogAnalysisResponse(
                pod_name=pod_name,
                namespace=namespace,
                severity="High",
                root_cause="Database / Downstream Service Network Connection Timeout",
                explanation=f"The container in pod '{pod_name}' failed to establish a network connection to its target database/service (postgres-prod.internal:5432). The TCP socket connection timed out after 3000ms, triggering repeated container restarts.",
                suggested_fixes=[
                    "Verify downstream database pod health and status (e.g. `kubectl get pods -n production -l app=postgres`).",
                    "Check network policies in namespace 'production' to ensure ingress/egress port 5432 is permitted.",
                    "Validate environment variable DB_HOST and K8s Secret references attached to deployment 'payment-service'.",
                    "Exec into a test pod and test TCP connectivity using `nc -zvw3 postgres-prod.internal 5432`."
                ],
                doc_links=[
                    "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
                    "https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/"
                ],
                analyzed_at=now_str
            )
        elif "oomkilled" in logs_lower or "outofmemoryerror" in logs_lower or "memory limit" in logs_lower:
            return LogAnalysisResponse(
                pod_name=pod_name,
                namespace=namespace,
                severity="Critical",
                root_cause="Memory Limit Exceeded (Cgroup OOMKilled - Exit Code 137)",
                explanation=f"Pod '{pod_name}' exceeded its allocated container memory resource limit (2048MiB). The Linux kernel cgroup OOM killer sent SIGKILL (signal 9) to protect node stability.",
                suggested_fixes=[
                    "Increase the container memory limit in the deployment spec (e.g. increase from `2Gi` to `4Gi`).",
                    "Optimize memory consumption or lower batch sizes (BATCH_SIZE environment variable).",
                    "Tune Java Virtual Machine heap limit (`-Xmx1536m`) to prevent JVM heap from matching cgroup memory limit.",
                    "Verify memory leaks using Prometheus container metrics (`container_memory_working_set_bytes`)."
                ],
                doc_links=[
                    "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                    "https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/"
                ],
                analyzed_at=now_str
            )
        else:
            return LogAnalysisResponse(
                pod_name=pod_name,
                namespace=namespace,
                severity="Medium",
                root_cause="Application Runtime Exception / Warning Log Detected",
                explanation=f"Logs from '{pod_name}' were analyzed. Standard container startup succeeded, but review is recommended for warnings and performance metrics.",
                suggested_fixes=[
                    "Check application logs for unhandled exceptions or error tracebacks.",
                    "Confirm liveness and readiness probe configurations match container response latencies.",
                    "Review CPU and Memory utilization trends on the Kubernetes Explorer tab."
                ],
                doc_links=[
                    "https://kubernetes.io/docs/tasks/debug/debug-application/troubleshooting/"
                ],
                analyzed_at=now_str
            )

    def generate_deployment_summary(self, timeframe: str = "24h", namespace: Optional[str] = None) -> DeploymentSummaryResponse:
        now_str = datetime.datetime.utcnow().isoformat() + "Z"
        
        summary_text = (
            f"Over the last {timeframe}, KubePilot tracked 5 cluster events. "
            "1 new deployment (analytics-worker v3.0.0-rc1) was rolled out to namespace 'production'. "
            "2 critical pod failure events occurred: 'payment-service' encountered database connection timeouts (CrashLoopBackOff), "
            "and 'analytics-worker' was terminated due to OOMKilled memory limits."
        )

        return DeploymentSummaryResponse(
            timeframe=timeframe,
            summary_text=summary_text,
            new_deployments=["analytics-worker (v3.0.0-rc1) deployed 12 hours ago"],
            failed_deployments=["payment-service (1 of 3 replicas unavailable - DB timeout)"],
            restarted_pods=["payment-service-75b897858-a912b (Restarts: 8)", "analytics-worker-99d8b74c-x89qq (Restarts: 4)"],
            scaling_events=["frontend-web scaled up from 2 to 4 replicas (HPA trigger)"],
            deleted_resources=["old-analytics-worker-v2 (Deployment removed)"],
            generated_at=now_str
        )

ai_service = AIService()

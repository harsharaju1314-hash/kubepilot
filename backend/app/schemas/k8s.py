from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ContainerInfo(BaseModel):
    name: str
    image: str
    ready: bool
    restart_count: int
    state: str
    started_at: Optional[str] = None

class PodItem(BaseModel):
    name: str
    namespace: str
    status: str  # Running, CrashLoopBackOff, Pending, Error, Terminating, Completed
    ip: Optional[str] = "10.244.0.12"
    node: str
    creation_timestamp: str
    restart_count: int
    containers: List[ContainerInfo]
    cpu_usage_m: int = 120
    memory_usage_mb: int = 256
    labels: Dict[str, str] = {}
    environment_vars: Dict[str, str] = {}

class PodDetail(PodItem):
    events: List[Dict[str, Any]] = []
    node_selector: Dict[str, str] = {}
    service_account: str = "default"

class DeploymentItem(BaseModel):
    name: str
    namespace: str
    replicas: int
    ready_replicas: int
    updated_replicas: int
    available_replicas: int
    creation_timestamp: str
    strategy: str = "RollingUpdate"
    labels: Dict[str, str] = {}
    images: List[str] = []

class ServiceItem(BaseModel):
    name: str
    namespace: str
    type: str  # ClusterIP, NodePort, LoadBalancer
    cluster_ip: str
    external_ip: Optional[str] = None
    ports: List[Dict[str, Any]]
    selector: Dict[str, str] = {}
    creation_timestamp: str

class NodeItem(BaseModel):
    name: str
    status: str  # Ready, NotReady
    role: str    # control-plane, worker
    version: str
    internal_ip: str
    cpu_capacity_cores: float
    cpu_usage_percentage: float
    memory_capacity_gb: float
    memory_usage_percentage: float
    pods_count: int
    os_image: str

class K8sEvent(BaseModel):
    id: str
    type: str  # Warning, Normal
    reason: str
    message: str
    object: str
    namespace: str
    timestamp: str
    count: int

class ClusterHealth(BaseModel):
    status: str  # Healthy, Warning, Critical
    total_pods: int
    running_pods: int
    failed_pods: int
    pending_pods: int
    deployments_count: int
    services_count: int
    namespaces_count: int
    nodes_count: int
    ready_nodes: int
    cpu_utilization_percent: float
    memory_utilization_percent: float
    active_warnings: int
    timestamp: str

class ResourceMetrics(BaseModel):
    timestamp: str
    total_cpu_cores: float
    used_cpu_cores: float
    total_memory_gb: float
    used_memory_gb: float
    cpu_history: List[Dict[str, Any]]
    memory_history: List[Dict[str, Any]]

class NamespaceItem(BaseModel):
    name: str
    status: str
    creation_timestamp: str
    pods_count: int

export interface ContainerInfo {
  name: string;
  image: string;
  ready: boolean;
  restart_count: number;
  state: string;
  started_at?: string;
}

export interface PodItem {
  name: string;
  namespace: string;
  status: 'Running' | 'CrashLoopBackOff' | 'Pending' | 'OOMKilled' | 'Error' | 'Completed' | string;
  ip?: string;
  node: string;
  creation_timestamp: string;
  restart_count: number;
  containers: ContainerInfo[];
  cpu_usage_m: number;
  memory_usage_mb: number;
  labels: Record<string, string>;
  environment_vars: Record<string, string>;
}

export interface PodDetail extends PodItem {
  events: K8sEvent[];
  node_selector: Record<string, string>;
  service_account: string;
}

export interface DeploymentItem {
  name: string;
  namespace: string;
  replicas: number;
  ready_replicas: number;
  updated_replicas: number;
  available_replicas: number;
  creation_timestamp: string;
  strategy: string;
  labels: Record<string, string>;
  images: string[];
}

export interface ServiceItem {
  name: string;
  namespace: string;
  type: string;
  cluster_ip: string;
  external_ip?: string;
  ports: Array<{ name?: string; port: number; targetPort: number; protocol: string }>;
  selector: Record<string, string>;
  creation_timestamp: string;
}

export interface NodeItem {
  name: string;
  status: string;
  role: string;
  version: string;
  internal_ip: string;
  cpu_capacity_cores: number;
  cpu_usage_percentage: number;
  memory_capacity_gb: number;
  memory_usage_percentage: number;
  pods_count: number;
  os_image: string;
}

export interface K8sEvent {
  id: string;
  type: 'Warning' | 'Normal' | string;
  reason: string;
  message: string;
  object: string;
  namespace: string;
  timestamp: string;
  count: number;
}

export interface ClusterHealth {
  status: 'Healthy' | 'Warning' | 'Critical';
  total_pods: number;
  running_pods: number;
  failed_pods: number;
  pending_pods: number;
  deployments_count: number;
  services_count: number;
  namespaces_count: number;
  nodes_count: number;
  ready_nodes: number;
  cpu_utilization_percent: number;
  memory_utilization_percent: number;
  active_warnings: number;
  timestamp: string;
}

export interface ResourceMetrics {
  timestamp: string;
  total_cpu_cores: number;
  used_cpu_cores: number;
  total_memory_gb: number;
  used_memory_gb: number;
  cpu_history: Array<{ time: string; cpu: number }>;
  memory_history: Array<{ time: string; memory: number }>;
}

export interface LogAnalysisResponse {
  pod_name: string;
  namespace: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  root_cause: string;
  explanation: string;
  suggested_fixes: string[];
  doc_links: string[];
  analyzed_at: string;
}

export interface DeploymentSummaryResponse {
  timeframe: string;
  summary_text: string;
  new_deployments: string[];
  failed_deployments: string[];
  restarted_pods: string[];
  scaling_events: string[];
  deleted_resources: string[];
  generated_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: 'warning' | 'info' | 'critical';
  timestamp: string;
  namespace: string;
}

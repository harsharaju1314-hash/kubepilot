import axios from 'axios';
import {
  ClusterHealth, PodItem, PodDetail, DeploymentItem, ServiceItem,
  NodeItem, K8sEvent, ResourceMetrics, LogAnalysisResponse,
  DeploymentSummaryResponse, NotificationItem
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Cluster & Nodes
  getClusterHealth: async (): Promise<ClusterHealth> => {
    const res = await apiClient.get<ClusterHealth>('/cluster/health');
    return res.data;
  },
  getNamespaces: async (): Promise<Array<{ name: string; status: string; pods_count: number }>> => {
    const res = await apiClient.get('/namespaces');
    return res.data;
  },
  getNodes: async (): Promise<NodeItem[]> => {
    const res = await apiClient.get<NodeItem[]>('/nodes');
    return res.data;
  },

  // Resources
  getPods: async (namespace?: string, status?: string): Promise<PodItem[]> => {
    const res = await apiClient.get<PodItem[]>('/pods', {
      params: { namespace, status },
    });
    return res.data;
  },
  getPodDetail: async (namespace: string, name: string): Promise<PodDetail> => {
    const res = await apiClient.get<PodDetail>(`/pods/${namespace}/${name}`);
    return res.data;
  },
  getPodLogs: async (podName: string, namespace: string = 'production', lines: number = 100): Promise<string> => {
    const res = await apiClient.get<{ logs: string }>(`/logs/${podName}`, {
      params: { namespace, lines },
    });
    return res.data.logs;
  },
  getDeployments: async (namespace?: string): Promise<DeploymentItem[]> => {
    const res = await apiClient.get<DeploymentItem[]>('/deployments', {
      params: { namespace },
    });
    return res.data;
  },
  getServices: async (namespace?: string): Promise<ServiceItem[]> => {
    const res = await apiClient.get<ServiceItem[]>('/services', {
      params: { namespace },
    });
    return res.data;
  },
  getEvents: async (namespace?: string): Promise<K8sEvent[]> => {
    const res = await apiClient.get<K8sEvent[]>('/events', {
      params: { namespace },
    });
    return res.data;
  },
  getMetrics: async (): Promise<ResourceMetrics> => {
    const res = await apiClient.get<ResourceMetrics>('/metrics');
    return res.data;
  },

  // AI Operations
  analyzePodLogs: async (podName: string, namespace: string, customPrompt?: string): Promise<LogAnalysisResponse> => {
    const res = await apiClient.post<LogAnalysisResponse>('/ai/analyze', {
      pod_name: podName,
      namespace: namespace,
      custom_prompt: customPrompt,
      lines: 100,
    });
    return res.data;
  },
  getDeploymentSummary: async (timeframe: string = '24h', namespace?: string): Promise<DeploymentSummaryResponse> => {
    const res = await apiClient.post<DeploymentSummaryResponse>('/ai/summary', {
      timeframe,
      namespace,
    });
    return res.data;
  },

  // Notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiClient.get<NotificationItem[]>('/notifications');
    return res.data;
  }
};

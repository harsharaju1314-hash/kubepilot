'use client';

import React from 'react';
import { PodItem, DeploymentItem, ServiceItem, NodeItem } from '../../types';
import { Box, Layers, Network, Server, Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface Props {
  activeTab: 'pods' | 'deployments' | 'services' | 'nodes';
  pods: PodItem[];
  deployments: DeploymentItem[];
  services: ServiceItem[];
  nodes: NodeItem[];
  onSelectPod: (pod: PodItem) => void;
  onAnalyzePod: (pod: PodItem) => void;
}

export const ExplorerTable: React.FC<Props> = ({
  activeTab,
  pods,
  deployments,
  services,
  nodes,
  onSelectPod,
  onAnalyzePod
}) => {
  const renderStatusPill = (status: string) => {
    let color = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    if (status === 'Running' || status === 'Ready' || status === 'Active') {
      color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    } else if (status === 'CrashLoopBackOff' || status === 'OOMKilled' || status === 'Error' || status === 'Failed') {
      color = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
    } else if (status === 'Pending') {
      color = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-[#1E293B] overflow-hidden">
      <div className="overflow-x-auto">
        {/* PODS TABLE */}
        {activeTab === 'pods' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161F30] border-b border-[#1E293B] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Pod Name</th>
                <th className="py-3.5 px-6">Namespace</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Restarts</th>
                <th className="py-3.5 px-6">CPU / Memory</th>
                <th className="py-3.5 px-6">Node</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-sm text-slate-200 font-mono">
              {pods.map((pod) => (
                <tr key={pod.name} className="hover:bg-[#1A2332]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-cyan-400" />
                    {pod.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{pod.namespace}</span>
                  </td>
                  <td className="py-4 px-6">{renderStatusPill(pod.status)}</td>
                  <td className="py-4 px-6">
                    <span className={pod.restart_count > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {pod.restart_count}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {pod.cpu_usage_m}m / {pod.memory_usage_mb}MB
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">{pod.node}</td>
                  <td className="py-4 px-6 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectPod(pod)}
                        className="px-3 py-1.5 rounded-lg bg-[#1F293D] hover:bg-slate-700 text-slate-200 text-xs font-medium border border-[#334155] transition-all flex items-center gap-1.5"
                      >
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        Logs
                      </button>
                      <button
                        onClick={() => onAnalyzePod(pod)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                        Analyze AI
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* DEPLOYMENTS TABLE */}
        {activeTab === 'deployments' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161F30] border-b border-[#1E293B] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Deployment Name</th>
                <th className="py-3.5 px-6">Namespace</th>
                <th className="py-3.5 px-6">Replicas (Ready/Total)</th>
                <th className="py-3.5 px-6">Strategy</th>
                <th className="py-3.5 px-6">Images</th>
                <th className="py-3.5 px-6">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-sm text-slate-200 font-mono">
              {deployments.map((dep) => (
                <tr key={dep.name} className="hover:bg-[#1A2332]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {dep.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{dep.namespace}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={dep.ready_replicas < dep.replicas ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      {dep.ready_replicas}/{dep.replicas}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">{dep.strategy}</td>
                  <td className="py-4 px-6 text-xs text-cyan-400 truncate max-w-xs">{dep.images.join(', ')}</td>
                  <td className="py-4 px-6 text-xs text-slate-400">{new Date(dep.creation_timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* SERVICES TABLE */}
        {activeTab === 'services' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161F30] border-b border-[#1E293B] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Service Name</th>
                <th className="py-3.5 px-6">Namespace</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Cluster IP</th>
                <th className="py-3.5 px-6">External IP</th>
                <th className="py-3.5 px-6">Ports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-sm text-slate-200 font-mono">
              {services.map((svc) => (
                <tr key={svc.name} className="hover:bg-[#1A2332]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-emerald-400" />
                    {svc.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{svc.namespace}</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-300">{svc.type}</td>
                  <td className="py-4 px-6 text-xs text-slate-400">{svc.cluster_ip}</td>
                  <td className="py-4 px-6 text-xs text-cyan-400">{svc.external_ip || '<None>'}</td>
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {svc.ports.map(p => `${p.port}:${p.targetPort}/${p.protocol}`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* NODES TABLE */}
        {activeTab === 'nodes' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161F30] border-b border-[#1E293B] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Node Name</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">CPU Usage</th>
                <th className="py-3.5 px-6">Memory Usage</th>
                <th className="py-3.5 px-6">Internal IP</th>
                <th className="py-3.5 px-6">K8s Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-sm text-slate-200 font-mono">
              {nodes.map((node) => (
                <tr key={node.name} className="hover:bg-[#1A2332]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    {node.name}
                  </td>
                  <td className="py-4 px-6">{renderStatusPill(node.status)}</td>
                  <td className="py-4 px-6 text-xs text-slate-300">{node.role}</td>
                  <td className="py-4 px-6 text-xs text-cyan-400">{node.cpu_usage_percentage}%</td>
                  <td className="py-4 px-6 text-xs text-purple-400">{node.memory_usage_percentage}%</td>
                  <td className="py-4 px-6 text-xs text-slate-400">{node.internal_ip}</td>
                  <td className="py-4 px-6 text-xs text-slate-400">{node.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

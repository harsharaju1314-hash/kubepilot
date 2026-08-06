'use client';

import React from 'react';
import { ClusterHealth } from '../../types';
import { Activity, Server, Box, Layers, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface Props {
  health: ClusterHealth | null;
}

export const ClusterHealthCard: React.FC<Props> = ({ health }) => {
  if (!health) {
    return <div className="h-32 glass-panel rounded-xl animate-pulse"></div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Healthy</span>;
      case 'Warning':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> Warning</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold"><Flame className="w-3.5 h-3.5" /> Critical</span>;
    }
  };

  const statItems = [
    { label: 'Running Pods', value: `${health.running_pods}/${health.total_pods}`, color: 'text-cyan-400', icon: Box },
    { label: 'Failed / Restarts', value: health.failed_pods, color: health.failed_pods > 0 ? 'text-rose-400' : 'text-slate-300', icon: AlertTriangle },
    { label: 'Deployments', value: health.deployments_count, color: 'text-purple-400', icon: Layers },
    { label: 'Cluster Nodes', value: `${health.ready_nodes}/${health.nodes_count}`, color: 'text-emerald-400', icon: Server },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Cluster Health Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time status metrics and node telemetry</p>
        </div>
        {getStatusBadge(health.status)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{item.label}</span>
                <Icon className="w-4 h-4 opacity-70" />
              </div>
              <div className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

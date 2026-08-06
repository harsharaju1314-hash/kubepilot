'use client';

import React from 'react';
import { ClusterHealth } from '../../types';
import { Activity, Server, Box, Layers, AlertTriangle, CheckCircle, Flame, Sparkles, ArrowUpRight } from 'lucide-react';

interface Props {
  health: ClusterHealth | null;
  onQuickDiagnose?: () => void;
  onQuickSummary?: () => void;
}

export const ClusterHealthCard: React.FC<Props> = ({ health, onQuickDiagnose, onQuickSummary }) => {
  if (!health) {
    return <div className="h-44 glass-panel rounded-2xl animate-pulse"></div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Cluster Operating Healthy
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-lg shadow-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Action Recommended ({health.failed_pods} Unhealthy Pods)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold shadow-lg shadow-rose-500/10">
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            Critical Issues Detected
          </span>
        );
    }
  };

  const statItems = [
    { label: 'Running Pods', value: `${health.running_pods}/${health.total_pods}`, desc: '6 healthy microservices', color: 'text-cyan-400', icon: Box },
    { label: 'Restarts / Crashes', value: health.failed_pods, desc: 'Requires AI diagnosis', color: health.failed_pods > 0 ? 'text-rose-400 font-bold' : 'text-slate-300', icon: AlertTriangle },
    { label: 'Active Deployments', value: health.deployments_count, desc: '5 apps in production', color: 'text-purple-400', icon: Layers },
    { label: 'Node Readiness', value: `${health.ready_nodes}/${health.nodes_count}`, desc: '100% capacity ready', color: 'text-emerald-400', icon: Server },
  ];

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[#1E293B] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Cluster Health & Topology</h2>
            {getStatusBadge(health.status)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time automated telemetry across {health.namespaces_count} namespaces and {health.nodes_count} Kubernetes nodes.
          </p>
        </div>

        {/* Quick SRE Action Shortcuts */}
        <div className="flex items-center gap-3">
          {onQuickDiagnose && (
            <button
              onClick={onQuickDiagnose}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Diagnose Failures with AI
            </button>
          )}
        </div>
      </div>

      {/* Grid Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#141C2B]/80 p-5 rounded-2xl border border-[#1E293B] hover:border-cyan-500/30 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                <div className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold font-mono ${item.color}`}>{item.value}</div>
              <div className="text-[11px] text-slate-500 mt-1 font-sans">{item.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

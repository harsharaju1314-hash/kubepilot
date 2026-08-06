'use client';

import React from 'react';
import { ClusterHealth } from '../../types';
import { Activity, Server, Box, Layers, AlertTriangle, CheckCircle, Flame, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  health: ClusterHealth | null;
  onQuickDiagnose?: () => void;
}

export const ClusterHealthCard: React.FC<Props> = ({ health, onQuickDiagnose }) => {
  if (!health) {
    return <div className="h-48 glass-slate rounded-3xl animate-pulse"></div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-black font-mono-code shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            CLUSTER OPERATIONAL
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black font-mono-code shadow-lg shadow-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            ATTENTION REQUIRED ({health.failed_pods} UNHEALTHY)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black font-mono-code shadow-lg shadow-rose-500/10">
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            CRITICAL POD FAILURE
          </span>
        );
    }
  };

  const statItems = [
    { label: 'Running Pods', value: `${health.running_pods}/${health.total_pods}`, sub: 'Microservices active', color: 'text-cyan-300', icon: Box },
    { label: 'Unhealthy Pods', value: health.failed_pods, sub: 'Needs AI diagnosis', color: health.failed_pods > 0 ? 'text-rose-400 font-bold' : 'text-slate-300', icon: AlertTriangle },
    { label: 'Deployments', value: health.deployments_count, sub: 'Production workloads', color: 'text-indigo-300', icon: Layers },
    { label: 'Node Readiness', value: `${health.ready_nodes}/${health.nodes_count}`, sub: 'Control plane active', color: 'text-emerald-300', icon: Server },
  ];

  return (
    <div className="glass-slate p-6 md:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
      {/* Topology Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#1E3A5F] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight font-mono-code flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              CLUSTER TOPOLOGY & TELEMETRY
            </h2>
            {getStatusBadge(health.status)}
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono-code">
            Real-time synchronization across {health.namespaces_count} namespaces and {health.nodes_count} cluster nodes.
          </p>
        </div>

        {onQuickDiagnose && (
          <button
            onClick={onQuickDiagnose}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            Run AI Diagnosis
          </button>
        )}
      </div>

      {/* Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#152540] p-5 rounded-2xl border border-[#1E3A5F] hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-300">{item.label}</span>
                <div className="w-8 h-8 rounded-xl bg-[#0F1A30] flex items-center justify-center text-cyan-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-3xl font-black font-mono-code ${item.color}`}>{item.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">{item.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { PodItem } from '../../types';
import { Box, Sparkles, Terminal, ShieldAlert, Cpu, HardDrive, CheckCircle2, AlertOctagon, Filter } from 'lucide-react';

interface Props {
  pods: PodItem[];
  onSelectPod: (pod: PodItem) => void;
  onAnalyzePod: (pod: PodItem) => void;
}

export const PodStatusGrid: React.FC<Props> = ({ pods, onSelectPod, onAnalyzePod }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'unhealthy' | 'running'>('all');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');

  const namespaces = ['all', ...Array.from(new Set(pods.map(p => p.namespace)))];

  const filteredPods = pods.filter(pod => {
    const isUnhealthy = pod.status !== 'Running' && pod.status !== 'Completed';
    if (statusFilter === 'unhealthy' && !isUnhealthy) return false;
    if (statusFilter === 'running' && isUnhealthy) return false;
    if (selectedNamespace !== 'all' && pod.namespace !== selectedNamespace) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1625]/60 p-4 rounded-2xl border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Workload Status Grid
              <span className="text-xs font-mono font-normal text-slate-400">({filteredPods.length} pods)</span>
            </h3>
            <p className="text-xs text-slate-400">Filter and inspect container health telemetry across cluster namespaces</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#151E2E] p-1 rounded-xl border border-[#1E293B]">
            {[
              { id: 'all', label: 'All Pods' },
              { id: 'unhealthy', label: '⚠️ Unhealthy Only' },
              { id: 'running', label: '✅ Running' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="bg-[#151E2E] border border-[#1E293B] rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none"
          >
            {namespaces.map(ns => (
              <option key={ns} value={ns}>ns: {ns}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPods.map((pod) => {
          const isFailing = pod.status !== 'Running' && pod.status !== 'Completed';
          return (
            <div
              key={pod.name}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden group ${
                isFailing
                  ? 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-transparent shadow-xl shadow-rose-950/20'
                  : 'border-[#1E293B] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10'
              }`}
            >
              {isFailing && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#182234] text-slate-300 border border-[#1E293B]">
                    {pod.namespace}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                      isFailing
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isFailing ? <AlertOctagon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {pod.status}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-extrabold text-white text-sm font-mono truncate mb-3 group-hover:text-cyan-400 transition-colors">
                  {pod.name}
                </h4>

                {/* Micro Resource Bars */}
                <div className="bg-[#0F1625] p-3 rounded-xl border border-[#1E293B] space-y-2 font-mono text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Restarts:</span>
                    <span className={pod.restart_count > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {pod.restart_count} times
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">CPU Usage:</span>
                      <span className="text-cyan-400 font-bold">{pod.cpu_usage_m}m</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (pod.cpu_usage_m / 1000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Memory Usage:</span>
                      <span className="text-purple-400 font-bold">{pod.memory_usage_mb}MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (pod.memory_usage_mb / 2048) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onSelectPod(pod)}
                  className="flex-1 py-2 rounded-xl bg-[#182336] hover:bg-slate-800 text-slate-200 text-xs font-bold border border-[#1E293B] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  View Logs
                </button>
                <button
                  onClick={() => onAnalyzePod(pod)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500/25 via-purple-500/25 to-pink-500/25 hover:from-cyan-500/40 hover:to-purple-500/40 text-cyan-200 text-xs font-black border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
                  AI Troubleshoot
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

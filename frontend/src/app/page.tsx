'use client';

import React, { useState, useEffect } from 'react';
import { ClusterHealthCard } from '../components/dashboard/ClusterHealthCard';
import { ResourceMetricsChart } from '../components/dashboard/ResourceMetricsChart';
import { ExplorerTable } from '../components/explorer/ExplorerTable';
import { PodDetailModal } from '../components/pod/PodDetailModal';
import { AILogAnalysisModal } from '../components/ai/AILogAnalysisModal';
import { DeploymentSummaryPanel } from '../components/ai/DeploymentSummaryPanel';
import { api } from '../services/api';
import { ClusterHealth, ResourceMetrics, PodItem } from '../types';
import { Sparkles, ArrowRight, ShieldAlert, Terminal, Send, CheckCircle, Zap, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [health, setHealth] = useState<ClusterHealth | null>(null);
  const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
  const [allPods, setAllPods] = useState<PodItem[]>([]);
  const [selectedPod, setSelectedPod] = useState<PodItem | null>(null);
  const [aiPod, setAiPod] = useState<PodItem | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [hData, mData, podsData] = await Promise.all([
        api.getClusterHealth(),
        api.getMetrics(),
        api.getPods()
      ]);
      setHealth(hData);
      setMetrics(mData);
      setAllPods(podsData);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    }
  };

  const failingPods = allPods.filter(p => p.status !== 'Running' && p.status !== 'Completed');

  const suggestedPrompts = [
    { label: '⚡ Diagnose Payment DB Timeout', targetPod: 'payment-service-75b897858-a912b' },
    { label: '🔍 Analyze Analytics OOMKilled Pod', targetPod: 'analytics-worker-99d8b74c-x89qq' },
    { label: '📊 Summarize 24h Cluster Changes', action: 'summary' },
  ];

  const handlePromptClick = (prompt: typeof suggestedPrompts[0]) => {
    if (prompt.targetPod) {
      const found = allPods.find(p => p.name === prompt.targetPod);
      if (found) setAiPod(found);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Humanized AI Copilot Hero & Prompt Bar */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-br from-[#121A28] via-[#152136] to-[#0E1523] shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold shadow-md shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            AI SRE Co-Pilot Ready
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            How can KubePilot assist your cluster operations today?
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            KubePilot constantly monitors logs, memory usage, and pod restart loops. Click a quick suggestion below or select an unhealthy workload for immediate root cause analysis.
          </p>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(item)}
                className="px-3.5 py-2 rounded-xl bg-[#182336] hover:bg-cyan-500/20 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/30 transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cluster Health Summary */}
      <ClusterHealthCard
        health={health}
        onQuickDiagnose={() => {
          if (failingPods.length > 0) setAiPod(failingPods[0]);
        }}
      />

      {/* Resource Utilization Charts */}
      <ResourceMetricsChart metrics={metrics} />

      {/* Visual Workloads Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Active Kubernetes Workloads
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any pod card to inspect stdout/stderr logs or trigger AI analysis</p>
          </div>
          <Link
            href="/explorer"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 bg-[#141C2B] px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            Explore all {allPods.length} pods <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPods.map((pod) => {
            const isFailing = pod.status !== 'Running' && pod.status !== 'Completed';
            return (
              <div
                key={pod.name}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                  isFailing
                    ? 'border-rose-500/40 bg-rose-500/5 shadow-lg shadow-rose-500/10'
                    : 'border-[#1E293B] hover:border-cyan-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {pod.namespace}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isFailing
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {pod.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm font-mono truncate mb-2">{pod.name}</h4>

                  <div className="space-y-1 text-xs text-slate-400 font-mono mb-4">
                    <div className="flex justify-between">
                      <span>Restarts:</span>
                      <span className={pod.restart_count > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {pod.restart_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPU / Memory:</span>
                      <span className="text-cyan-400">{pod.cpu_usage_m}m / {pod.memory_usage_mb}MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#1E293B]/60">
                  <button
                    onClick={() => setSelectedPod(pod)}
                    className="flex-1 py-2 rounded-xl bg-[#1A2332] hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-[#1E293B] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Logs
                  </button>
                  <button
                    onClick={() => setAiPod(pod)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Diagnosis
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deployment Change Summarizer */}
      <DeploymentSummaryPanel />

      {/* Modals */}
      {selectedPod && (
        <PodDetailModal
          pod={selectedPod}
          onClose={() => setSelectedPod(null)}
          onAnalyzeAI={(p) => {
            setSelectedPod(null);
            setAiPod(p);
          }}
        />
      )}

      {aiPod && (
        <AILogAnalysisModal
          pod={aiPod}
          onClose={() => setAiPod(null)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { ClusterHealthCard } from '../components/dashboard/ClusterHealthCard';
import { ResourceMetricsChart } from '../components/dashboard/ResourceMetricsChart';
import { PodStatusGrid } from '../components/dashboard/PodStatusGrid';
import { PodDetailModal } from '../components/pod/PodDetailModal';
import { AILogAnalysisModal } from '../components/ai/AILogAnalysisModal';
import { DeploymentSummaryPanel } from '../components/ai/DeploymentSummaryPanel';
import { api } from '../services/api';
import { ClusterHealth, ResourceMetrics, PodItem } from '../types';
import { Sparkles, ArrowRight, ShieldAlert, Terminal, Send, CheckCircle, Zap, Cpu, Bot } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [health, setHealth] = useState<ClusterHealth | null>(null);
  const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
  const [allPods, setAllPods] = useState<PodItem[]>([]);
  const [selectedPod, setSelectedPod] = useState<PodItem | null>(null);
  const [aiPod, setAiPod] = useState<PodItem | null>(null);

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
    { label: '⚡ Diagnose Payment DB Connection Timeout', targetPod: 'payment-service-75b897858-a912b' },
    { label: '🔍 Troubleshoot Analytics Worker OOMKilled', targetPod: 'analytics-worker-99d8b74c-x89qq' },
  ];

  const handlePromptClick = (prompt: typeof suggestedPrompts[0]) => {
    if (prompt.targetPod) {
      const found = allPods.find(p => p.name === prompt.targetPod);
      if (found) setAiPod(found);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 bg-grid-pattern">
      {/* AI Copilot Hero & Quick Prompts */}
      <div className="glass-panel glass-panel-glow p-6 md:p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#131F37] to-[#0A0F1D] shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-black shadow-lg shadow-cyan-500/10">
            <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
            AI SRE Copilot Active
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Autonomous Kubernetes Diagnostics & Intelligence
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            KubePilot monitors cluster telemetry in real-time. Select any workload below for one-click LLM log diagnosis or ask for change summaries.
          </p>

          {/* Prompt Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(item)}
                className="px-4 py-2.5 rounded-2xl bg-[#172338] hover:bg-cyan-500/20 text-cyan-200 hover:text-white text-xs font-bold border border-cyan-500/35 transition-all flex items-center gap-2 shadow-md hover:scale-105"
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

      {/* Workload Status Grid */}
      <PodStatusGrid
        pods={allPods}
        onSelectPod={(p) => setSelectedPod(p)}
        onAnalyzePod={(p) => setAiPod(p)}
      />

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

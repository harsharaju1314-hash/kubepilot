'use client';

import React, { useState, useEffect } from 'react';
import { ClusterHealthCard } from '../components/dashboard/ClusterHealthCard';
import { ResourceMetricsChart } from '../components/dashboard/ResourceMetricsChart';
import { ExplorerTable } from '../components/explorer/ExplorerTable';
import { PodDetailModal } from '../components/pod/PodDetailModal';
import { AILogAnalysisModal } from '../components/ai/AILogAnalysisModal';
import { api } from '../services/api';
import { ClusterHealth, ResourceMetrics, PodItem } from '../types';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [health, setHealth] = useState<ClusterHealth | null>(null);
  const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
  const [failingPods, setFailingPods] = useState<PodItem[]>([]);
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
      setFailingPods(podsData.filter(p => p.status !== 'Running' && p.status !== 'Completed'));
    } catch (err) {
      console.error('Error loading dashboard data', err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden bg-gradient-to-r from-[#131A27] via-[#162032] to-[#121824]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI Kubernetes Operations Engine Active
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            KubePilot Autonomous Operations
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Monitor workloads, inspect pod logs in real time, and diagnose CrashLoopBackOff or database connection timeouts instantly using AI.
          </p>
        </div>
      </div>

      {/* Cluster Health Summary */}
      <ClusterHealthCard health={health} />

      {/* Resource Utilization Charts */}
      <ResourceMetricsChart metrics={metrics} />

      {/* Active Workload Alerts Section */}
      {failingPods.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Unhealthy Workloads Requiring AI Diagnosis</h3>
            </div>
            <Link
              href="/explorer"
              className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              View all pods <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ExplorerTable
            activeTab="pods"
            pods={failingPods}
            deployments={[]}
            services={[]}
            nodes={[]}
            onSelectPod={(p) => setSelectedPod(p)}
            onAnalyzePod={(p) => setAiPod(p)}
          />
        </div>
      )}

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

'use client';

import React, { useState, useEffect } from 'react';
import { DeploymentSummaryPanel } from '../../components/ai/DeploymentSummaryPanel';
import { AILogAnalysisModal } from '../../components/ai/AILogAnalysisModal';
import { api } from '../../services/api';
import { PodItem } from '../../types';
import { Sparkles, Box, AlertTriangle, ChevronRight } from 'lucide-react';

export default function AIPage() {
  const [pods, setPods] = useState<PodItem[]>([]);
  const [selectedPod, setSelectedPod] = useState<PodItem | null>(null);

  useEffect(() => {
    loadPods();
  }, []);

  const loadPods = async () => {
    try {
      const data = await api.getPods();
      setPods(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          AI Operations & Troubleshooting Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Powered by LangChain & OpenAI/Ollama LLM models for root cause log analysis and deployment change summarization.
        </p>
      </div>

      {/* Deployment Change Summarizer ("What changed today?") */}
      <DeploymentSummaryPanel />

      {/* Interactive Pod Selector for AI Log Analysis */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Box className="w-5 h-5 text-cyan-400" />
          Select a Pod for One-Click AI Log Analysis
        </h2>
        <p className="text-xs text-slate-400">Click any pod below to automatically extract logs and run LLM root-cause diagnosis:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pods.map((pod) => (
            <div
              key={pod.name}
              onClick={() => setSelectedPod(pod)}
              className="bg-[#141C2B] hover:bg-[#1A2332] p-4 rounded-xl border border-[#1E293B] hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  <span>{pod.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  ns: {pod.namespace} | status:{' '}
                  <span className={pod.status === 'Running' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {pod.status}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis Modal */}
      {selectedPod && (
        <AILogAnalysisModal
          pod={selectedPod}
          onClose={() => setSelectedPod(null)}
        />
      )}
    </div>
  );
}

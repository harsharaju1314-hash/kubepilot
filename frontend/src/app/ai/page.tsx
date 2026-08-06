'use client';

import React, { useState, useEffect } from 'react';
import { DeploymentSummaryPanel } from '../../components/ai/DeploymentSummaryPanel';
import { AILogAnalysisModal } from '../../components/ai/AILogAnalysisModal';
import { api } from '../../services/api';
import { PodItem } from '../../types';
import { Sparkles, Box, ChevronRight, Bot, Cpu } from 'lucide-react';

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
    <div className="space-y-8 max-w-7xl mx-auto pb-16 bg-cyber-grid">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight font-mono-code flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-[#7000FF] to-[#FF0055] flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          AI OPERATIONS & DIAGNOSTICS CENTER
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono-code">
          LangChain AI engine analyzing container logs, stack traces, and pod failure metrics
        </p>
      </div>

      {/* Deployment Change Summarizer */}
      <DeploymentSummaryPanel />

      {/* Interactive Workload Selector */}
      <div className="glass-cyber p-6 md:p-8 rounded-3xl border border-cyan-500/30 space-y-4 shadow-2xl">
        <h2 className="text-lg font-extrabold text-white font-mono-code flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Select Workload for One-Click AI Log Analysis
        </h2>
        <p className="text-xs text-slate-400 font-mono-code">Click any active pod below to run instant LLM root-cause diagnosis:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pods.map((pod) => (
            <div
              key={pod.name}
              onClick={() => setSelectedPod(pod)}
              className="bg-[#0B132B] hover:bg-[#121D38] p-4 rounded-2xl border border-[#1E293B] hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center gap-2 font-mono-code text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  <span>{pod.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code mt-1">
                  ns: {pod.namespace} | status:{' '}
                  <span className={pod.status === 'Running' ? 'text-[#00FF87] font-bold' : 'text-[#FF0055] font-bold'}>
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

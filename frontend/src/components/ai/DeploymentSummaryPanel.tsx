'use client';

import React, { useState, useEffect } from 'react';
import { DeploymentSummaryResponse } from '../../types';
import { api } from '../../services/api';
import { Sparkles, Calendar, ArrowUpRight, ShieldAlert, RefreshCw, Layers } from 'lucide-react';

export const DeploymentSummaryPanel: React.FC = () => {
  const [summary, setSummary] = useState<DeploymentSummaryResponse | null>(null);
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSummary();
  }, [timeframe]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getDeploymentSummary(timeframe);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Deployment & Change Summary
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">"What changed today in the cluster?"</p>
        </div>

        <div className="flex items-center gap-2">
          {(['1h', '6h', '24h', '7d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === t
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-[#1A2332] text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={fetchSummary}
            className="p-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Generating AI change report...</div>
      ) : summary ? (
        <div className="space-y-6">
          <div className="bg-[#141C2B] p-5 rounded-xl border border-purple-500/20 text-sm text-slate-200 leading-relaxed font-sans">
            {summary.summary_text}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> New Deployments
              </h4>
              <ul className="space-y-2 text-xs font-mono">
                {summary.new_deployments.map((d, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#161F30] p-4 rounded-xl border border-[#1E293B]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Failed / Restarted Pods
              </h4>
              <ul className="space-y-2 text-xs font-mono">
                {summary.restarted_pods.map((p, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

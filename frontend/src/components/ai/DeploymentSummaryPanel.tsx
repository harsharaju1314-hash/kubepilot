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
    <div className="glass-cyber p-6 md:p-8 rounded-3xl border border-purple-500/30 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-xl font-black text-white font-mono-code flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            AI DEPLOYMENT & CHANGE INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono-code">"What changed today in the cluster?"</p>
        </div>

        <div className="flex items-center gap-2">
          {(['1h', '6h', '24h', '7d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold transition-all ${
                timeframe === t
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-[#0B132B] text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={fetchSummary}
            className="p-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#1E293B]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-mono-code text-xs">Generating AI change report...</div>
      ) : summary ? (
        <div className="space-y-6">
          <div className="bg-[#0B132B] p-5 rounded-2xl border border-purple-500/30 text-xs text-slate-200 leading-relaxed font-sans shadow-inner">
            {summary.summary_text}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0D162B] p-5 rounded-2xl border border-[#1E293B]">
              <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" /> New Deployments
              </h4>
              <ul className="space-y-2 text-xs font-mono-code">
                {summary.new_deployments.map((d, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0D162B] p-5 rounded-2xl border border-[#1E293B]">
              <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-[#FF0055] mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Incident & Restart Events
              </h4>
              <ul className="space-y-2 text-xs font-mono-code">
                {summary.restarted_pods.map((p, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF0055] shadow-sm shadow-rose-500"></span>
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

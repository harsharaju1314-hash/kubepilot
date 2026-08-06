'use client';

import React, { useState, useEffect } from 'react';
import { PodItem, PodDetail } from '../../types';
import { api } from '../../services/api';
import { X, Terminal, Sparkles, Activity, FileText, Settings, ShieldAlert, Copy, Check } from 'lucide-react';

interface Props {
  pod: PodItem | null;
  onClose: () => void;
  onAnalyzeAI: (pod: PodItem) => void;
}

export const PodDetailModal: React.FC<Props> = ({ pod, onClose, onAnalyzeAI }) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'env' | 'events' | 'specs'>('logs');
  const [podDetail, setPodDetail] = useState<PodDetail | null>(null);
  const [logs, setLogs] = useState<string>('Streaming container stdout/stderr logs...');
  const [copied, setCopied] = useState(false);
  const [logFilter, setLogFilter] = useState('');

  useEffect(() => {
    if (pod) {
      loadPodData();
    }
  }, [pod]);

  const loadPodData = async () => {
    if (!pod) return;
    try {
      const [detailData, logsData] = await Promise.all([
        api.getPodDetail(pod.namespace, pod.name),
        api.getPodLogs(pod.name, pod.namespace, 200)
      ]);
      setPodDetail(detailData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
      setLogs('Error fetching stdout/stderr logs.');
    }
  };

  if (!pod) return null;

  const copyLogs = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs
    .split('\n')
    .filter(line => line.toLowerCase().includes(logFilter.toLowerCase()))
    .join('\n');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in">
      <div className="bg-[#060B18] border border-cyan-500/40 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden shadow-cyan-500/10">
        {/* Header */}
        <div className="p-6 border-b border-[#1E293B] bg-[#0B132B] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono-code">
                <h2 className="text-base font-extrabold text-white">{pod.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                  {pod.namespace}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono-code">
                Node: {pod.node} | IP: {pod.ip} | Restarts: {pod.restart_count}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAnalyzeAI(pod)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-[#7000FF] to-[#FF0055] hover:opacity-90 text-white text-xs font-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              Troubleshoot with AI
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Control */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0B111D] border-b border-[#1E293B]">
          <div className="flex gap-2">
            {[
              { id: 'logs', label: 'Container Logs', icon: FileText },
              { id: 'env', label: 'Environment Variables', icon: Settings },
              { id: 'events', label: 'Pod Events', icon: ShieldAlert },
              { id: 'specs', label: 'Specifications & Labels', icon: Activity },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#142038]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'logs' && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                placeholder="Filter logs (ERROR, Timeout)..."
                className="bg-[#070D19] border border-[#1E293B] rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono-code"
              />
              <button
                onClick={copyLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142038] text-slate-300 hover:text-white text-xs font-mono-code border border-[#1E293B]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto font-mono-code text-xs">
          {activeTab === 'logs' && (
            <div className="bg-[#030712] p-5 rounded-2xl border border-cyan-500/20 h-full overflow-y-auto text-slate-300 leading-relaxed space-y-1 shadow-inner">
              {filteredLogs.split('\n').map((line, idx) => {
                let colorClass = 'text-slate-300';
                if (line.includes('[ERROR]') || line.includes('CRITICAL') || line.includes('FATAL') || line.includes('Exception')) {
                  colorClass = 'text-[#FF0055] font-bold bg-[#FF0055]/10 px-1.5 py-0.5 rounded border border-rose-500/20';
                } else if (line.includes('[WARN]')) {
                  colorClass = 'text-[#FFB800] font-bold';
                } else if (line.includes('[INFO]')) {
                  colorClass = 'text-cyan-400/90';
                }
                return (
                  <div key={idx} className={colorClass}>
                    {line}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'env' && (
            <div className="glass-cyber p-6 rounded-2xl border border-[#1E293B]">
              <h3 className="font-bold text-sm text-slate-200 mb-4 font-mono-code">Active Environment Configuration</h3>
              <table className="w-full text-left font-mono-code">
                <thead>
                  <tr className="text-slate-400 border-b border-[#1E293B] text-[11px] uppercase">
                    <th className="pb-2">Variable Key</th>
                    <th className="pb-2">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60">
                  {Object.entries(pod.environment_vars || {}).map(([key, val]) => (
                    <tr key={key}>
                      <td className="py-3 text-cyan-400 font-bold">{key}</td>
                      <td className="py-3 text-slate-300">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3 font-sans">
              {(podDetail?.events || []).length === 0 ? (
                <p className="text-slate-500 py-8 text-center font-mono-code">No recent warning events logged for this pod.</p>
              ) : (
                podDetail?.events.map((evt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#0B132B] border border-amber-500/30 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-amber-300 font-mono-code">
                        <span>{evt.reason}</span>
                        <span className="text-xs font-normal text-slate-400">({evt.count} times)</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{evt.message}</p>
                      <span className="text-[10px] font-mono-code text-slate-500 mt-2 block">{evt.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="glass-cyber p-6 rounded-2xl border border-[#1E293B] space-y-4 font-sans">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono-code">Labels</h4>
                <div className="flex flex-wrap gap-2 font-mono-code text-xs">
                  {Object.entries(pod.labels || {}).map(([k, v]) => (
                    <span key={k} className="px-3 py-1 rounded-xl bg-[#142038] text-cyan-300 border border-slate-700">
                      {k}={v}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono-code">Containers</h4>
                {pod.containers.map(c => (
                  <div key={c.name} className="p-4 bg-[#0B132B] rounded-xl border border-[#1E293B] font-mono-code text-xs space-y-1">
                    <div className="text-white font-bold">{c.name}</div>
                    <div className="text-slate-400">Image: {c.image}</div>
                    <div className="text-slate-400">State: {c.state}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

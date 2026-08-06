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
  const [logs, setLogs] = useState<string>('Loading pod logs...');
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
      setLogs('Error fetching logs for pod.');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in">
      <div className="bg-[#0F1623] border border-[#1E293B] rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#1E293B] bg-[#131A27] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{pod.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{pod.namespace}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Node: {pod.node} | IP: {pod.ip} | Restarts: {pod.restart_count}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAnalyzeAI(pod)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-bounce" />
              Troubleshoot with AI
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#161F30] border-b border-[#1E293B]">
          <div className="flex gap-2">
            {[
              { id: 'logs', label: 'Container Logs', icon: FileText },
              { id: 'env', label: 'Environment Variables', icon: Settings },
              { id: 'events', label: 'Pod Events', icon: ShieldAlert },
              { id: 'specs', label: 'Specification & Labels', icon: Activity },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293D]'
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
                placeholder="Filter logs (e.g. ERROR, Timeout)..."
                className="bg-[#0F1623] border border-[#1E293B] rounded-lg px-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={copyLogs}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1A2332] text-slate-300 hover:text-white text-xs border border-[#1E293B]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs">
          {activeTab === 'logs' && (
            <div className="bg-[#090D14] p-4 rounded-xl border border-[#1E293B] h-full overflow-y-auto text-slate-300 leading-relaxed space-y-1">
              {filteredLogs.split('\n').map((line, idx) => {
                let colorClass = 'text-slate-300';
                if (line.includes('[ERROR]') || line.includes('CRITICAL') || line.includes('FATAL') || line.includes('Exception')) {
                  colorClass = 'text-rose-400 font-bold bg-rose-500/10 px-1 py-0.5 rounded';
                } else if (line.includes('[WARN]')) {
                  colorClass = 'text-amber-300 font-semibold';
                } else if (line.includes('[INFO]')) {
                  colorClass = 'text-cyan-400/80';
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
            <div className="glass-panel p-6 rounded-xl border border-[#1E293B]">
              <h3 className="font-semibold text-sm text-slate-200 mb-4 font-sans">Active Environment Configuration</h3>
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-[#1E293B]">
                    <th className="pb-2">Key</th>
                    <th className="pb-2">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {Object.entries(pod.environment_vars || {}).map(([key, val]) => (
                    <tr key={key}>
                      <td className="py-2.5 text-cyan-400 font-bold">{key}</td>
                      <td className="py-2.5 text-slate-300">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3 font-sans">
              {(podDetail?.events || []).length === 0 ? (
                <p className="text-slate-500 py-8 text-center">No recent event warnings recorded for this pod.</p>
              ) : (
                podDetail?.events.map((evt, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#131A27] border border-amber-500/30 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <span>{evt.reason}</span>
                        <span className="text-xs font-normal text-slate-400">({evt.count} times)</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{evt.message}</p>
                      <span className="text-[10px] text-slate-500 mt-2 block">{evt.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="glass-panel p-6 rounded-xl border border-[#1E293B] space-y-4 font-sans">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {Object.entries(pod.labels || {}).map(([k, v]) => (
                    <span key={k} className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {k}={v}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Containers</h4>
                {pod.containers.map(c => (
                  <div key={c.name} className="p-3 bg-[#131A27] rounded-lg border border-[#1E293B] font-mono text-xs space-y-1">
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

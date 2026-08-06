'use client';

import React, { useState, useEffect } from 'react';
import { PodItem, LogAnalysisResponse } from '../../types';
import { api } from '../../services/api';
import { Sparkles, X, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Send, ShieldAlert, BookOpen, Bot, Terminal, Copy, Check } from 'lucide-react';

interface Props {
  pod: PodItem | null;
  onClose: () => void;
}

export const AILogAnalysisModal: React.FC<Props> = ({ pod, onClose }) => {
  const [analysis, setAnalysis] = useState<LogAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (pod) {
      runAnalysis();
    }
  }, [pod]);

  const runAnalysis = async (prompt?: string) => {
    if (!pod) return;
    setLoading(true);
    try {
      const res = await api.analyzePodLogs(pod.name, pod.namespace, prompt || customPrompt);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!pod) return null;

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" /> CRITICAL SEVERITY
          </span>
        );
      case 'high':
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> HIGH SEVERITY
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/10">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> MEDIUM / LOW SEVERITY
          </span>
        );
    }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in">
      <div className="bg-[#0B111D] border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/15 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1E293B] bg-gradient-to-r from-[#111827] via-[#152136] to-[#0E1523] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                KubePilot AI SRE Diagnosis Report
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Workload: <span className="text-cyan-400 font-bold">{pod.name}</span> (namespace: {pod.namespace})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto shadow-lg shadow-cyan-500/20"></div>
              <p className="text-base font-bold text-slate-200">Analyzing log patterns & container events with LangChain...</p>
              <p className="text-xs text-slate-400">Correlating stack traces, DB timeout limits, and cgroup exit codes</p>
            </div>
          ) : analysis ? (
            <>
              {/* Severity & Root Cause */}
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-gradient-to-r from-[#141E30] to-[#121927]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Identified Failure Root Cause</span>
                  {getSeverityBadge(analysis.severity)}
                </div>
                <div className="text-xl font-bold text-white font-mono bg-[#0D1422] p-4 rounded-xl border border-[#1E293B] shadow-inner text-cyan-300">
                  {analysis.root_cause}
                </div>
              </div>

              {/* Technical Explanation */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Detailed Technical Breakdown</h3>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">{analysis.explanation}</p>
              </div>

              {/* Actionable Recommendations */}
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                  <CheckCircle className="w-4 h-4" /> Recommended Action Items & Solutions
                </h3>
                <div className="space-y-3">
                  {analysis.suggested_fixes.map((fix, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#141C2B] border border-[#1E293B] flex items-start justify-between gap-3 group hover:border-cyan-500/30 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-slate-200 font-mono leading-relaxed">{fix}</span>
                      </div>
                      <button
                        onClick={() => copyText(fix, idx)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-all opacity-70 group-hover:opacity-100"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation References */}
              {analysis.doc_links.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
                    <BookOpen className="w-4 h-4 text-purple-400" /> Official Kubernetes References
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis.doc_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#182336] hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105"
                      >
                        {link}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Refine Query Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#111827]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAnalysis(customPrompt);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask KubePilot a follow-up question (e.g. 'How to check PostgreSQL connectivity from payment pod?')"
              className="flex-1 bg-[#182336] border border-[#1E293B] focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Ask AI
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

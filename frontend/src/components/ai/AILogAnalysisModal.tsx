'use client';

import React, { useState, useEffect } from 'react';
import { PodItem, LogAnalysisResponse } from '../../types';
import { api } from '../../services/api';
import { Sparkles, X, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Send, ShieldAlert, BookOpen } from 'lucide-react';

interface Props {
  pod: PodItem | null;
  onClose: () => void;
}

export const AILogAnalysisModal: React.FC<Props> = ({ pod, onClose }) => {
  const [analysis, setAnalysis] = useState<LogAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');

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
        return <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> CRITICAL SEVERITY</span>;
      case 'high':
        return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> HIGH SEVERITY</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> MEDIUM / LOW SEVERITY</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in">
      <div className="bg-[#0F1623] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1E293B] bg-gradient-to-r from-[#131A27] to-[#161F30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                KubePilot AI SRE Root Cause Diagnosis
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Target Pod: <span className="text-cyan-400 font-semibold">{pod.name}</span> ({pod.namespace})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-300">Analyzing log patterns with LangChain & LLM...</p>
              <p className="text-xs text-slate-500">Correlating stack traces, container exit codes, and K8s events</p>
            </div>
          ) : analysis ? (
            <>
              {/* Severity & Root Cause */}
              <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identified Root Cause</h3>
                  {getSeverityBadge(analysis.severity)}
                </div>
                <div className="text-xl font-bold text-white font-mono bg-[#161F30] p-4 rounded-lg border border-[#1E293B]">
                  {analysis.root_cause}
                </div>
              </div>

              {/* Technical Explanation */}
              <div className="glass-panel p-6 rounded-xl border border-[#1E293B] space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technical Breakdown</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{analysis.explanation}</p>
              </div>

              {/* Actionable Recommendations */}
              <div className="glass-panel p-6 rounded-xl border border-emerald-500/20 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Recommended Action Items & Fixes
                </h3>
                <ul className="space-y-3">
                  {analysis.suggested_fixes.map((fix, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-200 bg-[#141C2B] p-3 rounded-lg border border-[#1E293B]">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-mono">{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* K8s Documentation Links */}
              {analysis.doc_links.length > 0 && (
                <div className="glass-panel p-6 rounded-xl border border-[#1E293B] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" /> Kubernetes Documentation & References
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis.doc_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-cyan-400 text-xs font-medium border border-cyan-500/30 flex items-center gap-2 transition-all"
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
        <div className="p-4 border-t border-[#1E293B] bg-[#131A27]">
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
              placeholder="Ask AI follow-up (e.g. 'How to test connectivity from payment pod?')"
              className="flex-1 bg-[#1A2332] border border-[#1E293B] focus:border-cyan-500/50 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Ask AI
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

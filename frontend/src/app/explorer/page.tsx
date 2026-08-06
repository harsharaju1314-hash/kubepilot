'use client';

import React, { useState, useEffect } from 'react';
import { ExplorerTable } from '../../components/explorer/ExplorerTable';
import { PodDetailModal } from '../../components/pod/PodDetailModal';
import { AILogAnalysisModal } from '../../components/ai/AILogAnalysisModal';
import { api } from '../../services/api';
import { PodItem, DeploymentItem, ServiceItem, NodeItem } from '../../types';
import { Box, Layers, Network, Server, Filter } from 'lucide-react';

export default function ExplorerPage() {
  const [activeTab, setActiveTab] = useState<'pods' | 'deployments' | 'services' | 'nodes'>('pods');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [namespaces, setNamespaces] = useState<string[]>([]);
  
  const [pods, setPods] = useState<PodItem[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  
  const [selectedPod, setSelectedPod] = useState<PodItem | null>(null);
  const [aiPod, setAiPod] = useState<PodItem | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [selectedNamespace]);

  const loadInitialData = async () => {
    try {
      const nsData = await api.getNamespaces();
      setNamespaces(['all', ...nsData.map(n => n.name)]);

      const nsFilter = selectedNamespace === 'all' ? undefined : selectedNamespace;
      
      const [podsRes, depsRes, svcsRes, nodesRes] = await Promise.all([
        api.getPods(nsFilter),
        api.getDeployments(nsFilter),
        api.getServices(nsFilter),
        api.getNodes()
      ]);

      setPods(podsRes);
      setDeployments(depsRes);
      setServices(svcsRes);
      setNodes(nodesRes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Kubernetes Resource Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">Browse, inspect logs, and debug cluster resources</p>
        </div>

        {/* Namespace Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Namespace:</span>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="bg-[#1A2332] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-cyan-400 font-mono focus:outline-none"
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1E293B] pb-3">
        {[
          { id: 'pods', label: `Pods (${pods.length})`, icon: Box },
          { id: 'deployments', label: `Deployments (${deployments.length})`, icon: Layers },
          { id: 'services', label: `Services (${services.length})`, icon: Network },
          { id: 'nodes', label: `Nodes (${nodes.length})`, icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A2332]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Resource Table */}
      <ExplorerTable
        activeTab={activeTab}
        pods={pods}
        deployments={deployments}
        services={services}
        nodes={nodes}
        onSelectPod={(p) => setSelectedPod(p)}
        onAnalyzePod={(p) => setAiPod(p)}
      />

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

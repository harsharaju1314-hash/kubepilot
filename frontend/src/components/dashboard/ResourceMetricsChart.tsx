'use client';

import React from 'react';
import { ResourceMetrics } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Cpu, HardDrive } from 'lucide-react';

interface Props {
  metrics: ResourceMetrics | null;
}

export const ResourceMetricsChart: React.FC<Props> = ({ metrics }) => {
  if (!metrics) {
    return <div className="h-64 glass-panel rounded-xl animate-pulse"></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CPU Usage Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1E293B]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-base">CPU Core Utilization</h3>
          </div>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {metrics.used_cpu_cores} / {metrics.total_cpu_cores} Cores
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.cpu_history}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#131A27', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1E293B]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white text-base">Memory Consumption</h3>
          </div>
          <span className="text-sm font-mono font-bold text-purple-400">
            {metrics.used_memory_gb} / {metrics.total_memory_gb} GB
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.memory_history}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#131A27', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="memory" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#memGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

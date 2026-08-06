'use client';

import React from 'react';
import { ResourceMetrics } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Cpu, HardDrive, Activity } from 'lucide-react';

interface Props {
  metrics: ResourceMetrics | null;
}

export const ResourceMetricsChart: React.FC<Props> = ({ metrics }) => {
  if (!metrics) {
    return <div className="h-64 glass-cyber rounded-3xl animate-pulse"></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CPU Usage Chart */}
      <div className="glass-cyber p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono-code">CPU Core Telemetry</h3>
              <p className="text-[10px] text-slate-400 font-mono-code">Real-time compute utilization</p>
            </div>
          </div>
          <span className="text-xs font-mono-code font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            {metrics.used_cpu_cores} / {metrics.total_cpu_cores} Cores
          </span>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.cpu_history}>
              <defs>
                <linearGradient id="cyberCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00F0FF', borderRadius: '12px', color: '#fff', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#00F0FF" strokeWidth={2.5} fillOpacity={1} fill="url(#cyberCpu)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage Chart */}
      <div className="glass-cyber p-6 rounded-3xl border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono-code">Memory RAM Telemetry</h3>
              <p className="text-[10px] text-slate-400 font-mono-code">RAM buffer allocation</p>
            </div>
          </div>
          <span className="text-xs font-mono-code font-black text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
            {metrics.used_memory_gb} / {metrics.total_memory_gb} GB
          </span>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.memory_history}>
              <defs>
                <linearGradient id="cyberMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9D00FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#9D00FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#9D00FF', borderRadius: '12px', color: '#fff', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="memory" stroke="#9D00FF" strokeWidth={2.5} fillOpacity={1} fill="url(#cyberMem)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

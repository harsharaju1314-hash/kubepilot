'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Cpu, Activity, Radio } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Command Center', href: '/', icon: LayoutDashboard },
    { name: 'Kubernetes Explorer', href: '/explorer', icon: Compass },
    { name: 'AI Operations Engine', href: '/ai', icon: Cpu },
  ];

  return (
    <aside className="w-72 bg-[#0F1A30]/90 border-r border-[#1E3A5F] flex flex-col h-screen sticky top-0 z-40 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#1E3A5F]/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-[#0F1A30] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F1A30] animate-ping"></span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wider flex items-center gap-1.5 font-mono-code">
              KUBEPILOT
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-code">Enterprise SRE</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono-code">
          System Control
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/25 via-cyan-500/15 to-transparent text-cyan-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#152540]'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Connection & Telemetry Radar */}
      <div className="p-4 border-t border-[#1E3A5F]/80">
        <div className="bg-[#152540] p-4 rounded-2xl border border-indigo-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-bold font-mono-code text-[11px]">Cluster Radar</span>
            </div>
            <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono-code">Node: minikube-01 (v1.28.3)</p>
        </div>
      </div>
    </aside>
  );
};

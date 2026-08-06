'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Cpu, Bell, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Kubernetes Explorer', href: '/explorer', icon: Compass },
    { name: 'AI Operations & Diagnosis', href: '/ai', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-[#0F1623] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#1E293B]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
            KubePilot <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400">Cloud-Native Ops Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A2332]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#1E293B]">
        <div className="glass-card p-3 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">Cluster Connection</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Simulator</span>
        </div>
      </div>
    </aside>
  );
};

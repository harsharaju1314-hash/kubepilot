'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Cpu, Bell, ShieldCheck, Activity, Terminal, Server } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Kubernetes Explorer', href: '/explorer', icon: Compass },
    { name: 'AI Operations Center', href: '/ai', icon: Cpu },
  ];

  return (
    <aside className="w-68 bg-[#0B111D] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 z-40 transition-all">
      {/* Brand Header */}
      <div className="h-20 flex items-center gap-3.5 px-6 border-b border-[#1E293B]">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0B111D] animate-ping"></span>
        </div>
        <div>
          <h1 className="font-black text-xl text-white tracking-tight flex items-center gap-2">
            KubePilot
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              AI v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Cloud-Native SRE Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          Operations Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141C2B]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* System Connection Footer */}
      <div className="p-4 border-t border-[#1E293B]">
        <div className="bg-[#141C2B] p-3.5 rounded-2xl border border-[#1E293B] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200 font-bold">K8s Connected</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Minikube v1.28.3 (Control Plane Ready)</p>
        </div>
      </div>
    </aside>
  );
};

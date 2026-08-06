'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, RefreshCw, ShieldAlert, Sparkles, User, Terminal } from 'lucide-react';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
  onRefresh?: () => void;
  onQuickAIQuery?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, onRefresh, onQuickAIQuery }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="h-20 bg-[#0B111D]/80 backdrop-blur-xl border-b border-[#1E293B] px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Humanized Greeting & Quick Search */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            👋 Welcome back, SRE Engineer
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">Cluster: minikube-prod-01 | Region: us-east-1</p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-80 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search pods, logs, deployments..."
            className="w-full bg-[#141C2B] border border-[#1E293B] focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Action Controls & Notifications */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141C2B] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] text-xs font-medium transition-all"
            title="Refresh Cluster Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Sync
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 rounded-xl bg-[#141C2B] hover:bg-slate-800 text-slate-300 border border-[#1E293B] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-84 bg-[#131A27] border border-cyan-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Cluster Warning Alerts
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  {notifications.length} active
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">All workloads operating normally</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-[#182234] border border-amber-500/20 text-xs">
                      <div className="font-bold text-amber-300 mb-1 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] leading-relaxed">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1E293B]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B111D] rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-white">Harsh (DevOps Lead)</div>
            <div className="text-[10px] text-slate-400">Admin Mode</div>
          </div>
        </div>
      </div>
    </header>
  );
};

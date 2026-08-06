'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, RefreshCw, ShieldAlert, User, Clock, Command } from 'lucide-react';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, onRefresh }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
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
    <header className="h-20 bg-[#0F1A30]/90 backdrop-blur-2xl border-b border-[#1E3A5F]/80 px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Command Bar Search */}
      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search workloads, pods, logs..."
            className="w-full bg-[#152540] border border-[#1E3A5F] focus:border-indigo-500/60 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-all font-mono-code"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono-code text-slate-400 border border-slate-700">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      {/* Live System Time & User Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#152540] border border-[#1E3A5F] text-xs font-mono-code text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr || 'LIVE'}</span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-[#152540] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E3A5F] text-xs font-bold transition-all"
            title="Sync Telemetry"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 rounded-xl bg-[#152540] hover:bg-slate-800 text-slate-300 border border-[#1E3A5F] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-lg shadow-rose-500/30">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-88 bg-[#132238] border border-indigo-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
                <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Cluster Incidents
                </h3>
                <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {notifications.length} alerts
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center font-mono-code">No active warnings</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-[#1A2C48] border border-amber-500/20 text-xs">
                      <div className="font-bold text-amber-300 mb-1 flex items-center justify-between font-mono-code">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] leading-relaxed">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1E3A5F]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0F1A30] rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-white font-mono-code">Harshavardhan</div>
            <div className="text-[10px] text-cyan-300 font-mono-code">DevOps Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';
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
    <header className="h-16 bg-[#0F1623]/80 backdrop-blur-md border-b border-[#1E293B] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search pods, namespaces, deployments, services..."
          className="w-full bg-[#1A2332] border border-[#1E293B] focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-[#1E293B] transition-all"
            title="Refresh Cluster State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg bg-[#1A2332] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-[#1E293B] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-[#131A27] border border-[#1E293B] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Cluster Warnings
                </h3>
                <span className="text-xs text-slate-500">{notifications.length} alerts</span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active warning notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-[#1A2332] border border-amber-500/20 text-xs">
                      <div className="font-medium text-amber-300 mb-1">{n.title}</div>
                      <div className="text-slate-400 line-clamp-2">{n.message}</div>
                      <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
                        <span>ns: {n.namespace}</span>
                        <span>{new Date(n.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1E293B]">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
            SRE
          </div>
          <span className="text-xs font-medium text-slate-300">DevOps Engineer</span>
        </div>
      </div>
    </header>
  );
};

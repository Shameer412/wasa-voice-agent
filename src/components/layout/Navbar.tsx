import React from 'react';
import { Menu, Search, Bell, LayoutDashboard, PlusCircle, BarChart3, Mic, Droplets, AlertCircle } from 'lucide-react';
import { AppPage } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  stats: { critical: number; open: number; escalated: number };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCount: number;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const navItems: { page: AppPage; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { page: 'submit', label: 'Submit Complaint', icon: <PlusCircle className="w-4 h-4" /> },
  { page: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { page: 'demo', label: 'Agent Demo', icon: <Mic className="w-4 h-4" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  stats,
  searchQuery,
  onSearchChange,
  filteredCount,
  currentPage,
  onNavigate,
}) => {
  return (
    <header className="flex-shrink-0 bg-[#080f1e]/95 backdrop-blur-xl border-b border-white/6 z-30">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/8 transition-all focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-white tracking-wide">WASA</span>
            <span className="text-[10px] text-zinc-500 block leading-none tracking-widest uppercase">Complaint Cell</span>
          </div>
        </div>

        {/* Search (only on dashboard) */}
        {currentPage === 'dashboard' && (
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets, callers, areas..."
              className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">
                {filteredCount} found
              </span>
            )}
          </div>
        )}

        {/* Page title on non-dashboard pages */}
        {currentPage !== 'dashboard' && (
          <div className="flex-1" />
        )}

        {/* Stats pills */}
        {stats.critical > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 animate-border-glow">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold text-red-400">{stats.critical} Critical</span>
          </div>
        )}

        <Bell className="w-5 h-5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors ml-1" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer ring-2 ring-white/10 hover:ring-white/20 transition-all">
          BA
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1 px-4 border-t border-white/4">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all relative ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.icon}
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full nav-glow-active" />
              )}
              {item.page === 'demo' && (
                <span className="flex h-1.5 w-1.5 absolute top-2 right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

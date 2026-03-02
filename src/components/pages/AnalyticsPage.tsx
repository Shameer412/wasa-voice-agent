import React, { useMemo } from 'react';
import {
  TrendingUp, Clock, CheckCircle2, AlertTriangle, Target,
  Users, Zap, BarChart2, ArrowUp, ArrowDown
} from 'lucide-react';
import { Ticket } from '../../types';

interface AnalyticsPageProps {
  tickets: Ticket[];
  agents: { id: string; name: string; role: string; assignedCount: number; available: boolean }[];
}

const categoryConfig = {
  'no-water':    { label: 'No Water',    icon: '🚱', color: '#06b6d4' },
  'dirty-water': { label: 'Dirty Water', icon: '🤢', color: '#ef4444' },
  'pipe-burst':  { label: 'Pipe Burst',  icon: '💥', color: '#f97316' },
  'sewerage':    { label: 'Sewerage',    icon: '🚧', color: '#a855f7' },
  'billing':     { label: 'Billing',     icon: '📄', color: '#eab308' },
  'other':       { label: 'Other',       icon: '❓', color: '#71717a' },
};

const StatCard: React.FC<{
  label: string; value: number | string; sub?: string;
  icon: React.ReactNode; color: string; trend?: 'up' | 'down' | 'neutral';
}> = ({ label, value, sub, icon, color, trend }) => (
  <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3 hover:border-white/12 transition-all">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        {icon}
      </div>
      {trend === 'up' && <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold"><ArrowUp className="w-3 h-3" /> +12%</div>}
      {trend === 'down' && <div className="flex items-center gap-1 text-red-400 text-xs font-semibold"><ArrowDown className="w-3 h-3" /> -8%</div>}
    </div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-zinc-400 font-medium mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  </div>
);

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ tickets, agents }) => {
  const stats = useMemo(() => {
    const today = tickets.filter(t => {
      const diff = Date.now() - new Date(t.createdAt).getTime();
      return diff < 24 * 60 * 60 * 1000;
    });
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved');
    const escalated = tickets.filter(t => t.status === 'escalated');
    const avgCallDuration = tickets.length > 0
      ? Math.round(tickets.reduce((s, t) => s + t.callDuration, 0) / tickets.length)
      : 0;
    const resolutionRate = tickets.length > 0 ? Math.round((resolved.length / tickets.length) * 100) : 0;

    // category breakdown
    const catMap: Record<string, number> = {};
    tickets.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + 1; });

    // area breakdown
    const areaMap: Record<string, number> = {};
    tickets.forEach(t => { areaMap[t.area] = (areaMap[t.area] || 0) + 1; });
    const topAreas = Object.entries(areaMap).sort((a, b) => b[1] - a[1]).slice(0, 7);

    const maxArea = topAreas[0]?.[1] || 1;

    return { today: today.length, resolved: resolved.length, critical: critical.length, escalated: escalated.length, avgCallDuration, resolutionRate, catMap, topAreas, maxArea };
  }, [tickets]);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="animate-slideInUp">
          <h1 className="text-xl font-bold text-white mb-1">Analytics Overview</h1>
          <p className="text-sm text-zinc-500">Real-time complaint intelligence for Lahore WASA operations</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Today's Complaints" value={stats.today} sub="Last 24 hours" icon={<TrendingUp className="w-5 h-5" style={{ color: '#06b6d4' }} />} color="#06b6d4" trend="up" />
          <StatCard label="Resolved" value={stats.resolved} sub={`${stats.resolutionRate}% resolution rate`} icon={<CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />} color="#10b981" trend="up" />
          <StatCard label="Critical Active" value={stats.critical} sub="Requires immediate action" icon={<AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />} color="#ef4444" trend="neutral" />
          <StatCard label="Avg Call Duration" value={formatDuration(stats.avgCallDuration)} sub="Per complaint call" icon={<Clock className="w-5 h-5" style={{ color: '#a855f7' }} />} color="#a855f7" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Category Breakdown */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" /> Complaints by Category
            </h3>
            <div className="space-y-3">
              {(Object.entries(categoryConfig) as [string, typeof categoryConfig[keyof typeof categoryConfig]][]).map(([key, cfg]) => {
                const count = stats.catMap[key] || 0;
                const max = Math.max(...Object.values(stats.catMap), 1);
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Area Ranking */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Top Areas by Complaints
            </h3>
            <div className="space-y-3">
              {stats.topAreas.map(([area, count], i) => (
                <div key={area} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-600 w-5">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-300">{area}</span>
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((count / stats.maxArea) * 100)}%`, background: i === 0 ? '#ef4444' : i < 3 ? '#f97316' : '#06b6d4' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Workload */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Agent Workload
            </h3>
            <div className="space-y-3">
              {agents.map(agent => {
                const maxL = Math.max(...agents.map(a => a.assignedCount), 1);
                const pct = Math.round((agent.assignedCount / maxL) * 100);
                return (
                  <div key={agent.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-300">{agent.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">{agent.assignedCount} tickets</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${agent.available ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: pct > 70 ? '#ef4444' : '#06b6d4' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Priority Distribution
            </h3>
            {(['critical', 'high', 'medium', 'low'] as const).map(p => {
              const count = tickets.filter(t => t.priority === p).length;
              const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
              const cfg = {
                critical: { color: '#ef4444', label: 'Critical' },
                high:     { color: '#f97316', label: 'High' },
                medium:   { color: '#eab308', label: 'Medium' },
                low:      { color: '#71717a', label: 'Low' },
              }[p];
              return (
                <div key={p} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-300">{cfg.label}</span>
                    <span className="text-xs text-zinc-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}50` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Status breakdown */}
            <div className="mt-5 pt-4 border-t border-white/6 grid grid-cols-2 gap-3">
              {(['new', 'in-progress', 'escalated', 'resolved'] as const).map(s => {
                const count = tickets.filter(t => t.status === s).length;
                const cfg = {
                  'new':         { color: 'text-zinc-300', label: 'New' },
                  'in-progress': { color: 'text-blue-400', label: 'In Progress' },
                  'escalated':   { color: 'text-orange-400', label: 'Escalated' },
                  'resolved':    { color: 'text-emerald-400', label: 'Resolved' },
                }[s];
                return (
                  <div key={s} className="text-center glass-card rounded-xl p-3">
                    <div className={`text-xl font-black ${cfg.color}`}>{count}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{cfg.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

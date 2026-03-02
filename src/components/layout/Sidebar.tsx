import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { Agent, Ticket } from '../../types';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  isOpen: boolean;
  view: 'kanban' | 'list';
  setView: (v: 'kanban' | 'list') => void;
  agents: Agent[];
  tickets: Ticket[];
  selectedPriority: string;
  onSelectPriority: (p: string) => void;
  selectedArea: string;
  onSelectArea: (a: string) => void;
  selectedAgent: string;
  onSelectAgent: (a: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, view, setView, agents, tickets,
  selectedPriority, onSelectPriority,
  selectedArea, onSelectArea,
  selectedAgent, onSelectAgent
}) => {

  const uniqueAreas = useMemo(() => {
    const set = new Set(tickets.map(t => t.area));
    return Array.from(set).sort();
  }, [tickets]);

  const priorities: { label: string, val: string, color: string, badgeBg: string, badgeText: string, count: number }[] = [
    { label: 'All Priorities', val: 'all', color: 'bg-zinc-500', badgeBg: 'bg-black/20', badgeText: 'text-zinc-400', count: tickets.length },
    { label: 'Critical', val: 'critical', color: 'bg-red', badgeBg: 'bg-red/10', badgeText: 'text-red', count: tickets.filter(t => t.priority === 'critical').length },
    { label: 'High', val: 'high', color: 'bg-amber', badgeBg: 'bg-amber/10', badgeText: 'text-amber', count: tickets.filter(t => t.priority === 'high').length },
    { label: 'Medium', val: 'medium', color: 'bg-cyan', badgeBg: 'bg-cyan/10', badgeText: 'text-cyan', count: tickets.filter(t => t.priority === 'medium').length },
    { label: 'Low', val: 'low', color: 'bg-zinc-400', badgeBg: 'bg-black/20', badgeText: 'text-zinc-500', count: tickets.filter(t => t.priority === 'low').length }
  ];

  return (
    <div className={`h-full border-r border-white/5 bg-surface/30 backdrop-blur-md flex flex-col pt-5 overflow-y-auto overflow-x-hidden custom-scrollbar flex-shrink-0 transition-all duration-300 z-10 ${isOpen ? 'w-[260px]' : 'w-0'}`}>

      {/* View Toggle */}
      <div className="px-4 mb-8">
        <div className="flex bg-black/20 border border-white/5 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setView('kanban')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'kanban' ? 'bg-surface text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            📋 Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'list' ? 'bg-surface text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            ☰ List
          </button>
        </div>
      </div>

      <div className="px-5 mb-3">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filters</h3>
      </div>

      {/* Priority Filter */}
      <div className="px-3 mb-8">
        <div className="flex flex-col gap-1">
          {priorities.map((p) => {
            const isActive = selectedPriority === p.val;
            return (
              <button
                key={p.val}
                onClick={() => onSelectPriority(p.val)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all focus:outline-none cursor-pointer ${isActive ? 'bg-primary/10 text-primary font-bold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.color} ${isActive ? 'shadow-[0_0_8px_currentColor]' : ''}`} />
                  {p.label}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-primary/20 text-primary' : `${p.badgeBg} ${p.badgeText}`}`}>
                  {p.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Area Filter */}
      <div className="px-5 mb-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Area</h3>
        <div className="relative group">
          <select
            value={selectedArea}
            onChange={(e) => onSelectArea(e.target.value)}
            className="w-full bg-black/20 border border-white/5 hover:border-white/10 rounded-xl py-2.5 pl-10 pr-8 text-sm font-medium text-zinc-200 appearance-none outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/10 cursor-pointer transition-all shadow-inner"
          >
            <option value="all">All Areas</option>
            {uniqueAreas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-cyan transition-colors pointer-events-none" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-zinc-500" />
        </div>
      </div>

      {/* Agents Online */}
      <div className="px-3 flex-1 mb-6">
        <div className="px-2 flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Team Availability</h3>
          {selectedAgent !== 'all' && (
            <button
              onClick={() => onSelectAgent('all')}
              className="text-[10px] font-bold text-cyan hover:text-cyan/80 transition-colors uppercase tracking-widest"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {agents.map(agent => {
            const isActive = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`flex items-center gap-3 text-left p-2.5 rounded-xl transition-all
                  ${isActive ? 'bg-cyan/10 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.2)]' : 'hover:bg-white/5'}
                `}
              >
                <div className="relative shrink-0">
                  <Avatar initials={agent.avatar} size="sm" className={`h-8 w-8 text-[11px] font-bold border-white/5 ${isActive ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan/20' : 'bg-surface text-zinc-300'}`} />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${agent.available ? 'bg-green shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${isActive ? 'text-white font-bold' : 'text-zinc-300 font-medium'}`}>{agent.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 flex-1 bg-black/30 rounded-full overflow-hidden shrink-0 shadow-inner">
                      <div className={`h-full transition-all rounded-full ${agent.assignedCount >= 5 ? 'bg-red' : 'bg-primary'}`} style={{ width: `${(agent.assignedCount / 5) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold tracking-tight leading-none pt-px">{agent.assignedCount}/5</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

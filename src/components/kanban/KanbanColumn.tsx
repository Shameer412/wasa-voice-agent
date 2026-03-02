import React, { useState } from 'react';
import { Status, Ticket, Agent } from '../../types';
import { TicketCard } from './TicketCard';
import { AlertCircle } from 'lucide-react';

interface KanbanColumnProps {
  status: Status;
  title: string;
  colorClass: string; // e.g., 'cyan', 'amber', 'red', 'green'
  tickets: Ticket[];
  agents: Agent[];
  onTicketClick: (ticket: Ticket) => void;
  onDrop: (ticketId: string, toStatus: Status) => void;
  onEscalate: (ticket: Ticket) => void;
  onAssign: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status, title, colorClass, tickets, agents, onTicketClick, onDrop, onEscalate, onAssign, onResolve
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onDrop(id, status);
    }
  };

  const getAgentInfo = (agentId: string | null) => {
    if (!agentId) return { name: null, avatar: null };
    const a = agents.find(ag => ag.id === agentId);
    return a ? { name: a.name, avatar: a.avatar } : { name: null, avatar: null };
  };

  const badgeColorStyles: Record<string, string> = {
    'cyan': 'bg-cyan',
    'amber': 'bg-amber',
    'red': 'bg-red',
    'green': 'bg-green'
  };

  const badgeTextStyles: Record<string, string> = {
    'cyan': 'text-cyan',
    'amber': 'text-amber',
    'red': 'text-red',
    'green': 'text-green'
  };

  // Warning for WIP limits
  const isOverLimit = status === 'in-progress' && tickets.length > 4;

  return (
    <div
      className={`flex flex-col h-full w-[350px] flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 relative ${isDragOver ? `bg-${colorClass}/10 ring-2 ring-${colorClass}/30 scale-[1.01]` : 'bg-surface/20 border border-white/5'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-surface/40 backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${badgeColorStyles[colorClass] || 'bg-zinc-500'} ${status === 'new' ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
          <h2 className={`font-bold tracking-wider text-[12px] uppercase ${badgeTextStyles[colorClass] || 'text-zinc-200'}`}>{title}</h2>
          <span className="font-mono bg-black/30 border border-white/5 text-zinc-300 font-bold text-[10px] px-2 py-0.5 rounded-full leading-none shadow-inner">
            {tickets.length}
          </span>
        </div>
        {isOverLimit && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-red bg-red/10 border border-red/20 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-3 h-3" /> LIMIT
          </div>
        )}
      </div>

      {/* Body */}
      <div
        className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10"
      >
        {tickets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
            <div className="w-12 h-12 rounded-full border border-dashed border-white/10 mb-4 flex items-center justify-center text-zinc-500 bg-black/10">
              <span className="text-xl font-light leading-none mb-0.5">+</span>
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-zinc-500">No {title} tickets</p>
          </div>
        ) : (
          <div className="flex flex-col h-full gap-3 pb-8">
            {tickets.map((t, idx) => {
              const { name, avatar } = getAgentInfo(t.status === 'escalated' ? t.escalatedTo : t.assignedTo);
              return (
                <div
                  key={t.id}
                  className="animate-staggerReveal relative group"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <TicketCard
                    ticket={t}
                    agentName={name}
                    agentAvatar={avatar}
                    onClick={() => onTicketClick(t)}
                    onEscalate={() => onEscalate(t)}
                    onAssign={() => onAssign(t)}
                    onResolve={() => onResolve(t)}
                    onDragStart={(e, id) => {
                      e.dataTransfer.setData('text/plain', id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => {}}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

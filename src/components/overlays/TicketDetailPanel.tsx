import React, { useState } from 'react';
import { Ticket, Agent } from '../../types';
import { useSLA } from '../../hooks/useSLA';
import { X, Bot, MapPin, Users, Hash, Phone, Tag, Mic } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface TicketDetailPanelProps {
  ticket: Ticket;
  agent: Agent | null;
  agents: Agent[];
  onClose: () => void;
  onEscalate: () => void;
  onAssign: (agentId: string) => void;
  onResolve: () => void;
}

export const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ ticket, agent, agents, onClose, onEscalate, onAssign, onResolve }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'transcript'>('details');
  const { display, colorClass } = useSLA(ticket);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timeAgo = (date: Date) => {
    const mins = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[440px] bg-surface/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-slideInRight overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 shrink-0 bg-black/20 relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3 text-white font-bold text-xl tracking-wide">
              <span className="text-cyan bg-cyan/10 p-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">{ticket.icon}</span>
              {ticket.ticketNo}
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <Badge priority={ticket.priority} />
            <span className="bg-black/40 border border-white/10 text-zinc-300 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-inner">
              {ticket.status.replace('-', ' ')}
            </span>
            <span className="bg-black/40 border border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-inner">
              <Mic className="w-3.5 h-3.5 text-cyan" /> URDU CALL
            </span>
            <div className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/40 border border-white/10 text-zinc-400 shadow-inner">
              {formatDuration(ticket.callDuration)}
            </div>
          </div>

          {/* AI Score Bar */}
          <div className="w-full bg-black/20 rounded-xl p-4 border border-white/5 mb-4 backdrop-blur-md shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-zinc-400 mb-2">
              <span>AI PRIORITY SCORE</span>
              <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{ticket.aiScore}/100</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${ticket.aiScore > 80 ? 'bg-red shadow-[0_0_10px_rgba(244,63,94,0.8)]' : ticket.aiScore > 50 ? 'bg-amber shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-green shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}
                style={{ width: `${ticket.aiScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl shadow-inner">
            <span className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">SLA Timer</span>
            <span className={`text-xl font-mono font-bold tracking-tight ${colorClass} drop-shadow-md`}>
              {display}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-4 border-b border-white/5 shrink-0 bg-black/40 z-10 sticky top-0 backdrop-blur-md">
          <button onClick={onEscalate} className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-red hover:bg-red-500/10 border-r border-white/5 transition-all text-center">
            Escalate
          </button>
          <button className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-amber hover:bg-amber-500/10 border-r border-white/5 transition-all text-center opacity-50 cursor-not-allowed">
            In Progress
          </button>
          <button onClick={onResolve} className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-green hover:bg-green-500/10 border-r border-white/5 transition-all text-center">
            Resolve
          </button>
          <button onClick={onClose} className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-center">
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 shrink-0 px-4 bg-black/20 pt-2 z-10 relative">
          {(['details', 'timeline', 'transcript'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[13px] font-bold tracking-wider uppercase transition-all border-b-2
                ${activeTab === tab ? 'border-white text-white drop-shadow-md' : 'border-transparent text-zinc-500 hover:text-zinc-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
          {activeTab === 'details' && (
            <div className="flex flex-col gap-6 animate-fadeScaleIn">

              {/* AI Analysis */}
              <div className="glass-card p-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <div className="flex items-center gap-2 text-cyan text-[12px] font-bold uppercase tracking-widest mb-3">
                  <Bot className="w-4 h-4" /> AI Analysis
                </div>
                <p className="text-[14px] text-zinc-300 leading-relaxed font-medium">
                  {ticket.aiSummary}
                </p>
              </div>

              {/* Detail Rows */}
              <div className="glass-card flex flex-col rounded-xl overflow-hidden divide-y divide-white/5">
                <div className="flex justify-between items-center px-5 py-4 hover:bg-white/5 transition-colors">
                  <span className="text-[12px] uppercase font-bold text-zinc-500 flex items-center gap-2.5"><Phone className="w-4 h-4"/> Caller</span>
                  <span className="text-[14px] text-white font-bold">{ticket.callerName} <span className="text-zinc-500 font-mono text-[12px] ml-2 bg-black/30 px-2 py-0.5 rounded-md">{ticket.phone}</span></span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-white/5 transition-colors">
                  <span className="text-[12px] uppercase font-bold text-zinc-500 flex items-center gap-2.5"><MapPin className="w-4 h-4"/> Area</span>
                  <span className="text-[14px] text-zinc-200 font-medium">{ticket.area}</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-white/5 transition-colors">
                  <span className="text-[12px] uppercase font-bold text-zinc-500 flex items-center gap-2.5"><Hash className="w-4 h-4"/> Category</span>
                  <span className="text-[14px] text-zinc-200 font-medium capitalize">{ticket.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-white/5 transition-colors">
                  <span className="text-[12px] uppercase font-bold text-zinc-500 flex items-center gap-2.5"><Users className="w-4 h-4"/> Households</span>
                  <span className="text-[14px] text-zinc-200 font-medium">{ticket.householdsAffected}</span>
                </div>
              </div>

              {/* Assignment */}
              <div className="glass-card p-5">
                <div className="text-[12px] text-zinc-500 font-bold uppercase tracking-widest mb-4">Assignment Status</div>
                <div className="flex items-center justify-between">
                  {agent ? (
                    <div className="flex items-center gap-4">
                       <Avatar initials={agent.avatar} size="md" className="h-10 w-10 text-[12px] font-bold bg-gradient-to-br from-zinc-700 to-zinc-800 text-white border-white/10 shadow-lg" />
                      <div>
                        <div className="text-[14px] text-white font-bold">{agent.name}</div>
                        <div className="text-[12px] text-zinc-400 font-medium mt-0.5 uppercase tracking-wide">{agent.team}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[13px] text-zinc-500 font-medium italic">Currently Unassigned</div>
                  )}

                  <select
                    value={agent?.id || ""}
                    onChange={(e) => onAssign(e.target.value)}
                    className="bg-black/40 border border-white/10 text-[12px] font-bold text-white rounded-lg px-3 py-2 outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 shadow-inner cursor-pointer"
                  >
                    <option value="" disabled className="text-zinc-500">Reassign →</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id} className="text-white bg-zinc-900">{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              {ticket.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-bold uppercase tracking-widest mb-3">
                    <Tag className="w-4 h-4" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 text-zinc-300 border border-white/10 rounded-lg text-[11px] font-bold uppercase tracking-wide shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Urdu Translation Note */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-[12px] font-medium text-cyan-100 mt-2 flex items-start gap-3 backdrop-blur-md shadow-inner">
                <Mic className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <span className="leading-relaxed">Voice agent communicated in Urdu during this call. English transcript available in Transcript tab.</span>
              </div>

            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="relative pl-6 pt-2 pb-6 animate-fadeScaleIn">
              <div className="absolute top-0 bottom-0 left-[35px] w-px bg-white/10" />

              {ticket.timeline.map((event) => {
                let iconColor = 'bg-zinc-500 border-zinc-500 shadow-[0_0_10px_rgba(113,113,122,0.5)]';
                if (event.type === 'created') iconColor = 'bg-cyan border-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]';
                if (event.type === 'assigned') iconColor = 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
                if (event.type === 'escalated') iconColor = 'bg-red border-red shadow-[0_0_10px_rgba(244,63,94,0.5)]';
                if (event.type === 'resolved') iconColor = 'bg-green border-green shadow-[0_0_10px_rgba(16,185,129,0.5)]';
                if (event.type === 'call') iconColor = 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';

                return (
                  <div key={event.id} className="relative mb-8 last:mb-0 group">
                    <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full z-10 ${iconColor} ring-4 ring-black/80 transition-transform group-hover:scale-125`} />
                    <div className="pl-6">
                      <div className="text-[14px] text-white font-bold mb-1.5 leading-snug">{event.message}</div>
                      <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest bg-black/20 w-fit px-2 py-0.5 rounded-md border border-white/5">
                        {event.by} • <span className="text-zinc-400 font-mono tracking-tight ml-1">{timeAgo(event.at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="flex flex-col h-full animate-fadeScaleIn">
              <div className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Call Recording</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-mono">{formatDuration(ticket.callDuration)}</span>
              </div>

              <div className="bg-white/5 border border-white/10 text-zinc-300 text-[13px] font-medium p-4 rounded-xl mb-5 flex gap-3 items-start backdrop-blur-md">
                 <Mic className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <span className="leading-relaxed">Voice agent spoke in Urdu. Below is English translation of the call.</span>
              </div>

              <div className="flex-1 glass-card p-5 text-[14px] text-zinc-200 font-medium leading-[1.8] overflow-y-auto mb-5 custom-scrollbar whitespace-pre-wrap">
                {ticket.voiceTranscript}
              </div>

              <div className="text-center text-[12px] font-bold text-zinc-500 uppercase tracking-widest py-3 mt-auto bg-black/20 rounded-xl border border-white/5 border-dashed">
                Full audio playback coming with VAPI.ai integration
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

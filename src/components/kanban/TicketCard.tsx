import React from 'react';
import { Ticket, Category } from '../../types';
import { useSLA } from '../../hooks/useSLA';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Clock, Users, Pipette, Droplet, Ban, Waves, Receipt, HelpCircle, MapPin, Mic, CheckCircle, AlertCircle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  agentName: string | null;
  agentAvatar: string | null;
  onClick: () => void;
  onEscalate: () => void;
  onAssign: () => void;
  onResolve: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'no-water': return <Ban className="w-4 h-4" />;
    case 'dirty-water': return <Droplet className="w-4 h-4" />;
    case 'pipe-burst': return <Pipette className="w-4 h-4" />;
    case 'sewerage': return <Waves className="w-4 h-4" />;
    case 'billing': return <Receipt className="w-4 h-4" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

export const TicketCard: React.FC<TicketCardProps> = React.memo(({
  ticket, agentName, agentAvatar, onClick, onEscalate, onAssign, onResolve, onDragStart, onDragEnd
}) => {
  const { remaining, isBreached, display, colorClass } = useSLA(ticket);
  const isCritical = ticket.priority === 'critical';
  const isAging = !isBreached && remaining < ticket.slaMinutes * 0.5 && ticket.status !== 'resolved';

  const timeAgo = (date: Date) => {
    const mins = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.currentTarget.classList.add('opacity-50', 'scale-95');
        onDragStart(e, ticket.id);
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('opacity-50', 'scale-95');
        onDragEnd(e);
      }}
      className={`relative w-full rounded-2xl text-left cursor-grab active:cursor-grabbing mb-3 group
        glass-card glass-panel-hover overflow-hidden
        ${isCritical ? 'border-red/30 shadow-[0_4px_20px_-2px_rgba(244,63,94,0.1)]' : ''}
        ${isAging && !isCritical ? 'border-amber/20' : ''}
      `}
      onClick={onClick}
    >
      {/* Background soft glow for critical */}
      {isCritical && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />}

      {/* Critical Badge top right */}
      {isCritical && (
        <div className="absolute top-3 right-3 bg-red/10 text-red text-[9px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 border border-red/20 shadow-[0_0_10px_rgba(244,63,94,0.2)] tracking-widest backdrop-blur-md">
          <div className="w-1 h-1 rounded-full bg-red animate-pulse" />
          CRITICAL
        </div>
      )}

      {/* Duplicate Badge */}
      {ticket.duplicateOf && (
        <div className="absolute top-3 left-3 bg-amber-500/10 text-amber text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber/20 z-10 tracking-widest backdrop-blur-md">
          DUPLICATE
        </div>
      )}

      {/* Aging Icon */}
      {isAging && !isCritical && (
        <div className="absolute top-3 right-3 text-amber opacity-60 tooltip" title={`Aging: Unresolved`}>
          <Clock className="w-3.5 h-3.5" />
        </div>
      )}

      <div className={`p-4 flex flex-col gap-3 ${ticket.duplicateOf ? 'pt-10' : ''}`}>
        {/* ROW 1: ID + SLA */}
        <div className="flex justify-between items-center z-10 relative mt-1">
          <div className="flex items-center gap-2 text-white font-bold text-[14px]">
            <span className="text-zinc-500 bg-white/5 p-1 rounded-md border border-white/5">{getCategoryIcon(ticket.category)}</span>
            {ticket.ticketNo}
          </div>
          {!isCritical && (
            <div className={`font-mono text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-full border ${colorClass} bg-black/20 backdrop-blur-sm shadow-inner`}>
              {display}
            </div>
          )}
        </div>

        {/* ROW 2: Caller & Area */}
        <div className="mt-1">
          <div className="text-zinc-50 font-semibold text-[15px] truncate">{ticket.callerName}</div>
          <div className="flex items-center justify-between mt-1.5">
             <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
               <MapPin className="w-3.5 h-3.5 text-zinc-500" />
               <span className="truncate max-w-[140px]">{ticket.area}</span>
             </div>
             {/* Replace standard badge with custom one if needed, or rely on Badge component */}
             {!isCritical && <Badge priority={ticket.priority} />}
          </div>
        </div>

        {/* ROW 3: Summary */}
        <p className="text-[13px] text-zinc-400 line-clamp-2 leading-relaxed font-medium mt-1">
          {ticket.aiSummary}
        </p>

        {/* ROW 4: Voice & AI */}
        <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                <Mic className="w-3 h-3 text-cyan" /> URDU CALL
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
              AI SCORE
              <div className="w-5 h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${ticket.aiScore > 80 ? 'bg-red' : ticket.aiScore > 50 ? 'bg-amber' : 'bg-green'}`}
                  style={{ width: `${ticket.aiScore}%` }}
                />
              </div>
            </div>
        </div>


        {/* ROW 6: Meta & Agents */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-bold tracking-wide">
            <span>{timeAgo(ticket.createdAt)}</span>
            {ticket.householdsAffected > 0 && (
              <span className="flex items-center gap-1 text-red font-bold bg-red/10 px-1.5 rounded-md border border-red/20">
                <Users className="w-3.5 h-3.5" /> {ticket.householdsAffected}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {agentAvatar ? (
               <div title={agentName || ''}>
                 <Avatar initials={agentAvatar} size="sm" className="w-[24px] h-[24px] text-[10px] font-bold bg-gradient-to-br from-zinc-700 to-zinc-800 text-white border-white/10 shadow-md" />
               </div>
            ) : (
              <div className="w-[24px] h-[24px] rounded-full border border-dashed border-zinc-600 flex items-center justify-center bg-black/20 tooltip" title="Unassigned">
                 <span className="text-[10px] text-zinc-500 font-bold">?</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (Hover Reveal) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-95 group-hover:scale-100 backdrop-blur-md bg-surface/80 p-2 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={(e) => { e.stopPropagation(); onEscalate(); }}
          className="p-2.5 bg-background hover:bg-red/10 text-zinc-400 hover:text-red border border-white/5 rounded-xl transition-all shadow-sm tooltip"
          title="Escalate Ticket"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
        {ticket.status !== 'resolved' && (
          <button
            onClick={(e) => { e.stopPropagation(); onAssign(); }}
            className="p-2.5 bg-background hover:bg-cyan/10 text-zinc-400 hover:text-cyan border border-white/5 rounded-xl transition-all shadow-sm tooltip"
            title="Assign Ticket"
          >
            <Users className="w-4 h-4" />
          </button>
        )}
        {ticket.status !== 'resolved' && (
          <button
            onClick={(e) => { e.stopPropagation(); onResolve(); }}
            className="p-2.5 bg-background hover:bg-green/10 text-zinc-400 hover:text-green border border-white/5 rounded-xl transition-all shadow-sm tooltip"
            title="Resolve Ticket"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

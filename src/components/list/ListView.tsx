import React, { useState, useMemo } from 'react';
import { Ticket, Agent } from '../../types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useSLA } from '../../hooks/useSLA';
import { ChevronUp, ChevronDown, Zap, Eye, CheckCircle2 } from 'lucide-react';

interface ListViewProps {
  tickets: Ticket[];
  agents: Agent[];
  onClearFilters: () => void;
  onTicketClick: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
}

type SortField = 'ticketNo' | 'priority' | 'status' | 'createdAt' | 'callerName' | 'area';

const SLA_CELL: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const { display, colorClass } = useSLA(ticket);
  return (
    <span className={`font-mono text-sm tracking-tight ${colorClass}`}>
      {display}
    </span>
  );
};

export const ListView: React.FC<ListViewProps> = ({ tickets, agents, onClearFilters, onTicketClick, onEscalate, onResolve }) => {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  const getAgentInfo = (agentId: string | null) => {
    if (!agentId) return { name: null, avatar: null };
    const a = agents.find(ag => ag.id === agentId);
    return a ? { name: a.name, avatar: a.avatar } : { name: null, avatar: null };
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedTickets = useMemo(() => {
    const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

    return [...tickets].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'priority') {
        valA = priorityWeight[a.priority];
        valB = priorityWeight[b.priority];
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tickets, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 inline ml-1 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 inline ml-1 text-primary" />;
  };

  const timeAgo = (date: Date) => {
    const mins = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <div className="w-full h-full flex flex-col px-6 pb-6 relative z-10">
      <div className="mb-4 flex items-center justify-between text-zinc-400 text-sm font-medium">
        <span>Showing <span className="text-white font-bold">{tickets.length}</span> active tickets</span>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-xl shadow-2xl custom-scrollbar relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        <table className="w-full text-left text-sm text-zinc-300 relative border-collapse whitespace-nowrap">
          <thead className="text-[11px] font-bold uppercase tracking-widest bg-black/40 text-zinc-500 sticky top-0 z-10 border-b border-white/5 backdrop-blur-md">
            <tr>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('ticketNo')}>
                Ticket <SortIcon field="ticketNo" />
              </th>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('callerName')}>
                Caller <SortIcon field="callerName" />
              </th>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('area')}>
                Area <SortIcon field="area" />
              </th>
              <th className="py-4 px-6 font-bold">Category</th>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priority')}>
                Priority <SortIcon field="priority" />
              </th>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                Status <SortIcon field="status" />
              </th>
              <th className="py-4 px-6 font-bold">SLA</th>
              <th className="py-4 px-6 font-bold">Assigned</th>
              <th className="py-4 px-6 font-bold cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('createdAt')}>
                Created <SortIcon field="createdAt" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedTickets.map((t, idx) => {
              const agentId = t.status === 'escalated' ? t.escalatedTo : t.assignedTo;
              const { name, avatar } = getAgentInfo(agentId);
              const isCritical = t.priority === 'critical';

              return (
                <tr
                  key={t.id}
                  className={`group hover:bg-white/5 transition-all cursor-pointer relative ${idx % 2 === 0 ? 'bg-transparent' : 'bg-black/10'} ${isCritical ? 'hover:bg-red-500/10' : ''}`}
                  onClick={() => onTicketClick(t)}
                >
                  <td className="py-3 px-6 font-bold text-white relative">
                    {isCritical && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red shadow-[0_0_10px_rgba(244,63,94,1)]" />}
                    {t.ticketNo}
                  </td>
                  <td className="py-3 px-6 text-zinc-200 font-medium">{t.callerName}</td>
                  <td className="py-3 px-6 text-zinc-400">{t.area}</td>
                  <td className="py-3 px-6 capitalize text-zinc-300">{t.category.replace("-", " ")}</td>
                  <td className="py-3 px-6"><Badge priority={t.priority} /></td>
                  <td className="py-3 px-6"><span className="uppercase text-[10px] font-bold tracking-widest bg-black/30 px-2 py-1 rounded-full text-zinc-400 border border-white/5">{t.status}</span></td>
                  <td className="py-3 px-6"><SLA_CELL ticket={t} /></td>
                  <td className="py-3 px-6">
                    {avatar ? (
                      <div className="flex items-center gap-2.5">
                         <Avatar initials={avatar} size="sm" className="w-[24px] h-[24px] text-[10px] font-bold bg-gradient-to-br from-zinc-700 to-zinc-800 border-white/10 text-white shadow-md" />
                        <span className="text-[13px] text-zinc-300 font-bold">{name?.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 font-bold text-[12px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-mono text-[12px] text-zinc-500 text-right group-hover:opacity-0 transition-opacity">
                    {timeAgo(t.createdAt)}
                  </td>

                  {/* Absolute positioning for actions so they overlay the created time perfectly on hover */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); onTicketClick(t); }}
                        className="p-1.5 rounded-lg bg-black/40 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white backdrop-blur-md shadow-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEscalate(t); }}
                        className="p-1.5 rounded-lg bg-black/40 border border-white/5 hover:bg-red/20 hover:border-red/20 text-zinc-400 hover:text-red backdrop-blur-md shadow-lg"
                        title="Escalate"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                      {t.status !== 'resolved' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onResolve(t); }}
                          className="p-1.5 rounded-lg bg-black/40 border border-white/5 hover:bg-green/20 hover:border-green/20 text-zinc-400 hover:text-green backdrop-blur-md shadow-lg"
                          title="Resolve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedTickets.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 backdrop-blur-sm z-20">
            <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-2xl mb-5 border border-white/5 shadow-inner">
              <Zap className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Nothing to see here</h3>
            <p className="text-zinc-500 font-medium mb-6 max-w-sm">No tickets match your specific filters or search queries.</p>
            <button
              onClick={onClearFilters}
              className="bg-white hover:bg-zinc-200 text-black px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

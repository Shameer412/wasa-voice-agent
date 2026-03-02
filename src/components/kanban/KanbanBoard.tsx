import React, { useMemo } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { Status, Ticket, Agent } from '../../types';

interface KanbanBoardProps {
  tickets: Ticket[];
  agents: Agent[];
  onClearFilters: () => void;
  onTicketClick: (ticket: Ticket) => void;
  onDropTicket: (ticketId: string, toStatus: Status) => void;
  onEscalate: (ticket: Ticket) => void;
  onAssign: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tickets, agents, onClearFilters, onTicketClick, onDropTicket, onEscalate, onAssign, onResolve
}) => {

  // Memoize grouped tickets
  const columnsData = useMemo(() => {
    const cols: Record<Status, Ticket[]> = {
      'new': [],
      'in-progress': [],
      'escalated': [],
      'resolved': [],
      'closed': []
    };

    // Sort logic handled in hook preferably, but we assert they arrive sorted.
    tickets.forEach(t => {
      if (cols[t.status]) {
        cols[t.status].push(t);
      }
    });

    return cols;
  }, [tickets]);

  const columns = [
    { id: 'new' as Status, title: 'NEW', colorClass: 'cyan' },
    { id: 'in-progress' as Status, title: 'IN PROGRESS', colorClass: 'amber' },
    { id: 'escalated' as Status, title: 'ESCALATED', colorClass: 'red' },
    { id: 'resolved' as Status, title: 'RESOLVED', colorClass: 'green' }
  ];

  if (tickets.length === 0) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          📭
        </div>
        <h3 className="text-lg font-bold text-white tracking-widest mb-2 font-mono">NO TICKETS FOUND</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          No tickets match your current filters. Try changing the priority, area, or clearing the search query.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-cyan hover:bg-cyan/80 text-black px-6 py-2 rounded font-bold font-mono tracking-wider transition-colors"
        >
          CLEAR ALL FILTERS
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full pb-4 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-start gap-4 px-2 select-none">
      {columns.map(col => (
        <KanbanColumn
          key={col.id}
          status={col.id}
          title={col.title}
          colorClass={col.colorClass}
          tickets={columnsData[col.id]}
          agents={agents}
          onTicketClick={onTicketClick}
          onDrop={onDropTicket}
          onEscalate={onEscalate}
          onAssign={onAssign}
          onResolve={onResolve}
        />
      ))}
      <div className="w-4 flex-shrink-0" /> {/* Spacer */}
    </div>
  );
};

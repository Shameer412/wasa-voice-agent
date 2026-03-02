import { useState, useCallback } from 'react';
import { Ticket, Status, Agent, Priority } from '../types';
import { mockTickets, mockAgents } from '../data/mockData';

export interface Filters {
  priority: Priority | 'all';
  agent: string | 'all';
  area: string | 'all';
  search: string;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [agents] = useState<Agent[]>(mockAgents);
  const [filters, setFilters] = useState<Filters>({
    priority: 'all',
    agent: 'all',
    area: 'all',
    search: ''
  });

  const getAgentName = (id: string | null) => {
    if (!id) return "System";
    return agents.find(a => a.id === id)?.name || "System";
  };

  const addTimelineEvent = (ticketId: string, type: any, message: string, by: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: new Date(),
          timeline: [
            {
              id: Math.random().toString(36).substr(2, 9),
              type,
              message,
              by,
              at: new Date()
            },
            ...t.timeline
          ]
        };
      }
      return t;
    }));
  };

  const moveTicket = useCallback((id: string, newStatus: Status) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id && t.status !== newStatus) {
        return { ...t, status: newStatus, updatedAt: new Date() };
      }
      return t;
    }));
    addTimelineEvent(id, 'note', `Moved to ${newStatus} status`, 'Agent');
  }, []);

  const escalateTicket = useCallback((id: string, agentId: string, reasons: string[], _urgency: string, notes: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'escalated',
          escalatedTo: agentId,
          escalationReason: reasons.join(', ') + (notes ? ` - ${notes}` : ''),
          updatedAt: new Date()
        };
      }
      return t;
    }));
    addTimelineEvent(id, 'escalated', `Escalated (${reasons.join(', ')})`, getAgentName(agentId));
  }, [agents]);

  const assignTicket = useCallback((id: string, agentId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          assignedTo: agentId,
          status: t.status === 'new' ? 'in-progress' : t.status,
          updatedAt: new Date()
        };
      }
      return t;
    }));
    addTimelineEvent(id, 'assigned', 'Ticket assigned', getAgentName(agentId));
  }, [agents]);

  const resolveTicket = useCallback((id: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'resolved', updatedAt: new Date() };
      }
      return t;
    }));
    addTimelineEvent(id, 'resolved', 'Ticket marked as resolved', 'Agent');
  }, []);

  const addTicket = useCallback((ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  }, []);

  const getColumnTickets = useCallback((status: Status) => {
    let filtered = tickets.filter(t => t.status === status);

    // Apply filters
    if (filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    if (filters.agent !== 'all') {
      filtered = filtered.filter(t => t.assignedTo === filters.agent || t.escalatedTo === filters.agent);
    }
    if (filters.area !== 'all') {
      filtered = filtered.filter(t => t.area === filters.area);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNo.toLowerCase().includes(s) ||
        t.callerName.toLowerCase().includes(s) ||
        t.area.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.aiSummary.toLowerCase().includes(s)
      );
    }

    // Sort: critical > high > medium > low, then newest first
    const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    return filtered.sort((a, b) => {
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [tickets, filters]);

  return {
    tickets,
    agents,
    filters,
    setFilters,
    moveTicket,
    escalateTicket,
    assignTicket,
    resolveTicket,
    addTicket,
    getColumnTickets
  };
}

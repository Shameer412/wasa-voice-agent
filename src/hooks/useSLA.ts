import { useState, useEffect } from 'react';
import { Ticket } from '../types';

export function useSLA(ticket: Ticket) {
  const [timeState, setTimeState] = useState({ remaining: 0, isBreached: false, display: "", colorClass: "" });

  useEffect(() => {
    // If ticket is resolved, SLA calculation stops
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      setTimeState({ remaining: 0, isBreached: false, display: "RESOLVED", colorClass: "text-green" });
      return;
    }

    const updateSLA = () => {
      const now = new Date();
      const elapsedMinutes = (now.getTime() - ticket.createdAt.getTime()) / (1000 * 60);
      const remainingMinutes = ticket.slaMinutes - elapsedMinutes;
      const isBreached = remainingMinutes <= 0;

      let display = "";
      if (isBreached) {
        display = "SLA BREACHED";
      } else {
        const h = Math.floor(remainingMinutes / 60);
        const m = Math.floor(remainingMinutes % 60);
        display = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }

      const percentRemaining = (remainingMinutes / ticket.slaMinutes) * 100;

      let colorClass = "text-green";
      if (isBreached) {
        colorClass = "text-red animate-pulseGlow";
      } else if (percentRemaining < 20) {
        colorClass = "text-red animate-pulseGlow";
      } else if (percentRemaining < 50) {
        colorClass = "text-amber";
      }

      setTimeState({ remaining: remainingMinutes, isBreached, display, colorClass });
    };

    updateSLA(); // initial call
    const interval = setInterval(updateSLA, 10000); // 10s updates

    return () => clearInterval(interval);
  }, [ticket.createdAt, ticket.slaMinutes, ticket.status]);

  return timeState;
}

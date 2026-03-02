import React, { useState } from 'react';
import { Ticket, Agent } from '../../types';
import { X, Bot, AlertTriangle } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface EscalationModalProps {
  ticket: Ticket;
  agents: Agent[];
  onClose: () => void;
  onConfirm: (agentId: string, reasons: string[], urgency: string, notes: string) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({ ticket, agents, onClose, onConfirm }) => {
  const [urgency, setUrgency] = useState<'immediate' | 'urgent' | 'normal'>('normal');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const quickReasons = [
    "⚡ Live wire near water",
    "🏥 Medical emergency",
    "☣️ Contaminated supply",
    "⏰ No water 72+ hours",
    "🏫 School/Hospital affected",
    "🌊 Road flooding"
  ];

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const isHighPriority = ticket.priority === 'critical' || ticket.priority === 'high';
  const supervisorsAndERT = agents.filter(a => a.role === 'supervisor' || a.role === 'ert');
  const canConfirm = selectedAgent && selectedReasons.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">

        {/* Modal */}
        <div className="bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-[540px] shadow-2xl flex flex-col overflow-hidden animate-fadeScaleIn relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/20 relative z-10">
            <div>
              <div className="text-white font-bold tracking-wide text-[16px] flex items-center gap-2 mb-1.5 bg-red-500/10 text-red px-3 py-1 rounded-md w-fit border border-red-500/20 shadow-inner">
                 <AlertTriangle className="w-4 h-4 text-red" /> ESCALATE TICKET
              </div>
              <div className="text-zinc-400 text-[13px] font-bold tracking-wide uppercase">
                {ticket.ticketNo} <span className="text-zinc-600 mx-2">•</span> {ticket.area}
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/10 transition-colors p-2 rounded-xl shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6 relative z-10">

            {/* AI Banner */}
            {isHighPriority && (
              <div className={`p-4 rounded-xl border flex items-start gap-4 backdrop-blur-sm shadow-inner ${ticket.priority === 'critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                <div className={`p-2 rounded-lg shrink-0 ${ticket.priority === 'critical' ? 'bg-red-500/10 text-red' : 'bg-cyan-500/10 text-cyan'}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-[13px] font-bold uppercase tracking-widest mb-1 ${ticket.priority === 'critical' ? 'text-red' : 'text-cyan'}`}>
                    AI Recommends: {ticket.priority === 'critical' ? 'Immediate ERT Deployment' : 'Supervisor Review'}
                  </div>
                  <div className="text-[12px] font-medium text-zinc-300 leading-relaxed">
                    Based on priority analysis and SLA constraints detected in the transcript.
                  </div>
                </div>
              </div>
            )}

            {/* Urgency */}
            <div>
              <div className="text-[12px] text-zinc-500 font-bold mb-3 uppercase tracking-widest">Select Urgency Level</div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setUrgency('immediate')}
                  className={`py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-xl border transition-all shadow-sm ${urgency === 'immediate' ? 'bg-red text-white border-red shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-red/40 hover:bg-red/5 hover:text-red'}`}
                >
                  IMMEDIATE
                </button>
                <button
                  onClick={() => setUrgency('urgent')}
                  className={`py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-xl border transition-all shadow-sm ${urgency === 'urgent' ? 'bg-amber text-zinc-900 border-amber shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-amber/40 hover:bg-amber/5 hover:text-amber'}`}
                >
                  URGENT
                </button>
                <button
                  onClick={() => setUrgency('normal')}
                  className={`py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-xl border transition-all shadow-sm ${urgency === 'normal' ? 'bg-zinc-700 text-white border-zinc-500 shadow-inner' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-zinc-500 hover:bg-white/10 hover:text-white'}`}
                >
                  NORMAL
                </button>
              </div>
            </div>

            {/* Assign To */}
            <div>
              <div className="text-[12px] text-zinc-500 font-bold mb-3 uppercase tracking-widest">
                Assign To Special Team
              </div>
              <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                {supervisorsAndERT.map(a => {
                  const isSelected = selectedAgent === a.id;
                  return (
                    <button
                      key={a.id}
                      disabled={!a.available}
                      onClick={() => setSelectedAgent(a.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all backdrop-blur-sm
                        ${!a.available ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/5' :
                          isSelected ? 'bg-white/10 border-white/20 text-white shadow-inner scale-[1.01]' : 'glass-card hover:bg-white/5 hover:border-white/10 text-zinc-300'
                        }
                      `}
                    >
                      <Avatar initials={a.avatar} size="md" className={`h-10 w-10 text-[12px] font-bold ${!a.available ? 'grayscale bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-white border-white/10 shadow-md'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[14px] font-bold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{a.name}</span>
                          {a.available ? (
                            <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          ) : (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Offline</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md shadow-inner ${a.role === 'ert' ? 'bg-red-500/10 text-red border border-red-500/20' : 'bg-purple-500/10 text-purple border border-purple-500/20'}`}>
                            {a.role}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            Load <div className="w-10 h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-zinc-400" style={{width: `${(a.assignedCount/5)*100}%`}}/></div>
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Reasons */}
            <div>
              <div className="text-[12px] text-zinc-500 font-bold mb-3 uppercase tracking-widest">Escalation Reasons</div>
              <div className="flex flex-wrap gap-2.5">
                {quickReasons.map(r => {
                  const isSelected = selectedReasons.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => handleReasonToggle(r)}
                      className={`px-3.5 py-2 rounded-xl text-[12px] transition-all border font-bold shadow-sm ${
                        isSelected ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional context or specific instructions... (Optional)"
                className="w-full bg-black/20 border border-white/10 text-[14px] font-medium text-white rounded-xl p-4 outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all resize-none h-24 placeholder:text-zinc-600 shadow-inner"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/5 bg-black/20 relative z-10">
            <button
              disabled={!canConfirm}
              onClick={() => onConfirm(selectedAgent, selectedReasons, urgency, notes)}
              className={`w-full py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-widest transition-all flex items-center justify-center gap-2
                ${!canConfirm ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed' :
                  urgency === 'immediate' ? 'bg-red text-white hover:bg-red-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5' :
                  urgency === 'urgent' ? 'bg-amber text-zinc-900 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5' :
                  'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5'
                }
              `}
            >
              {urgency === 'immediate' && canConfirm && <AlertTriangle className="w-4 h-4" />}
              {urgency === 'immediate' ? 'DISPATCH ERT NOW' :
               urgency === 'urgent'    ? 'ESCALATE URGENTLY' :
               'ESCALATE TICKET'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

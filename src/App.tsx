import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StatsBar } from './components/analytics/StatsBar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TicketDetailPanel } from './components/overlays/TicketDetailPanel';
import { EscalationModal } from './components/overlays/EscalationModal';
import { LiveCallWidget } from './components/voice/LiveCallWidget';
import { ToastContainer } from './components/ui/Toast';
import { SubmitComplaintPage } from './components/pages/SubmitComplaintPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AgentDemoPage } from './components/pages/AgentDemoPage';
import { useTickets } from './hooks/useTickets';
import { useToast } from './hooks/useToast';
import { AppPage, ComplaintSubmission, Ticket } from './types';

let ticketCounter = 14; // starts after WAS-013

function App() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [escalatingTicket, setEscalatingTicket] = useState<Ticket | null>(null);

  const {
    tickets,
    agents,
    moveTicket,
    escalateTicket,
    assignTicket,
    resolveTicket,
    addTicket,
  } = useTickets();

  const { addToast } = useToast();

  const stats = {
    critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
    open: tickets.filter(t => t.status === 'new' || t.status === 'in-progress').length,
    escalated: tickets.filter(t => t.status === 'escalated').length,
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'k' || e.key === 'K') setView(prev => prev === 'kanban' ? 'list' : 'kanban');
      if (e.key === 's' || e.key === 'S') setSidebarOpen(prev => !prev);
      if (e.key === 'Escape') {
        setSelectedTicket(null);
        setEscalatingTicket(null);
        setShowShortcuts(false);
      }
      if (e.key === '?') setShowShortcuts(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (selectedArea !== 'all' && t.area !== selectedArea) return false;
      if (selectedAgent !== 'all' && t.assignedTo !== selectedAgent) return false;
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        return t.ticketNo.toLowerCase().includes(lower) ||
               t.callerName.toLowerCase().includes(lower) ||
               t.area.toLowerCase().includes(lower);
      }
      return true;
    });
  }, [tickets, selectedPriority, selectedArea, selectedAgent, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPriority('all');
    setSelectedArea('all');
    setSelectedAgent('all');
  };

  const handleComplaintSubmit = (complaint: ComplaintSubmission): string => {
    const num = ticketCounter++;
    const ticketNo = `WAS-${String(num).padStart(3, '0')}`;

    let priority: Ticket['priority'] = 'low';
    let aiScore = 10;

    if (complaint.category === 'pipe-burst') { priority = 'critical'; aiScore = 85; }
    else if (complaint.category === 'no-water') { priority = 'high'; aiScore = 70; }
    else if (complaint.category === 'dirty-water') { priority = 'high'; aiScore = 75; }
    else if (complaint.category === 'sewerage') { priority = 'medium'; aiScore = 50; }
    else if (complaint.category === 'billing') { priority = 'low'; aiScore = 25; }

    const desc = complaint.description.toLowerCase();
    if (desc.includes('hospital') || desc.includes('school')) { priority = 'critical'; aiScore += 20; }
    if (desc.includes('children') || desc.includes('elderly')) aiScore += 15;

    const now = new Date();
    const newTicket: Ticket = {
      id: `t${num}`,
      ticketNo,
      callerName: complaint.callerName,
      phone: complaint.phone,
      area: complaint.area,
      category: complaint.category,
      icon: { 'no-water': '🚱', 'dirty-water': '🤢', 'pipe-burst': '💥', 'sewerage': '🚧', 'billing': '📄', 'other': '❓' }[complaint.category],
      priority,
      status: 'new',
      description: complaint.description,
      aiSummary: `Auto-created from online submission — ${complaint.category.toUpperCase()}: ${complaint.area}`,
      createdAt: now,
      updatedAt: now,
      callDuration: 0,
      householdsAffected: complaint.householdsAffected,
      assignedTo: null,
      escalatedTo: null,
      escalationReason: null,
      aiScore: Math.min(aiScore, 99),
      slaMinutes: priority === 'critical' ? 30 : priority === 'high' ? 120 : priority === 'medium' ? 480 : 1440,
      voiceTranscript: 'Submitted via online portal',
      tags: ['online-submission'],
      duplicateOf: null,
      timeline: [
        { id: 'e1', type: 'created', message: 'Ticket created via online portal', by: 'Citizen Portal', at: now }
      ],
    };

    addTicket(newTicket);
    addToast(`Ticket ${ticketNo} created & added to dashboard!`, 'success');
    return ticketNo;
  };

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    if (page === 'dashboard') {
      setSelectedTicket(null);
      setEscalatingTicket(null);
    }
  };

  const isDashboard = currentPage === 'dashboard';

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background font-sans antialiased text-zinc-100 relative">

      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-cyan/8 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="z-10 relative flex flex-col h-full w-full">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          stats={stats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredTickets.length}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar only on dashboard */}
          {isDashboard && (
            <Sidebar
              isOpen={sidebarOpen}
              view={view}
              setView={setView}
              agents={agents}
              tickets={tickets}
              selectedPriority={selectedPriority}
              onSelectPriority={setSelectedPriority}
              selectedArea={selectedArea}
              onSelectArea={setSelectedArea}
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
            />
          )}

          <main className="flex-1 overflow-hidden flex flex-col relative">
            {currentPage === 'dashboard' && (
              <>
                <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col px-2 pt-2">
                  <StatsBar />
                  <div className="flex-1 overflow-hidden flex flex-col mt-2">
                    {view === 'kanban' ? (
                      <KanbanBoard
                        tickets={filteredTickets}
                        agents={agents}
                        onClearFilters={clearFilters}
                        onTicketClick={setSelectedTicket}
                        onDropTicket={(id, status) => {
                          moveTicket(id, status);
                          addToast(`Ticket status updated to ${status}`, 'success');
                        }}
                        onEscalate={(t) => setEscalatingTicket(t)}
                        onAssign={(t) => {
                          assignTicket(t.id, 'a3');
                          addToast(`Ticket ${t.ticketNo} assigned`, 'info');
                        }}
                        onResolve={(t) => {
                          resolveTicket(t.id);
                          addToast(`Ticket ${t.ticketNo} marked resolved`, 'success');
                        }}
                      />
                    ) : (
                      <ListView
                        tickets={filteredTickets}
                        agents={agents}
                        onClearFilters={clearFilters}
                        onTicketClick={setSelectedTicket}
                        onEscalate={(t) => setEscalatingTicket(t)}
                        onResolve={(t) => {
                          resolveTicket(t.id);
                          addToast(`Ticket ${t.ticketNo} marked resolved`, 'success');
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {currentPage === 'submit' && (
              <SubmitComplaintPage
                onSubmit={handleComplaintSubmit}
                onBack={() => handleNavigate('dashboard')}
              />
            )}

            {currentPage === 'analytics' && (
              <AnalyticsPage tickets={tickets} agents={agents} />
            )}

            {currentPage === 'demo' && (
              <AgentDemoPage />
            )}
          </main>
        </div>
      </div>

      <ToastContainer />
      <LiveCallWidget onNavigateToDemo={() => handleNavigate('demo')} />

      {/* Keyboard shortcuts hint */}
      {isDashboard && (
        <div className="fixed bottom-6 left-6 z-40 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded text-[10px] text-zinc-500 font-mono tracking-widest hidden lg:block select-none">
          PRESS <span className="text-zinc-300">?</span> FOR SHORTCUTS
        </div>
      )}

      {showShortcuts && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeScaleIn">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-[400px] shadow-2xl p-6 relative">
            <button onClick={() => setShowShortcuts(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-zinc-100 font-bold tracking-wide text-sm mb-6 flex items-center gap-2">
              ⌨ Keyboard Shortcuts
            </h2>
            <div className="flex flex-col gap-4 text-sm px-2">
              {[
                { label: 'Toggle View (Kanban/List)', key: 'K' },
                { label: 'Toggle Sidebar', key: 'S' },
                { label: 'Close Modals/Panels', key: 'ESC' },
                { label: 'Show this menu', key: '?' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-zinc-400">{s.label}</span>
                  <span className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700">{s.key}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-white/8">
              <button onClick={() => setShowShortcuts(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium py-2 px-6 rounded-xl transition-colors" autoFocus>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          agent={agents.find(a => a.id === selectedTicket.assignedTo) || null}
          agents={agents}
          onClose={() => setSelectedTicket(null)}
          onEscalate={() => {
            setSelectedTicket(null);
            setEscalatingTicket(selectedTicket);
          }}
          onAssign={(agentId) => {
            assignTicket(selectedTicket.id, agentId);
            addToast('Ticket assigned', 'success');
          }}
          onResolve={() => {
            resolveTicket(selectedTicket.id);
            addToast(`Ticket ${selectedTicket.ticketNo} resolved`, 'success');
            setSelectedTicket(null);
          }}
        />
      )}

      {escalatingTicket && (
        <EscalationModal
          ticket={escalatingTicket}
          agents={agents}
          onClose={() => setEscalatingTicket(null)}
          onConfirm={(agentId, reasons, urgency, notes) => {
            escalateTicket(escalatingTicket.id, agentId, reasons, urgency, notes);
            const a = agents.find(ag => ag.id === agentId);
            addToast(`Ticket ${escalatingTicket.ticketNo} escalated to ${a?.name}`, 'success');
            setEscalatingTicket(null);
          }}
        />
      )}
    </div>
  );
}

export default App;

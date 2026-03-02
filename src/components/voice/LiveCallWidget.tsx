import React, { useState } from 'react';
import { X, Mic, ArrowRight } from 'lucide-react';

interface LiveCallWidgetProps {
  onNavigateToDemo: () => void;
}

export const LiveCallWidget: React.FC<LiveCallWidgetProps> = ({ onNavigateToDemo }) => {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black/70 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/90 transition-all shadow-xl group focus:outline-none glow-cyan"
        title="VAPI Voice Agent Demo"
      >
        <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-40" />
        <Mic className="w-6 h-6 z-10 text-cyan-400" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 glass-panel rounded-2xl shadow-2xl flex flex-col font-mono animate-slideInRight border-cyan-500/20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-black/30 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white text-sm">🎙 Voice Agent</span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest">VAPI.ai</span>
        </div>
        <button onClick={() => setExpanded(false)} className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col items-center text-center bg-black/10">
        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 animate-float">
          <Mic className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="font-bold text-white mb-1.5 text-sm">AI Voice Agent Ready</h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-5">
          Watch how our AI agent handles Urdu complaint calls and auto-creates tickets in real-time
        </p>

        <button
          onClick={() => { setExpanded(false); onNavigateToDemo(); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Launch Demo <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-4 py-2 border-t border-white/6 bg-black/30 rounded-b-2xl text-center">
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Powered by VAPI.ai + OpenAI Whisper</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, PhoneOff, Mic, Bot, User2, Zap, CheckCircle, X,
  FileText, Info, Play, RotateCcw, Volume2, VolumeX
} from 'lucide-react';
import { demoCallScript } from '../../data/mockData';
import { DemoCallStep } from '../../types';

type DemoState = 'idle' | 'ringing' | 'connected' | 'ended';
interface ExtractedInfo {
  name?: string; phone?: string; area?: string;
  category?: string; priority?: string; ticket?: string;
}

const WaveBar: React.FC<{ delay: string; active: boolean }> = ({ delay, active }) => (
  <div
    className={`w-1 rounded-full transition-all ${active ? 'bg-cyan-400 animate-wave-bar' : 'bg-zinc-700'}`}
    style={{ animationDelay: delay, height: '4px' }}
  />
);

// ── Google Translate TTS ────────────────────────────────────────────────────
// Downloads MP3 from Google servers — NO local voice dependency at all!
let _audio: HTMLAudioElement | null = null;

const gtSpeak = (text: string, onEnd: () => void, enabled: boolean) => {
  const fallbackDelay = () => setTimeout(onEnd, Math.max(1800, text.split(' ').length * 380));

  if (!enabled) { fallbackDelay(); return; }

  // Stop any previous audio
  if (_audio) { try { _audio.pause(); } catch { /* */ } _audio = null; }

  // Google Translate TTS endpoint — returns MP3
  const chunk = text.slice(0, 200); // Google has char limit
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(chunk)}`;

  const audio = new Audio();
  _audio = audio;
  audio.crossOrigin = 'anonymous';
  audio.volume = 1;

  let done = false;
  const finish = () => { if (!done) { done = true; _audio = null; onEnd(); } };

  audio.oncanplaythrough = () => audio.play().catch(() => fallbackDelay());
  audio.onended = finish;
  audio.onerror = () => { fallbackDelay(); };
  audio.src = url;

  setTimeout(finish, 15000); // safety
};

const stopTTS = () => {
  if (_audio) { try { _audio.pause(); _audio.src = ''; } catch { /* */ } _audio = null; }
};
// ──────────────────────────────────────────────────────────────────────────

export const AgentDemoPage: React.FC = () => {
  const [demoState, setDemoState]         = useState<DemoState>('idle');
  const [shownSteps, setShownSteps]       = useState<DemoCallStep[]>([]);
  const [currentStep, setCurrentStep]     = useState(0);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({});
  const [isTyping, setIsTyping]           = useState(false);
  const [callDuration, setCallDuration]   = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<'agent' | 'citizen' | null>(null);
  const [audioEnabled, setAudioEnabled]   = useState(true);
  const [testResult, setTestResult]       = useState<'none'|'playing'|'ok'|'fail'>('none');

  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const runningRef    = useRef(false);
  const audioRef      = useRef(true);

  useEffect(() => { audioRef.current = audioEnabled; }, [audioEnabled]);

  useEffect(() => () => {
    runningRef.current = false;
    stopTTS();
    if (timerRef.current)   clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (transcriptRef.current)
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [shownSteps, isTyping]);

  // ── Sequencer ──────────────────────────────────────────────────────────
  const playStep = (idx: number) => {
    if (!runningRef.current) return;
    if (idx >= demoCallScript.length) {
      timeoutRef.current = setTimeout(() => {
        runningRef.current = false;
        setDemoState('ended');
        setActiveSpeaker(null);
        if (timerRef.current) clearInterval(timerRef.current);
        stopTTS();
      }, 800);
      return;
    }
    const step = demoCallScript[idx];
    setIsTyping(true);
    setActiveSpeaker(null);
    timeoutRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      setIsTyping(false);
      setShownSteps(prev => [...prev, step]);
      setActiveSpeaker(step.speaker);
      setCurrentStep(idx + 1);
      if (step.extractedField)
        setExtractedInfo(prev => ({ ...prev, [step.extractedField!.key]: step.extractedField!.value }));
      gtSpeak(step.english, () => {
        if (!runningRef.current) return;
        setActiveSpeaker(null);
        playStep(idx + 1);
      }, audioRef.current);
    }, step.delayMs);
  };

  const startDemo = () => {
    runningRef.current = false;
    stopTTS();
    if (timerRef.current)   clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDemoState('ringing');
    setShownSteps([]); setCurrentStep(0); setExtractedInfo({});
    setCallDuration(0); setActiveSpeaker(null); setIsTyping(false);
    timeoutRef.current = setTimeout(() => {
      setDemoState('connected');
      runningRef.current = true;
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      playStep(0);
    }, 2500);
  };

  const resetDemo = () => {
    runningRef.current = false;
    stopTTS();
    if (timerRef.current)   clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDemoState('idle'); setShownSteps([]); setCurrentStep(0);
    setExtractedInfo({}); setCallDuration(0);
    setActiveSpeaker(null); setIsTyping(false); setTestResult('none');
  };

  const toggleAudio = () => {
    const n = !audioEnabled;
    setAudioEnabled(n); audioRef.current = n;
    if (!n) stopTTS();
  };

  const testVoice = () => {
    setTestResult('playing');
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent('Hello. WASA AI Agent audio test.')}`;
    const a = new Audio();
    a.crossOrigin = 'anonymous';
    a.volume = 1;
    a.oncanplaythrough = () => a.play().catch(() => setTestResult('fail'));
    a.onended = () => setTestResult('ok');
    a.onerror = () => setTestResult('fail');
    a.src = url;
    setTimeout(() => setTestResult(s => s === 'playing' ? 'fail' : s), 8000);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between animate-slideInUp">
          <div>
            <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400" /> AI Voice Agent Demo
            </h1>
            <p className="text-sm text-zinc-400">
              دیکھیں کہ WASA کا AI agent کیسے Urdu میں بات کرتا ہے اور خودکار ٹکٹ بناتا ہے
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                audioEnabled ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {audioEnabled ? 'Audio ON' : 'Audio OFF'}
            </button>
            {demoState === 'idle' && (
              <button onClick={testVoice}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  testResult === 'ok'      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400' :
                  testResult === 'fail'    ? 'bg-red-500/15 border-red-500/35 text-red-400' :
                  testResult === 'playing' ? 'bg-yellow-500/15 border-yellow-500/35 text-yellow-400' :
                  'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}>
                {testResult === 'ok'      ? '✅ Voice works!' :
                 testResult === 'fail'    ? '❌ Failed' :
                 testResult === 'playing' ? '⏳ Testing…' : '🔊 Test Voice'}
              </button>
            )}
          </div>
        </div>

        {/* Banner */}
        <div className={`glass-panel rounded-xl p-4 flex items-start gap-3 ${testResult === 'fail' ? 'border border-yellow-500/30' : ''}`}>
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-300 leading-relaxed">
            {testResult === 'fail' ? (
              <span>
                Voice test failed — koi baat nahi! <strong className="text-cyan-400">Audio OFF</strong> karo upar se aur
                <strong className="text-white"> Start Demo Call</strong> dabao. Visual demo perfectly chalega ✅
              </span>
            ) : testResult === 'ok' ? (
              <span><strong className="text-emerald-400">✅ Audio kaam kar raha hai!</strong> Ab Start Demo Call dabao.</span>
            ) : (
              <span>
                Google TTS se speech chalegi — internet zaroori hai.
                Pehle <strong className="text-yellow-400">"🔊 Test Voice"</strong> try karo!
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Call Panel ──────────────────────────────────── */}
          <div className="lg:col-span-3 glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  demoState === 'connected' ? 'bg-emerald-400 animate-pulse' :
                  demoState === 'ringing'   ? 'bg-yellow-400 animate-pulse' :
                  demoState === 'ended'     ? 'bg-zinc-500' : 'bg-zinc-700'}`} />
                <span className="text-sm font-semibold text-zinc-200">
                  {demoState === 'idle'      && 'AI Voice Agent — Ready'}
                  {demoState === 'ringing'   && 'Incoming Call…'}
                  {demoState === 'connected' && `🔴 Live — ${fmt(callDuration)}`}
                  {demoState === 'ended'     && '✅ Call Ended — Ticket Created'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {demoState === 'connected' && (
                  <div className="flex items-center gap-0.5 h-5">
                    {['0s','0.1s','0.2s','0.3s','0.4s'].map(d => <WaveBar key={d} delay={d} active={activeSpeaker !== null} />)}
                  </div>
                )}
                {(demoState === 'connected' || demoState === 'ended') && (
                  <button onClick={resetDemo} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/10 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {demoState === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center animate-float">
                    <Phone className="w-12 h-12 text-cyan-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start Demo Call</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-xs leading-relaxed">
                  Click karo — agent <strong className="text-white">Google TTS</strong> se bolega aur real-time ticket create karega.
                </p>
                <button onClick={startDemo}
                  className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all"
                  style={{ boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}>
                  <Play className="w-5 h-5" /> Start Demo Call
                </button>
              </div>
            )}

            {demoState === 'ringing' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center animate-ringtone">
                    <Phone className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="absolute inset-[-4px] rounded-full border border-emerald-500/30 animate-ping" />
                  <div className="absolute inset-[-14px] rounded-full border border-emerald-500/15 animate-ping" style={{ animationDelay:'0.3s' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Incoming Call</h3>
                <p className="text-zinc-400 text-sm">0311-9987765</p>
                <p className="text-zinc-500 text-xs animate-pulse mt-1">AI Agent answering…</p>
              </div>
            )}

            {(demoState === 'connected' || demoState === 'ended') && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" ref={transcriptRef}>
                {shownSteps.map((step, i) => (
                  <div key={step.id}
                    className={`flex gap-3 animate-typewriter-line ${step.speaker === 'citizen' ? 'flex-row-reverse' : ''}`}
                    style={{ animationDelay: `${i * 0.02}s` }}>
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                      step.speaker === 'agent' ? 'bg-cyan-500/15 border-cyan-500/40' : 'bg-violet-500/15 border-violet-500/35'
                    } ${activeSpeaker === step.speaker && i === shownSteps.length - 1
                        ? 'ring-2 ring-offset-1 ring-offset-[#0B0F19] ' + (step.speaker === 'agent' ? 'ring-cyan-400' : 'ring-violet-400') : ''}`}>
                      {step.speaker === 'agent' ? <Bot className="w-4 h-4 text-cyan-400" /> : <User2 className="w-4 h-4 text-violet-400" />}
                    </div>
                    <div className={`flex flex-col max-w-[75%] ${step.speaker === 'citizen' ? 'items-end' : ''}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${step.speaker === 'agent' ? 'text-cyan-500' : 'text-violet-400'}`}>
                        {step.speaker === 'agent' ? '🤖 WASA AI Agent' : '👤 Citizen'}
                      </span>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        step.speaker === 'agent'
                          ? 'bg-cyan-500/10 border border-cyan-500/20 text-zinc-100 rounded-tl-sm'
                          : 'bg-violet-500/10 border border-violet-500/20 text-zinc-100 rounded-tr-sm'}`}>
                        <p className="font-semibold mb-1" dir="rtl">{step.urdu}</p>
                        <p className="text-[11px] text-zinc-500 italic">{step.english}</p>
                      </div>
                      {step.extractedField && (
                        <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-slideInUp">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400 font-bold">{step.extractedField.label}:</span>
                          <span className="text-[10px] text-emerald-300">{step.extractedField.value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-cyan-500/15 border-2 border-cyan-500/40">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                )}
                {activeSpeaker && demoState === 'connected' && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${activeSpeaker === 'agent' ? 'text-cyan-400 bg-cyan-500/5' : 'text-violet-400 bg-violet-500/5'}`}>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    {activeSpeaker === 'agent' ? '🤖 Agent speaking…' : '👤 Citizen speaking…'}
                  </div>
                )}
                {demoState === 'ended' && (
                  <div className="flex flex-col items-center py-6 animate-fadeScaleIn">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500/35 flex items-center justify-center mb-3">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-base font-bold text-white mb-1">Call Mukammal! 🎉</p>
                    <p className="text-sm text-zinc-400 mb-1">Ticket WAS-014 dashboard mein add ho gaya</p>
                    <p className="text-xs text-zinc-600">Duration: {fmt(callDuration)}</p>
                    <button onClick={resetDemo} className="mt-5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white transition-all flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5" /> Dobara Chalao
                    </button>
                  </div>
                )}
              </div>
            )}

            {demoState === 'connected' && (
              <div className="px-5 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Google TTS Active</span>
                </div>
                <button onClick={resetDemo} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/25 transition-all">
                  <PhoneOff className="w-3.5 h-3.5" /> End Call
                </button>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> AI Extracted Data
                {demoState === 'connected' && (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                {([
                  { key:'name',     label:'Caller Name',  icon:<User2       className="w-4 h-4" />, ph:'Listening…'   },
                  { key:'phone',    label:'Phone Number', icon:<Phone       className="w-4 h-4" />, ph:'Listening…'   },
                  { key:'area',     label:'Area',         icon:<Mic         className="w-4 h-4" />, ph:'Detecting…'   },
                  { key:'category', label:'Category',     icon:<FileText    className="w-4 h-4" />, ph:'Analyzing…'   },
                  { key:'priority', label:'AI Priority',  icon:<Zap         className="w-4 h-4" />, ph:'Calculating…' },
                  { key:'ticket',   label:'Ticket No.',   icon:<CheckCircle className="w-4 h-4" />, ph:'Pending…'     },
                ] as const).map(field => {
                  const val = extractedInfo[field.key as keyof ExtractedInfo];
                  const isTicket   = field.key === 'ticket';
                  const isCritical = field.key === 'priority' && val?.includes('CRITICAL');
                  return (
                    <div key={field.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
                      val ? isTicket ? 'bg-emerald-500/10 border-emerald-500/30' : isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
                          : 'opacity-40 border-dashed border-white/10'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        val ? isTicket ? 'bg-emerald-500/20 text-emerald-400' : isCritical ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/15 text-cyan-400'
                            : 'bg-white/5 text-zinc-700'}`}>{field.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{field.label}</div>
                        <div className={`text-sm font-bold truncate mt-0.5 ${
                          val ? isTicket ? 'text-emerald-400' : isCritical ? 'text-red-400' : 'text-white' : 'text-zinc-700'}`}>
                          {val ?? field.ph}
                        </div>
                      </div>
                      {val && <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isTicket ? 'text-emerald-400' : 'text-cyan-400'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-semibold">Call Progress</span>
                <span className="font-mono text-xs text-zinc-600">{currentStep}/{demoCallScript.length}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
                  style={{ width: `${(currentStep / demoCallScript.length) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-700 mt-1.5 uppercase tracking-widest">
                <span>Call Start</span><span>Ticket Created</span>
              </div>
            </div>

            {demoState === 'idle' && (
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-widest">How It Works</h3>
                <div className="space-y-2.5">
                  {[
                    { text:'Citizen calls WASA helpline 1334', icon:'📞' },
                    { text:'AI auto-answers in Urdu',          icon:'🤖' },
                    { text:'NLP extracts name, area, issue',   icon:'🧠' },
                    { text:'AI scores priority 0–100',         icon:'⚡' },
                    { text:'Ticket auto-created on dashboard', icon:'✅' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-zinc-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

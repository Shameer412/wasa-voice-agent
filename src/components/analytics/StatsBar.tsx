import React, { useState, useEffect } from 'react';
import { Ticket, Activity, AlertTriangle, PhoneCall, CheckCircle2 } from 'lucide-react';

const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 1200, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export const StatsBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-cyan/10 text-cyan">
            <Ticket className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white group-hover:text-shadow-glow">
            <CountUp end={84} />
          </span>
        </div>
        <p className="text-xs text-gray-400">Total Tickets</p>
        <p className="text-[10px] text-gray-500 mt-1">tickets today</p>
      </div>

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-purple/10 text-purple">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white group-hover:text-shadow-glow">
            4.2 <span className="text-sm">hrs</span>
          </span>
        </div>
        <p className="text-xs text-gray-400">Avg Resolution</p>
        <p className="text-[10px] text-green mt-1 flex items-center">
          <span className="mr-1">↓</span> 12% from yesterday
        </p>
      </div>

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-red/10 text-red">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-red group-hover:text-shadow-glow">
            <CountUp end={14} suffix="%" />
          </span>
        </div>
        <p className="text-xs text-gray-400">Critical Rate</p>
        <div className="h-1 bg-white/10 w-full rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-red w-[14%]" />
        </div>
      </div>

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-amber/10 text-amber">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-amber group-hover:text-shadow-glow">
            <CountUp end={3} />
          </span>
        </div>
        <p className="text-xs text-gray-400">SLA Breaches</p>
        <p className="text-[10px] text-gray-500 mt-1">Needs attention</p>
      </div>

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-cyan/10 text-cyan">
            <PhoneCall className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white group-hover:text-shadow-glow">
            <CountUp end={127} />
          </span>
        </div>
        <p className="text-xs text-gray-400">Calls Today</p>
        <p className="text-[10px] text-gray-500 mt-1">+24 from AI agent</p>
      </div>

      <div className="glass-card p-3 rounded-lg hover:animate-float hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded bg-green/10 text-green">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-green group-hover:text-shadow-glow">
            <CountUp end={62} />
          </span>
        </div>
        <p className="text-xs text-gray-400">Resolved Today</p>
        <p className="text-[10px] text-gray-500 mt-1 flex items-center">
          <span className="mr-1 text-green">↑</span> 8.4% daily goal
        </p>
      </div>

    </div>
  );
};

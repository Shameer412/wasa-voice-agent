import React from 'react';
import { Priority } from '../../types';

interface BadgeProps {
  priority?: Priority;
  text?: string;
  color?: string; // e.g. "cyan", "red"
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ priority, text, color, icon, className = "" }) => {

  if (priority) {
    const priorityConfig = {
      critical: { bg: 'bg-red/20', text: 'text-red', border: 'border-red/30', dot: 'bg-red' },
      high: { bg: 'bg-amber/20', text: 'text-amber', border: 'border-amber/30', dot: 'bg-amber' },
      medium: { bg: 'bg-cyan/20', text: 'text-cyan', border: 'border-cyan/30', dot: 'bg-cyan' },
      low: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30', dot: 'bg-gray-400' }
    };
    const conf = priorityConfig[priority];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${conf.bg} ${conf.border} ${conf.text} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${priority === 'critical' ? 'animate-pulse' : ''} ${conf.dot}`} />
        {priority.toUpperCase()}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border bg-${color}/10 border-${color}/20 text-${color} ${className}`}>
      {icon}
      {text}
    </span>
  );
};

import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green" />;
      case 'error': return <XCircle className="w-5 h-5 text-red" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber" />;
      case 'info':
      default: return <Info className="w-5 h-5 text-cyan" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green';
      case 'error': return 'border-l-red';
      case 'warning': return 'border-l-amber';
      case 'info':
      default: return 'border-l-cyan';
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-80 glass-panel border-l-4 rounded-r-lg p-4 shadow-lg flex items-start justify-between animate-slideInRight ${getBorderColor(toast.type)}`}
        >
          <div className="flex gap-3">
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-gray-100">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

import { useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Global state for toasts so it can be accessed from different parts without context if needed
// Or we can just use a singleton pattern or provide via context. We'll use a simple exported hook with global state
let memoryToasts: ToastMessage[] = [];
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(l => l());
};

export const addToastGlobal = (message: string, type: ToastType = 'info', duration: number = 3000) => {
  const id = Math.random().toString(36).substr(2, 9);
  memoryToasts = [...memoryToasts, { id, message, type, duration }];
  // Don't keep more than 3
  if (memoryToasts.length > 3) {
    memoryToasts = memoryToasts.slice(memoryToasts.length - 3);
  }
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      removeToastGlobal(id);
    }, duration);
  }
};

export const removeToastGlobal = (id: string) => {
  memoryToasts = memoryToasts.filter(t => t.id !== id);
  notifyListeners();
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>(memoryToasts);

  useEffect(() => {
    const listener = () => setToasts([...memoryToasts]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    addToastGlobal(message, type, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    removeToastGlobal(id);
  }, []);

  return { toasts, addToast, removeToast };
}

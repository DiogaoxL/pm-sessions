'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, description }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-neutral-900 text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              t.type === 'success'
                ? 'border-emerald-500/30'
                : t.type === 'error'
                  ? 'border-red-500/30'
                  : 'border-amber-500/30'
            }`}
          >
            {t.type === 'success' && (
              <CheckCircle className="size-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {t.type === 'error' && <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && (
              <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && <p className="text-xs text-neutral-400">{t.description}</p>}
            </div>

            <button
              onClick={() => dismiss(t.id)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

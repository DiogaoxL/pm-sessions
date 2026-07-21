'use client';

import { useEffect, useState, startTransition } from 'react';
import { checkCalendarAuthAction } from '@/features/auth/actions/check-calendar-auth';
import { signInWithGoogle } from '@/features/auth/actions/sign-in-with-google';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function CalendarAuthBanner() {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'revoked' | 'error'>('checking');

  useEffect(() => {
    async function checkAuth() {
      const res = await checkCalendarAuthAction();
      if (res.success) {
        setStatus('authorized');
      } else {
        setStatus(res.error || 'error');
      }
    }
    checkAuth();
  }, []);

  const handleReconnect = () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error('Failed to reconnect:', err);
      }
    });
  };

  if (status !== 'revoked') {
    return null;
  }

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-200">
            Acesso ao Google Calendar Necessário
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            As permissões de integração com a agenda do Google foram revogadas ou expiraram.
            Reconecte sua conta para garantir o sincronismo dos agendamentos.
          </p>
        </div>
      </div>
      <button
        onClick={handleReconnect}
        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
      >
        <RefreshCw className="size-3.5" />
        Reconectar Conta
      </button>
    </div>
  );
}

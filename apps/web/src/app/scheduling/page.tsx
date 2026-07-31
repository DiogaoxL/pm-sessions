'use client';

import React, { useState } from 'react';
import { AvailableSlotsContainer } from '@/features/scheduling/components/available-slots-container';
import { SchedulingForm } from '@/features/scheduling/components/scheduling-form';
import { getSessionBySlotAction } from '@/features/scheduling/actions/get-session-by-slot';
import { TimeSlot } from '@/features/scheduling/repositories/interfaces';
import { Calendar, AlertTriangle } from 'lucide-react';

export default function PublicSchedulingPage() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);

  // Block background scroll when bottom sheet is active on mobile
  React.useEffect(() => {
    if (selectedSlot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSlot]);

  const handleSelectSlot = async (slot: TimeSlot) => {
    setIsScheduled(false);
    setSelectedSlot(slot);
    setSessionId(null);
    setSessionError(null);
    setLoadingSession(true);

    try {
      const result = await getSessionBySlotAction(slot.id);
      if (result.success) {
        setSessionId(result.sessionId);
      } else {
        setSessionError(result.error);
      }
    } catch {
      setSessionError('Ocorreu um erro inesperado ao recuperar a sessão.');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleCancelSelection = () => {
    setIsScheduled(false);
    setSelectedSlot(null);
    setSessionId(null);
    setSessionError(null);
  };

  const handleSlotsLoaded = React.useCallback(
    (newSlots: TimeSlot[]) => {
      if (selectedSlot && !isScheduled) {
        const stillAvailable = newSlots.find(
          (s) => s.id === selectedSlot.id && s.status === 'OPEN',
        );
        if (!stillAvailable) {
          alert(
            'O horário selecionado foi encerrado ou preenchido. Por favor, selecione outro horário.',
          );
          setSelectedSlot(null);
          setSessionId(null);
        }
      }
    },
    [selectedSlot, isScheduled],
  );

  // Helper to format date nicely
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return localDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper to format time
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeStr;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F2849] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1d3557] via-[#0F2849] to-[#08182d] text-white">
      {/* Header */}
      <header className="border-b border-[#2B3A55] bg-[#0F2849]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-[#003870] to-[#33B458] flex items-center justify-center font-bold text-lg tracking-tight text-white shadow-lg">
              P
            </div>
            <span className="font-semibold tracking-tight text-lg">PM Sessions</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#33B458]/10 text-[#33B458] border border-[#33B458]/20 font-medium">
            Agendamento Público
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Available Slots */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-[#162133]/90 border border-[#2B3A55] rounded-3xl p-6 md:p-8 shadow-xl">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-white">
              Escolha seu Horário
            </h1>
            <p className="text-[#AEB8C5] text-sm md:text-base mb-6">
              Selecione uma das datas e horários disponíveis na lista abaixo para realizar sua
              inscrição na sessão.
            </p>

            <AvailableSlotsContainer
              refreshKey={refreshKey}
              selectedSlotId={selectedSlot?.id}
              onSelectSlot={handleSelectSlot}
              onSlotsLoaded={handleSlotsLoaded}
            />
          </div>
        </div>

        {/* Right Side: Form Orchestration (Desktop Only) */}
        <div className="hidden md:block w-full md:w-1/3 sticky top-24">
          {selectedSlot ? (
            /* Selected Slot Form or Loading/Error */
            <div className="space-y-6">
              {loadingSession && (
                <div className="bg-[#162133]/90 border border-[#2B3A55] rounded-3xl p-6 md:p-8 text-center py-16 animate-pulse">
                  <div className="size-10 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 w-48 bg-gray-700 rounded mx-auto mb-2"></div>
                  <div className="h-3 w-32 bg-gray-700 rounded mx-auto"></div>
                </div>
              )}

              {sessionError && (
                <div className="bg-red-950/30 border border-red-500/20 rounded-3xl p-6 md:p-8 text-center space-y-4">
                  <div className="size-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="size-6 text-red-400" />
                  </div>
                  <p className="text-red-200 text-sm">{sessionError}</p>
                  <button
                    type="button"
                    onClick={handleCancelSelection}
                    className="px-4 py-2 border border-red-500/20 hover:bg-red-500/10 text-red-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                </div>
              )}

              {sessionId && !loadingSession && !sessionError && (
                <div className="bg-[#162133]/90 border border-[#2B3A55] rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                  <div className="border-b border-[#2B3A55] pb-4">
                    <span className="text-xs text-[#AEB8C5] uppercase font-bold tracking-wider">
                      Horário Selecionado
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {formatDate(selectedSlot.date)}
                    </h3>
                    <p className="text-sm text-[#AEB8C5] mt-0.5">
                      Das {formatTime(selectedSlot.start_time)} às{' '}
                      {formatTime(selectedSlot.end_time)}
                    </p>
                  </div>

                  <SchedulingForm
                    sessionId={sessionId}
                    timeSlotId={selectedSlot.id}
                    onSuccess={() => {
                      setIsScheduled(true);
                      setRefreshKey((prev) => prev + 1);
                    }}
                    onCancel={handleCancelSelection}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Empty Selection State */
            <div className="bg-[#162133]/40 border border-[#2B3A55] border-dashed rounded-3xl p-8 text-center py-20 space-y-4">
              <div className="size-12 bg-[#2B3A55]/30 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="size-6 text-[#AEB8C5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Nenhum horário selecionado</h3>
                <p className="text-xs text-[#AEB8C5] max-w-[240px] mx-auto leading-relaxed">
                  Escolha um dos horários disponíveis ao lado para abrir o formulário de inscrição.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Sheet Overlay */}
      {selectedSlot && (
        <div className="md:hidden fixed inset-0 bg-[#08182d]/80 backdrop-blur-sm z-50 flex flex-col justify-end">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={handleCancelSelection} />

          {/* Bottom Sheet Container */}
          <div className="relative bg-[#162133] border-t border-[#2B3A55] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto w-full space-y-6 z-10 animate-in slide-in-from-bottom duration-200">
            {/* Drag Indicator handle */}
            <div className="w-12 h-1 bg-[#2B3A55] rounded-full mx-auto mb-2" />

            {loadingSession && (
              <div className="text-center py-12 animate-pulse">
                <div className="size-10 bg-gray-700 rounded-full mx-auto mb-4" />
                <div className="h-4 w-48 bg-gray-700 rounded mx-auto mb-2" />
                <div className="h-3 w-32 bg-gray-700 rounded mx-auto" />
              </div>
            )}

            {sessionError && (
              <div className="text-center space-y-4 py-6">
                <div className="size-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="size-6 text-red-400" />
                </div>
                <p className="text-red-200 text-sm">{sessionError}</p>
                <button
                  type="button"
                  onClick={handleCancelSelection}
                  className="px-4 py-2 border border-red-500/20 hover:bg-red-500/10 text-red-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
              </div>
            )}

            {sessionId && !loadingSession && !sessionError && (
              <div className="space-y-4">
                <div className="border-b border-[#2B3A55] pb-4">
                  <span className="text-xs text-[#AEB8C5] uppercase font-bold tracking-wider">
                    Horário Selecionado
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {formatDate(selectedSlot.date)}
                  </h3>
                  <p className="text-sm text-[#AEB8C5] mt-0.5">
                    Das {formatTime(selectedSlot.start_time)} às {formatTime(selectedSlot.end_time)}
                  </p>
                </div>

                <SchedulingForm
                  sessionId={sessionId}
                  timeSlotId={selectedSlot.id}
                  onSuccess={() => {
                    setIsScheduled(true);
                    setRefreshKey((prev) => prev + 1);
                  }}
                  onCancel={handleCancelSelection}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2B3A55] py-8 text-center text-xs text-[#AEB8C5]/60 bg-[#08182d]/50">
        <p>© 2026 PM Sessions — Pulse Architecture Foundation</p>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { TimeSlotWithSessions } from '../../admin/repositories/admin-dashboard.repository';
import { useToast } from './ui/toaster';
import { AdminDialog, AdminConfirmDialog } from './ui/admin-dialog';
import { LoadingButton } from './ui/loading-button';
import { Button } from '@/components/ui/button';
import {
  createSlotAction,
  updateSlotAction,
  closeSlotAction,
  deleteSlotAction,
  syncSlotCalendarEventsAction,
} from '../actions/slot-actions';

import {
  removeParticipantAction,
  moveParticipantAction,
  updateSessionCapacityAction,
  createSessionAction,
} from '../actions/participant-actions';
import {
  Calendar,
  Users,
  Video,
  Trash2,
  ArrowRightLeft,
  Plus,
  Info,
  ChevronRight,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
} from 'lucide-react';

interface TimeSlotStatusBadgeProps {
  status: 'OPEN' | 'FULL' | 'CLOSED';
}

function TimeSlotStatusBadge({ status }: TimeSlotStatusBadgeProps) {
  const classes = {
    OPEN: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    FULL: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    CLOSED: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400',
  }[status];

  const labels = { OPEN: 'Aberto', FULL: 'Lotado', CLOSED: 'Encerrado' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {labels[status]}
    </span>
  );
}

interface AdminTimeSlotListProps {
  slots: TimeSlotWithSessions[];
  hosts: string[];
}

export function AdminTimeSlotList({ slots, hosts }: AdminTimeSlotListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Expansible Slots
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>(() => {
    if (slots.length > 0) {
      return { [slots[0].id]: true };
    }
    return {};
  });

  const toggleSlot = (id: string) => {
    setExpandedSlots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotWithSessions | null>(null);
  const [closingSlot, setClosingSlot] = useState<TimeSlotWithSessions | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<TimeSlotWithSessions | null>(null);
  const [editingSession, setEditingSession] = useState<{
    id: string;
    capacity: number;
    currentParticipants?: number;
  } | null>(null);
  const [removingParticipant, setRemovingParticipant] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [movingParticipant, setMovingParticipant] = useState<{
    id: string;
    name: string;
    slot: TimeSlotWithSessions;
    currentSessionId: string;
  } | null>(null);

  const [pendingEditSlot, setPendingEditSlot] = useState<{
    slot: TimeSlotWithSessions;
    formData: typeof slotFormData;
  } | null>(null);

  // New session creation states
  const [creatingSessionForSlot, setCreatingSessionForSlot] = useState<string | null>(null);
  const [newSessionHost, setNewSessionHost] = useState<string>('');
  const [newSessionCapacity, setNewSessionCapacity] = useState<number | ''>(3);

  // Form states (Creation & Complete Edit Form - BUG 02)
  const [slotFormData, setSlotFormData] = useState<{
    date: string;
    start_time: string;
    end_time: string;
    capacity: number | '';
  }>({
    date: new Date().toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '15:00',
    capacity: 3,
  });

  const [sessionEditCapacity, setSessionEditCapacity] = useState<number | ''>(3);

  // Handlers
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slotFormData.start_time >= slotFormData.end_time) {
      toast({
        type: 'error',
        title: 'Horário Inválido',
        description: 'A hora de início deve ser anterior à hora de término.',
      });
      return;
    }

    startTransition(async () => {
      const capacity =
        typeof slotFormData.capacity === 'number' && slotFormData.capacity > 0
          ? slotFormData.capacity
          : 3;
      const res = await createSlotAction({
        date: slotFormData.date,
        start_time: `${slotFormData.start_time}:00`,
        end_time: `${slotFormData.end_time}:00`,
        capacity,
        status: 'OPEN',
      });

      if (res.success) {
        toast({
          type: 'success',
          title: 'Slot Criado',
          description: 'O time slot foi criado e publicado com sucesso.',
        });
        setIsCreateOpen(false);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Criar Slot',
          description: res.error,
        });
      }
    });
  };

  // Complete Slot Edit Form (BUG 02)
  const executeSlotUpdate = async (
    slotId: string,
    formData: typeof slotFormData,
    needsCalendarSync: boolean,
  ) => {
    startTransition(async () => {
      const capacity =
        typeof formData.capacity === 'number' && formData.capacity > 0 ? formData.capacity : 3;

      // 1. Update Database
      const res = await updateSlotAction(slotId, {
        date: formData.date,
        start_time: `${formData.start_time}:00`,
        end_time: `${formData.end_time}:00`,
        capacity,
      });

      if (res.success) {
        // 2. Sincronização do Google Calendar se a atualização do banco retornar sucesso e se necessário
        if (needsCalendarSync) {
          const syncRes = await syncSlotCalendarEventsAction(
            slotId,
            formData.date,
            `${formData.start_time}:00`,
            `${formData.end_time}:00`,
          );
          if (!syncRes.success) {
            toast({
              type: 'error',
              title: 'Aviso de Calendário',
              description:
                'Horário salvo no banco, mas falhou ao sincronizar alguns eventos no Google Calendar.',
            });
          }
        }

        toast({
          type: 'success',
          title: 'Slot Atualizado',
          description: 'Horário atualizado com sucesso.',
        });
        setEditingSlot(null);
        setPendingEditSlot(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Atualizar Slot',
          description: res.error,
        });
      }
    });
  };

  const handleEditSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    if (slotFormData.start_time >= slotFormData.end_time) {
      toast({
        type: 'error',
        title: 'Horário Inválido',
        description: 'A hora de início deve ser anterior à hora de término.',
      });
      return;
    }

    const hasActiveParticipants = editingSlot.sessions.some((s) => s.current_participants > 0);
    const timeChanged =
      editingSlot.date !== slotFormData.date ||
      editingSlot.start_time.slice(0, 5) !== slotFormData.start_time ||
      editingSlot.end_time.slice(0, 5) !== slotFormData.end_time;

    if (hasActiveParticipants && timeChanged) {
      // Abre o modal de confirmação
      setPendingEditSlot({
        slot: editingSlot,
        formData: { ...slotFormData },
      });
    } else {
      // Salva imediatamente sem sincronizar o calendário (pois não mudou horário)
      await executeSlotUpdate(editingSlot.id, slotFormData, false);
    }
  };

  // Close Slot Cancellation Flow
  const handleCloseSlot = async (slot: TimeSlotWithSessions) => {
    startTransition(async () => {
      const res = await closeSlotAction(slot.id);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Slot Encerrado',
          description: 'O time slot foi encerrado e os participantes cancelados com sucesso.',
        });
        setClosingSlot(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Encerrar Slot',
          description: res.error,
        });
      }
    });
  };

  // Real Delete Slot (BUG 03)
  const handleDeleteSlot = async () => {
    if (!deletingSlot) return;

    startTransition(async () => {
      const res = await deleteSlotAction(deletingSlot.id);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Slot Excluído',
          description: 'O slot foi removido permanentemente do banco de dados.',
        });
        setDeletingSlot(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Excluir Slot',
          description: res.error,
        });
      }
    });
  };

  const handleEditSessionCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;

    const capacity =
      typeof sessionEditCapacity === 'number' && sessionEditCapacity > 0 ? sessionEditCapacity : 3;
    const currentParticipants = editingSession.currentParticipants || 0;

    if (capacity < currentParticipants) {
      return;
    }

    startTransition(async () => {
      const res = await updateSessionCapacityAction(editingSession.id, capacity);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Capacidade Atualizada',
          description: 'A capacidade da sessão foi atualizada com sucesso.',
        });
        setEditingSession(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Atualizar Capacidade',
          description: res.error,
        });
      }
    });
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingSessionForSlot || !newSessionHost) return;

    startTransition(async () => {
      const capacity =
        typeof newSessionCapacity === 'number' && newSessionCapacity > 0 ? newSessionCapacity : 3;
      const res = await createSessionAction(creatingSessionForSlot, newSessionHost, capacity);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Sessão Criada',
          description: 'A nova sessão foi adicionada a este horário com sucesso.',
        });
        setCreatingSessionForSlot(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Criar Sessão',
          description: res.error,
        });
      }
    });
  };

  const handleRemoveParticipant = async () => {
    if (!removingParticipant) return;

    startTransition(async () => {
      const res = await removeParticipantAction(removingParticipant.id);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Participante Removido',
          description: 'O agendamento do participante foi cancelado.',
        });
        setRemovingParticipant(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Remover Participante',
          description: res.error,
        });
      }
    });
  };

  const handleMoveParticipant = async (targetSessionId: string) => {
    if (!movingParticipant) return;

    startTransition(async () => {
      const res = await moveParticipantAction(movingParticipant.id, targetSessionId);

      if (res.success) {
        toast({
          type: 'success',
          title: 'Participante Movido',
          description: 'O candidato foi realocado de sala com sucesso.',
        });
        setMovingParticipant(null);
        router.refresh();
      } else {
        toast({
          type: 'error',
          title: 'Erro ao Mover Participante',
          description: res.error,
        });
      }
    });
  };

  const handleFutureFeature = () => {
    toast({
      type: 'warning',
      title: 'Funcionalidade Bloqueada',
      description: 'Disponível na próxima Sprint.',
    });
  };

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, TimeSlotWithSessions[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const currentParticipants = editingSession?.currentParticipants || 0;
  const targetCapacity = typeof sessionEditCapacity === 'number' ? sessionEditCapacity : 0;
  const isCapacityInvalid = targetCapacity < currentParticipants;

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Toolbar (Cleaned extra lines) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900/40 p-4 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSlotFormData({
                date: new Date().toISOString().split('T')[0],
                start_time: '14:00',
                end_time: '15:00',
                capacity: 3,
              });
              setIsCreateOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0"
          >
            <Plus className="size-4" /> Novo Time Slot
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1 lg:justify-end">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar slots, hosts, participantes..."
              className="w-full pl-9 pr-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
            />
          </div>

          {/* Status Dropdown */}
          <div className="group relative inline-block">
            <select
              disabled
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-400 appearance-none pr-8 cursor-not-allowed"
            >
              <option>Status</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-neutral-500 pointer-events-none" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
              Funcionalidade em desenvolvimento.
            </span>
          </div>

          {/* Data Dropdown */}
          <div className="group relative inline-block">
            <select
              disabled
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-400 appearance-none pr-8 cursor-not-allowed"
            >
              <option>Data</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-neutral-500 pointer-events-none" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
              Funcionalidade em desenvolvimento.
            </span>
          </div>

          {/* Host Dropdown */}
          <div className="group relative inline-block">
            <select
              disabled
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-400 appearance-none pr-8 cursor-not-allowed"
            >
              <option>Host</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-neutral-500 pointer-events-none" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
              Funcionalidade em desenvolvimento.
            </span>
          </div>

          {/* Filters Toggle Button */}
          <div className="group relative inline-block">
            <button
              onClick={handleFutureFeature}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z"
                />
              </svg>
            </button>
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
              Funcionalidade em desenvolvimento.
            </span>
          </div>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40 p-6">
          <div className="size-16 rounded-2xl bg-neutral-900/60 flex items-center justify-center mb-4 border border-neutral-800">
            <Calendar className="size-8 text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-300">Nenhum slot cadastrado</h3>
          <p className="mt-1 text-sm text-neutral-500 max-w-sm">
            Crie um novo Time Slot para começar a gerenciar as sessões.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(slotsByDate).map(([date, dateSlots]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Calendar className="size-3.5 text-neutral-500" />
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <div className="flex flex-col gap-4">
                {dateSlots.map((slot) => {
                  const isExpanded = expandedSlots[slot.id];
                  const hasActiveParticipants = slot.sessions.some(
                    (s) => s.current_participants > 0,
                  );
                  const totalOccupied = slot.sessions.reduce(
                    (acc, s) => acc + s.current_participants,
                    0,
                  );
                  const totalCapacity = slot.sessions.reduce((acc, s) => acc + s.capacity, 0);
                  const totalPercent =
                    totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

                  return (
                    <div
                      key={slot.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden hover:border-neutral-700 transition-colors"
                    >
                      {/* Slot Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-4 bg-neutral-900/50">
                        <div
                          className="flex items-center gap-3 cursor-pointer select-none"
                          onClick={() => toggleSlot(slot.id)}
                        >
                          <span className="text-neutral-500 hover:text-white transition-colors">
                            {isExpanded ? (
                              <ChevronDown className="size-4" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                          </span>
                          <span className="font-semibold text-white">
                            {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                          </span>
                          <TimeSlotStatusBadge status={slot.status} />
                          <span className="text-xs text-neutral-500 hidden sm:inline">•</span>
                          <span className="text-xs text-neutral-400">
                            Cap. padrão:{' '}
                            <span className="text-neutral-200 font-medium">{slot.capacity}</span>
                          </span>
                          <span className="text-xs text-neutral-400">
                            Confirmados:{' '}
                            <span className="text-neutral-200 font-medium">
                              {totalOccupied}/{totalCapacity} ({totalPercent}%)
                            </span>
                          </span>
                        </div>

                        {/* Direct Header Actions (Editar, Fechar, Excluir) */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {hasActiveParticipants && (
                            <span
                              className="text-[10px] text-amber-500 font-medium flex items-center gap-1.5 mr-2"
                              title="Alterações de horário enviarão notificações automaticamente aos participantes confirmados"
                            >
                              <span>🟡</span> Alterações enviarão notificações automaticamente
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCreatingSessionForSlot(slot.id);
                              setNewSessionHost(hosts[0] || '');
                              setNewSessionCapacity(slot.capacity);
                            }}
                            className="h-7 text-xs border-emerald-800 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 hover:text-emerald-300"
                          >
                            + Nova Sessão
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSlot(slot);
                              setSlotFormData({
                                date: slot.date,
                                start_time: slot.start_time.slice(0, 5),
                                end_time: slot.end_time.slice(0, 5),
                                capacity: slot.capacity,
                              });
                            }}
                            className="h-7 text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                          >
                            Editar
                          </Button>

                          {/* BUG 01: Toggle Fechar */}
                          {slot.status !== 'CLOSED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setClosingSlot(slot)}
                              className="h-7 text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                            >
                              Fechar
                            </Button>
                          )}

                          {/* BUG 03: Real Excluir */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={slot.status !== 'CLOSED'}
                            onClick={() => setDeletingSlot(slot)}
                            className="h-7 text-xs border-red-950 bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>

                      {/* Sessions (Collapsible) */}
                      {isExpanded && (
                        <div className="p-5 bg-neutral-950/20 border-t border-neutral-850">
                          {slot.sessions.length === 0 ? (
                            <div className="py-4 text-sm text-neutral-500 italic flex items-center gap-2">
                              <Info className="size-4 text-neutral-600" />
                              Nenhuma sessão criada ainda.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                                <Clock className="size-3.5 text-neutral-500" /> SESSÕES
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {slot.sessions.map((session, sIdx) => {
                                  const charId = String.fromCharCode(65 + sIdx); // Sala A, Sala B...
                                  const sessionOccupied = session.current_participants;
                                  const sessionCapacity = session.capacity;
                                  const sessionPercent =
                                    sessionCapacity > 0
                                      ? Math.round((sessionOccupied / sessionCapacity) * 100)
                                      : 0;

                                  return (
                                    <div
                                      key={session.id}
                                      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col gap-4"
                                    >
                                      {/* Session Info */}
                                      <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-sky-400" />
                                            <span className="text-sm font-semibold text-neutral-200">
                                              Sala {charId} ({sessionOccupied}/{sessionCapacity})
                                            </span>
                                          </div>
                                          <span className="text-xs text-neutral-500 block">
                                            Host: {session.organizer_email}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={() => {
                                              setEditingSession({
                                                id: session.id,
                                                capacity: session.capacity,
                                                currentParticipants: session.current_participants,
                                              });
                                              setSessionEditCapacity(session.capacity);
                                            }}
                                            className="text-[10px] h-6 border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                                          >
                                            Editar Capacidade
                                          </Button>

                                          {/* Slot Estrutural para Acoes de Sessao Futuras */}
                                          <div className="relative group/actions inline-block">
                                            <Button
                                              variant="outline"
                                              size="xs"
                                              disabled
                                              className="text-[10px] h-6 px-1.5 border-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                                              title="Mais acoes (Sprint futura)"
                                            >
                                              <span className="font-bold text-xs select-none">
                                                •••
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Occupancy Progress Bar */}
                                      <div className="space-y-1">
                                        <div className="h-2 w-full bg-neutral-850 rounded-full overflow-hidden flex">
                                          <div
                                            className="h-full bg-sky-500 rounded-full"
                                            style={{ width: `${sessionPercent}%` }}
                                          />
                                        </div>
                                        <div className="flex justify-between text-[9px] text-neutral-500 font-medium">
                                          <span>Capacidade: {sessionCapacity}</span>
                                          <span>{sessionPercent}% ocupado</span>
                                        </div>
                                      </div>

                                      {/* Meet Link */}
                                      {session.meet_url && (
                                        <a
                                          href={session.meet_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors self-start border border-sky-500/10 hover:border-sky-500/30 px-2 py-0.5 rounded bg-sky-500/5"
                                        >
                                          <Video className="size-3" /> Abrir Google Meet{' '}
                                          <ExternalLink className="size-2.5" />
                                        </a>
                                      )}

                                      {/* Session Participants */}
                                      <div className="space-y-2 pt-2 border-t border-neutral-850">
                                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                          Participantes
                                        </span>
                                        {session.participants.length === 0 ? (
                                          <span className="text-xs text-neutral-500 italic block">
                                            Nenhum participante
                                          </span>
                                        ) : (
                                          <div className="flex flex-col gap-2">
                                            {session.participants.map((p) => (
                                              <div
                                                key={p.id}
                                                className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/50 border border-neutral-850"
                                              >
                                                <div className="flex flex-col gap-0.5 text-xs">
                                                  <span className="font-semibold text-neutral-200">
                                                    {p.name}
                                                  </span>
                                                  <span className="text-[10px] text-neutral-500">
                                                    {p.email}
                                                  </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                  <button
                                                    onClick={() =>
                                                      setMovingParticipant({
                                                        id: p.id,
                                                        name: p.name,
                                                        slot,
                                                        currentSessionId: session.id,
                                                      })
                                                    }
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-all"
                                                  >
                                                    <ArrowRightLeft className="size-2.5" /> Mover
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      setRemovingParticipant({
                                                        id: p.id,
                                                        name: p.name,
                                                      })
                                                    }
                                                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                                                    title="Cancelar inscrição"
                                                  >
                                                    <Trash2 className="size-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra Dashboard Panels (Activities, Shortcuts and Legend - No extra separators) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Atividades Recentes */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Atividades Recentes
          </h3>
          <div className="flex flex-col divide-y divide-neutral-850">
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-sky-400" />
                <span>➕ Novo Time Slot criado (14:00–15:00) por Diogo</span>
              </span>
              <span className="text-neutral-500 text-[10px]">há 10 min</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>👤 Participante inscrito: Fulano de Tal na Sala A</span>
              </span>
              <span className="text-neutral-500 text-[10px]">há 12 min</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-purple-400" />
                <span>✏ Capacidade da Sala B alterada para 1</span>
              </span>
              <span className="text-neutral-500 text-[10px]">há 1 h</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-400" />
                <span>⛔ Time Slot (09:00–10:00) fechado</span>
              </span>
              <span className="text-neutral-500 text-[10px]">há 2 h</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={handleFutureFeature}
            className="w-full text-xs hover:bg-neutral-850"
          >
            Ver todas as atividades
          </Button>
        </div>

        {/* Atalhos Rápidos */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Atalhos Rápidos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleFutureFeature}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900 text-center gap-2 transition-all"
            >
              <Calendar className="size-5 text-neutral-500" />
              <span className="text-[10px] font-medium text-neutral-300">Gerenciar Slots</span>
            </button>
            <button
              onClick={handleFutureFeature}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900 text-center gap-2 transition-all"
            >
              <Users className="size-5 text-neutral-500" />
              <span className="text-[10px] font-medium text-neutral-300">Gerenciar Sessões</span>
            </button>
            <button
              onClick={handleFutureFeature}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900 text-center gap-2 transition-all"
            >
              <Users className="size-5 text-neutral-500" />
              <span className="text-[10px] font-medium text-neutral-300">
                Gerenciar Participantes
              </span>
            </button>
            <button
              onClick={handleFutureFeature}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900 text-center gap-2 transition-all"
            >
              <FileText className="size-5 text-neutral-500" />
              <span className="text-[10px] font-medium text-neutral-300">Relatórios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legenda de Status */}
      <div className="flex flex-wrap items-center gap-4 bg-neutral-900/20 border border-neutral-850 rounded-lg p-3 text-xs text-neutral-400">
        <span className="font-semibold text-neutral-300">Legenda de Status:</span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" /> Aberto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" /> Fechado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-purple-500" /> Lotado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-500" /> Cancelado
        </span>
      </div>

      {/* Modais */}
      {/* Criar Slot Modal */}
      <AdminDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Novo Time Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Data
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={slotFormData.date}
              onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Hora Inicial
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
                value={slotFormData.start_time}
                onChange={(e) => setSlotFormData({ ...slotFormData, start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Hora Final
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
                value={slotFormData.end_time}
                onChange={(e) => setSlotFormData({ ...slotFormData, end_time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Capacidade Padrão
            </label>
            <input
              type="number"
              min={1}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={slotFormData.capacity}
              onChange={(e) => {
                const val = e.target.value;
                setSlotFormData({
                  ...slotFormData,
                  capacity: val === '' ? '' : parseInt(val) || 0,
                });
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              Salvar
            </LoadingButton>
          </div>
        </form>
      </AdminDialog>

      {/* BUG 02: Editar Slot Modal (Formulário completo igual ao da criação) */}
      <AdminDialog
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title="Editar Time Slot"
      >
        <form onSubmit={handleEditSlotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Data
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={slotFormData.date}
              onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Hora Inicial
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
                value={slotFormData.start_time}
                onChange={(e) => setSlotFormData({ ...slotFormData, start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Hora Final
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
                value={slotFormData.end_time}
                onChange={(e) => setSlotFormData({ ...slotFormData, end_time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Capacidade Padrão
            </label>
            <input
              type="number"
              min={1}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={slotFormData.capacity}
              onChange={(e) => {
                const val = e.target.value;
                setSlotFormData({
                  ...slotFormData,
                  capacity: val === '' ? '' : parseInt(val) || 0,
                });
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingSlot(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              Salvar
            </LoadingButton>
          </div>
        </form>
      </AdminDialog>

      {/* Fechar Slot Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={!!closingSlot}
        onClose={() => setClosingSlot(null)}
        onConfirm={() => closingSlot && handleCloseSlot(closingSlot)}
        title="Encerrar Time Slot"
        description="Tem certeza que deseja encerrar este time slot? Você poderá reabri-lo posteriormente se não houver participantes."
        confirmLabel="Fechar Slot"
        loading={isPending}
      />

      {/* BUG 03: Excluir Slot Real Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        onConfirm={handleDeleteSlot}
        title="Excluir Time Slot Permanentemente"
        description="Tem certeza que deseja remover este time slot permanentemente do banco de dados? Esta ação não pode ser desfeita."
        confirmLabel="Excluir Definitivamente"
        loading={isPending}
        variant="destructive"
      />

      {/* Confirmar Alteração de Horário Modal */}
      {pendingEditSlot && (
        <AdminConfirmDialog
          isOpen={!!pendingEditSlot}
          onClose={() => setPendingEditSlot(null)}
          onConfirm={() =>
            executeSlotUpdate(pendingEditSlot.slot.id, pendingEditSlot.formData, true)
          }
          title="Alterar horário da sessão?"
          description={
            <div className="space-y-4 text-sm text-neutral-300">
              <p>Existem participantes já confirmados neste horário.</p>
              <div className="py-2.5 px-3.5 bg-neutral-950/40 border border-neutral-800 rounded-xl space-y-1 text-neutral-400">
                <p>• {pendingEditSlot.slot.sessions.length} sessões serão atualizadas</p>
                <p>
                  •{' '}
                  {pendingEditSlot.slot.sessions.reduce(
                    (acc, s) => acc + s.current_participants,
                    0,
                  )}{' '}
                  participantes receberão um e-mail automático do Google Calendar
                </p>
              </div>
              <p className="font-semibold text-neutral-200">Deseja continuar?</p>
            </div>
          }
          confirmLabel="Alterar horário e notificar participantes"
          cancelLabel="Cancelar"
          loading={isPending}
        />
      )}

      {/* Editar Capacidade Sessão Modal */}
      <AdminDialog
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        title="Alterar Capacidade da Sessão"
      >
        <form onSubmit={handleEditSessionCapacity} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Nova Capacidade Máxima
            </label>
            <input
              type="number"
              min={1}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={sessionEditCapacity}
              onChange={(e) => {
                const val = e.target.value;
                setSessionEditCapacity(val === '' ? '' : parseInt(val) || 0);
              }}
            />
            {isCapacityInvalid && (
              <p className="mt-2 text-xs text-amber-400 font-medium leading-relaxed">
                A nova capacidade ({targetCapacity}) não pode ser menor que o número de
                participantes atualmente confirmados nesta sala ({currentParticipants}).
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingSession(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <LoadingButton type="submit" loading={isPending} disabled={isCapacityInvalid}>
              Salvar
            </LoadingButton>
          </div>
        </form>
      </AdminDialog>

      {/* Remover Participante Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={!!removingParticipant}
        onClose={() => setRemovingParticipant(null)}
        onConfirm={handleRemoveParticipant}
        title="Cancelar Agendamento"
        description={`Tem certeza que deseja remover o participante ${removingParticipant?.name}? Esta ação é permanente e sincronizará no Google Calendar.`}
        confirmLabel="Remover"
        loading={isPending}
        variant="destructive"
      />

      {/* Mover Participante Dialog */}
      <AdminDialog
        isOpen={!!movingParticipant}
        onClose={() => setMovingParticipant(null)}
        title="Mover Candidato de Sessão"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-300">
            Selecione uma sessão alternativa no mesmo horário para realocar o participante:{' '}
            <strong>{movingParticipant?.name}</strong>.
          </p>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {movingParticipant?.slot.sessions
              .filter((s) => s.id !== movingParticipant.currentSessionId)
              .map((session) => {
                const isFull = session.current_participants >= session.capacity;

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950/40"
                  >
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-neutral-200">
                        {session.organizer_email}
                      </span>
                      <span className="text-neutral-500 mt-0.5">
                        Vagas: {session.current_participants}/{session.capacity}
                      </span>
                    </div>
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      disabled={isFull || isPending}
                      loading={isPending}
                      onClick={() => handleMoveParticipant(session.id)}
                    >
                      {isFull ? 'Cheia' : 'Mover para cá'}
                    </LoadingButton>
                  </div>
                );
              })}
            {movingParticipant &&
              movingParticipant.slot.sessions.filter(
                (s) => s.id !== movingParticipant.currentSessionId,
              ).length === 0 && (
                <p className="text-sm text-neutral-500 italic py-4 text-center">
                  Não existem outras sessões cadastradas para este slot de horário.
                </p>
              )}
          </div>
        </div>
      </AdminDialog>

      {/* Criar Sessao Manual Modal */}
      <AdminDialog
        isOpen={!!creatingSessionForSlot}
        onClose={() => setCreatingSessionForSlot(null)}
        title="Nova Sessão"
      >
        <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Host (Organizador)
            </label>
            <select
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={newSessionHost}
              onChange={(e) => setNewSessionHost(e.target.value)}
            >
              <option value="">Selecione um host...</option>
              {hosts.map((host) => (
                <option key={host} value={host}>
                  {host}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Capacidade da Sessão
            </label>
            <input
              type="number"
              min={1}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-700"
              value={newSessionCapacity}
              onChange={(e) => {
                const val = e.target.value;
                setNewSessionCapacity(val === '' ? '' : parseInt(val) || 0);
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreatingSessionForSlot(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              Criar Sessão
            </LoadingButton>
          </div>
        </form>
      </AdminDialog>
    </div>
  );
}

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { TimeSlot, Session, Participant } from '../../scheduling/repositories/interfaces';

export interface AdminDashboardStats {
  totalParticipants: number;
  availableSlots: number;
  activeSessions: number;
}

export interface SessionWithParticipants extends Session {
  participants: Participant[];
}

export interface TimeSlotWithSessions extends TimeSlot {
  sessions: SessionWithParticipants[];
}

export interface IAdminDashboardRepository {
  getDashboardStats(): Promise<AdminDashboardStats>;
  getTimeSlotsWithSessions(): Promise<TimeSlotWithSessions[]>;
}

export class AdminDashboardRepository implements IAdminDashboardRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Retorna métricas consolidadas para o Dashboard.
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [participantsResult, slotsResult, sessionsResult] = await Promise.all([
      this.supabase
        .from('participants')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'CONFIRMED'),
      this.supabase
        .from('time_slots')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'OPEN'),
      this.supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE'),
    ]);

    if (participantsResult.error) throw participantsResult.error;
    if (slotsResult.error) throw slotsResult.error;
    if (sessionsResult.error) throw sessionsResult.error;

    return {
      totalParticipants: participantsResult.count ?? 0,
      availableSlots: slotsResult.count ?? 0,
      activeSessions: sessionsResult.count ?? 0,
    };
  }

  /**
   * Retorna todos os time slots com suas sessões e respectivos participantes confirmados,
   * ordenados cronologicamente.
   */
  async getTimeSlotsWithSessions(): Promise<TimeSlotWithSessions[]> {
    const { data: slots, error: slotsError } = await this.supabase
      .from('time_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (slotsError) throw slotsError;
    if (!slots || slots.length === 0) return [];

    const slotIds = slots.map((s) => s.id);

    const { data: sessions, error: sessionsError } = await this.supabase
      .from('sessions')
      .select('*')
      .in('time_slot_id', slotIds)
      .order('created_at', { ascending: true });

    if (sessionsError) throw sessionsError;

    const sessionIds = (sessions ?? []).map((s) => s.id);

    let participants: Participant[] = [];
    if (sessionIds.length > 0) {
      const { data: participantsData, error: participantsError } = await this.supabase
        .from('participants')
        .select('*')
        .in('session_id', sessionIds)
        .eq('status', 'CONFIRMED');

      if (participantsError) throw participantsError;
      participants = participantsData ?? [];
    }

    // Build sessions with participants
    const sessionsWithParticipants: SessionWithParticipants[] = (sessions ?? []).map((session) => ({
      ...session,
      participants: participants.filter((p) => p.session_id === session.id),
    }));

    // Build time slots with sessions
    return slots.map((slot) => ({
      ...slot,
      sessions: sessionsWithParticipants.filter((s) => s.time_slot_id === slot.id),
    }));
  }
}

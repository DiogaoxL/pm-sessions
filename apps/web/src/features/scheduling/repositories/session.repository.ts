import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { ISessionRepository, Session } from './interfaces';

export class SessionRepository implements ISessionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Busca sessões ativas (status = 'AVAILABLE') associadas a um time_slot_id.
   */
  async findOpenSessionsByTimeSlot(timeSlotId: string): Promise<Session[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('time_slot_id', timeSlotId)
      .eq('status', 'AVAILABLE');

    if (error) {
      throw error;
    }

    return data || [];
  }

  async removeParticipant(participantId: string): Promise<void> {
    const { error } = await (
      this.supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => PromiseLike<{ error: { message: string; code?: string } | null }>
    )('remove_participant', {
      p_participant_id: participantId,
    });

    if (error) {
      throw error;
    }
  }

  async moveParticipant(participantId: string, targetSessionId: string): Promise<void> {
    const { error } = await (
      this.supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => PromiseLike<{ error: { message: string; code?: string } | null }>
    )('move_participant', {
      p_participant_id: participantId,
      p_target_session_id: targetSessionId,
    });

    if (error) {
      throw error;
    }
  }

  async updateSessionCalendar(
    sessionId: string,
    calendarEventId: string | null,
    meetUrl: string | null,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .update({
        calendar_event_id: calendarEventId,
        meet_url: meetUrl,
      })
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  }

  async findSessionById(id: string): Promise<Session | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async findSessionsByTimeSlot(timeSlotId: string): Promise<Session[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('time_slot_id', timeSlotId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async allocateParticipant(
    timeSlotId: string,
    email: string,
    name: string,
    phone: string | null,
    organizerEmail: string,
  ): Promise<{
    participant_id: string;
    session_id: string;
    is_new_session: boolean;
    organizer_email: string;
    calendar_event_id: string | null;
    meet_url: string | null;
  }> {
    console.log(
      '[TRACE 4.1] allocate_participant RPC — chamando Supabase. timeSlotId:',
      timeSlotId,
      'email:',
      email,
      'organizer:',
      organizerEmail,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase as any).rpc('allocate_participant', {
      p_time_slot_id: timeSlotId,
      p_email: email,
      p_name: name,
      p_phone: phone,
      p_organizer_email: organizerEmail,
    });

    console.log('[TRACE 4.2] allocate_participant RPC — resposta bruta:', {
      data: JSON.stringify(data),
      error: JSON.stringify(error),
    });

    if (error) {
      console.error('[TRACE 4.2] RPC ERRO:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];
    if (!rows || rows.length === 0) {
      console.error('[TRACE 4.3] RPC retornou array vazio. data:', JSON.stringify(data));
      throw new Error('Allocation returned empty result');
    }

    const result = rows[0];

    return {
      participant_id: result.participant_id,
      session_id: result.session_id,
      is_new_session: result.is_new_session,
      organizer_email: result.organizer_email,
      calendar_event_id: result.calendar_event_id,
      meet_url: result.meet_url,
    };
  }

  async updateSessionCapacity(sessionId: string, newCapacity: number): Promise<Session> {
    const { data, error } = await (
      this.supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => PromiseLike<{ data: Session[] | null; error: { message: string; code?: string } | null }>
    )('update_session_capacity', {
      p_session_id: sessionId,
      p_new_capacity: newCapacity,
    });

    if (error || !data || data.length === 0) {
      throw error ?? new Error('Failed to update session capacity');
    }

    return data[0];
  }

  async createSession(
    timeSlotId: string,
    organizerEmail: string,
    capacity: number,
    title?: string,
  ): Promise<Session> {
    const { data, error } = await (
      this.supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => PromiseLike<{ data: Session[] | null; error: { message: string; code?: string } | null }>
    )('create_session_manual', {
      p_time_slot_id: timeSlotId,
      p_organizer_email: organizerEmail,
      p_capacity: capacity,
      p_title: title || 'Entrevista em Grupo',
    });

    if (error || !data || data.length === 0) {
      throw error ?? new Error('Failed to create session manually');
    }

    return data[0];
  }
}

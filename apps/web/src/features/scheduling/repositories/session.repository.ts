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

  /**
   * Tenta reservar uma vaga na sessão usando concorrência otimista (Optimistic Locking).
   * Incrementa current_participants apenas se o valor obtido no fetch não se alterou.
   * Retorna true se a vaga foi reservada com sucesso; false caso contrário.
   */
  async tryReserveSeat(sessionId: string): Promise<boolean> {
    // 1. Consulta o estado atual da sessão
    const { data: session, error: fetchError } = await this.supabase
      .from('sessions')
      .select('current_participants, capacity')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return false;
    }

    // Se já estiver cheia, rejeita a reserva
    if (session.current_participants >= session.capacity) {
      return false;
    }

    const nextParticipants = session.current_participants + 1;
    const nextStatus = nextParticipants === session.capacity ? 'FULL' : 'AVAILABLE';

    // 2. Executa a atualização atômica baseada no valor lido anteriormente (optimistic lock)
    const { data, error: updateError } = await this.supabase
      .from('sessions')
      .update({
        current_participants: nextParticipants,
        status: nextStatus,
      })
      .eq('id', sessionId)
      .eq('current_participants', session.current_participants)
      .select();

    if (updateError || !data || data.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Executa rollback simples reduzindo current_participants em 1 e redefinindo o status para AVAILABLE.
   */
  async decrementParticipants(sessionId: string): Promise<void> {
    const { data: session, error: fetchError } = await this.supabase
      .from('sessions')
      .select('current_participants')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return;
    }

    const nextParticipants = Math.max(0, session.current_participants - 1);

    await this.supabase
      .from('sessions')
      .update({
        current_participants: nextParticipants,
        status: 'AVAILABLE',
      })
      .eq('id', sessionId);
  }

  async updateSessionCalendar(
    sessionId: string,
    calendarEventId: string,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase as any).rpc('allocate_participant', {
      p_time_slot_id: timeSlotId,
      p_email: email,
      p_name: name,
      p_phone: phone,
      p_organizer_email: organizerEmail,
    });

    if (error) {
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];
    if (!rows || rows.length === 0) {
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
}

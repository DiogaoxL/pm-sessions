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
}

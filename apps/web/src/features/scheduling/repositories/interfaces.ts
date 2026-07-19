import { Database } from '@/shared/types/database';

export type TimeSlot = Database['public']['Tables']['time_slots']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type Participant = Database['public']['Tables']['participants']['Row'];
export type ParticipantInsert = Database['public']['Tables']['participants']['Insert'];

export interface ITimeSlotRepository {
  /**
   * Busca slots de data futura com status 'OPEN'.
   */
  selectAvailableSlots(): Promise<TimeSlot[]>;
}

export interface ISessionRepository {
  /**
   * Busca sessões ativas associadas a um time_slot_id.
   */
  findOpenSessionsByTimeSlot(timeSlotId: string): Promise<Session[]>;

  /**
   * Incrementa atômica e seguramente a capacidade de participantes da sessão,
   * checando se current_participants < capacity.
   * Retorna true se atualizado com sucesso; false caso contrário (sessão cheia).
   */
  tryReserveSeat(sessionId: string): Promise<boolean>;

  /**
   * Decrementa a quantidade de participantes (usado para rollback).
   */
  decrementParticipants(sessionId: string): Promise<void>;
}

export interface IParticipantRepository {
  /**
   * Insere o registro de participante no banco.
   */
  insertParticipant(participant: ParticipantInsert): Promise<Participant>;

  /**
   * Valida se o email fornecido já possui inscrição ativa (CONFIRMED) no mesmo TimeSlot.
   */
  existsConfirmedParticipant(email: string, timeSlotId: string): Promise<boolean>;
}

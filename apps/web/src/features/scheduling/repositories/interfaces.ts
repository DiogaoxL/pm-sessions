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

  /**
   * Busca um time slot específico por ID.
   */
  findTimeSlotById(id: string): Promise<TimeSlot | null>;
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

  /**
   * Atualiza as colunas de integração de calendário na sessão.
   */
  updateSessionCalendar(
    sessionId: string,
    calendarEventId: string,
    meetUrl: string | null,
  ): Promise<void>;

  /**
   * Busca uma sessão por ID.
   */
  findSessionById(id: string): Promise<Session | null>;
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

  /**
   * Busca todos os participantes ativos de uma sessão.
   */
  getParticipantsBySession(sessionId: string): Promise<Participant[]>;

  /**
   * Busca um participante por ID.
   */
  findParticipantById(id: string): Promise<Participant | null>;

  /**
   * Atualiza o status do participante.
   */
  updateParticipantStatus(id: string, status: Participant['status']): Promise<Participant>;

  /**
   * Exclui o registro de um participante do banco.
   */
  deleteParticipant(id: string): Promise<void>;
}

import { Database } from '@/shared/types/database';

export type TimeSlot = Database['public']['Tables']['time_slots']['Row'] & {
  availableSeats?: number;
};
export type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert'];
export type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type Participant = Database['public']['Tables']['participants']['Row'] & {
  organizer_email?: string;
  calendar_event_id?: string | null;
};
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

  /**
   * [Admin] Busca todos os time slots, ordenados cronologicamente.
   */
  findAllSlots(): Promise<TimeSlot[]>;

  /**
   * [Admin] Cria um novo time slot.
   */
  createTimeSlot(data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>): Promise<TimeSlot>;

  /**
   * [Admin] Atualiza um time slot existente por ID.
   */
  updateTimeSlot(id: string, data: TimeSlotUpdate): Promise<TimeSlot>;

  /**
   * [Admin] Altera o status do slot para CLOSED.
   */
  closeTimeSlot(id: string): Promise<TimeSlot>;

  /**
   * [Admin] Executa o fechamento do slot, cancelamento de participantes e reset de sessoes atomicamente.
   */
  closeTimeSlotAtomic(id: string): Promise<void>;

  /**
   * [Admin] Remove um time slot permanentemente do banco de dados.
   */
  deleteTimeSlot(id: string): Promise<void>;

  /**
   * [Admin] Verifica se um slot possui sessões com participantes ativos (CONFIRMED).
   * Retorna true se houver ao menos um participante ativo.
   */
  hasActiveParticipants(id: string): Promise<boolean>;
}

export interface ISessionRepository {
  /**
   * Busca sessões ativas associadas a um time_slot_id.
   */
  findOpenSessionsByTimeSlot(timeSlotId: string): Promise<Session[]>;

  /**
   * Remove um participante de forma transacional usando a RPC remove_participant.
   */
  removeParticipant(participantId: string): Promise<void>;

  /**
   * Move um participante de forma transacional usando a RPC move_participant.
   */
  moveParticipant(participantId: string, targetSessionId: string): Promise<void>;

  /**
   * Atualiza as colunas de integração de calendário na sessão.
   */
  updateSessionCalendar(
    sessionId: string,
    calendarEventId: string | null,
    meetUrl: string | null,
  ): Promise<void>;

  /**
   * Busca uma sessão por ID.
   */
  findSessionById(id: string): Promise<Session | null>;

  /**
   * Busca todas as sessões associadas a um time_slot_id, ordenadas por data de criação.
   */
  findSessionsByTimeSlot(timeSlotId: string): Promise<Session[]>;

  /**
   * Executa a alocação transacional do participante em uma sessão.
   */
  allocateParticipant(
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
  }>;

  updateSessionCapacity(sessionId: string, newCapacity: number): Promise<Session>;

  /**
   * Cria uma nova sessão manualmente chamando a RPC create_session_manual.
   */
  createSession(
    timeSlotId: string,
    organizerEmail: string,
    capacity: number,
    title?: string,
  ): Promise<Session>;
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

  /**
   * [Admin] Move o participante para outra sessão (atualiza session_id).
   */
  updateParticipantSessionId(id: string, sessionId: string): Promise<Participant>;
}

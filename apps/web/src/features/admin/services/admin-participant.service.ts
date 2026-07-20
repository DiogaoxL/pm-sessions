import {
  ISessionRepository,
  IParticipantRepository,
  Participant,
  Session,
} from '../../scheduling/repositories/interfaces';

// --- Domain Errors ---

export class ParticipantNotFoundError extends Error {
  constructor(id: string) {
    super(`Participant ${id} not found or is not CONFIRMED.`);
    this.name = 'ParticipantNotFoundError';
  }
}

export class SessionNotFoundError extends Error {
  constructor(id: string) {
    super(`Session ${id} not found.`);
    this.name = 'SessionNotFoundError';
  }
}

export class SessionFullError extends Error {
  constructor(id: string) {
    super(`Target session ${id} is at full capacity.`);
    this.name = 'SessionFullError';
  }
}

export class SessionFinishedError extends Error {
  constructor(id: string) {
    super(`Target session ${id} is FINISHED and cannot receive participants.`);
    this.name = 'SessionFinishedError';
  }
}

export class ParticipantAlreadyInSessionError extends Error {
  constructor(participantId: string, sessionId: string) {
    super(`Participant ${participantId} already exists in session ${sessionId}.`);
    this.name = 'ParticipantAlreadyInSessionError';
  }
}

export class CapacityBelowCurrentParticipantsError extends Error {
  constructor(sessionId: string, newCapacity: number, currentParticipants: number) {
    super(
      `Cannot set capacity to ${newCapacity} for session ${sessionId}: it has ${currentParticipants} active participants.`,
    );
    this.name = 'CapacityBelowCurrentParticipantsError';
  }
}

// --- Service Interface ---

export interface MoveParticipantResult {
  participant: Participant;
  sourceSession: Session;
  targetSession: Session;
}

export interface IAdminParticipantService {
  removeParticipant(participantId: string): Promise<Participant>;
  moveParticipant(participantId: string, targetSessionId: string): Promise<MoveParticipantResult>;
  updateSessionCapacity(sessionId: string, newCapacity: number): Promise<Session>;
}

// --- Implementation ---

/**
 * AdminParticipantService
 *
 * Implementa as regras de negócio administrativas para gerenciamento de participantes:
 *   RN-004/RN-005: Remoção / cancelamento de participante.
 *   RN-006: Movimentação de participante entre sessões do mesmo time slot.
 *   RN-008: Alteração de capacidade de sessões futuras.
 */
export class AdminParticipantService implements IAdminParticipantService {
  constructor(
    private sessionRepository: ISessionRepository,
    private participantRepository: IParticipantRepository,
  ) {}

  /**
   * Cancela (CANCELLED) um participante e decrementa o contador da sessão.
   */
  async removeParticipant(participantId: string): Promise<Participant> {
    const participant = await this.participantRepository.findParticipantById(participantId);
    if (!participant || participant.status !== 'CONFIRMED') {
      throw new ParticipantNotFoundError(participantId);
    }

    const updated = await this.participantRepository.updateParticipantStatus(
      participantId,
      'CANCELLED',
    );
    await this.sessionRepository.decrementParticipants(participant.session_id);

    return updated;
  }

  /**
   * Move um participante de sua sessão atual para uma sessão de destino.
   *
   * Validações:
   * - A sessão de destino deve existir.
   * - A sessão de destino não pode estar FINISHED.
   * - A sessão de destino não pode estar cheia.
   * - O participante não pode já estar na sessão de destino.
   *
   * Atomicidade: decrementa a origem, incrementa o destino, atualiza o session_id do participante.
   */
  async moveParticipant(
    participantId: string,
    targetSessionId: string,
  ): Promise<MoveParticipantResult> {
    const participant = await this.participantRepository.findParticipantById(participantId);
    if (!participant || participant.status !== 'CONFIRMED') {
      throw new ParticipantNotFoundError(participantId);
    }

    const targetSession = await this.sessionRepository.findSessionById(targetSessionId);
    if (!targetSession) {
      throw new SessionNotFoundError(targetSessionId);
    }

    if (targetSession.status === 'FINISHED') {
      throw new SessionFinishedError(targetSessionId);
    }

    if (targetSession.current_participants >= targetSession.capacity) {
      throw new SessionFullError(targetSessionId);
    }

    // Prevent moving to the same session
    if (participant.session_id === targetSessionId) {
      throw new ParticipantAlreadyInSessionError(participantId, targetSessionId);
    }

    // Check if participant already exists in target session (different participant record, same email)
    const targetParticipants =
      await this.participantRepository.getParticipantsBySession(targetSessionId);
    const alreadyInTarget = targetParticipants.some((p) => p.email === participant.email);
    if (alreadyInTarget) {
      throw new ParticipantAlreadyInSessionError(participantId, targetSessionId);
    }

    const sourceSession = await this.sessionRepository.findSessionById(participant.session_id);
    if (!sourceSession) {
      throw new SessionNotFoundError(participant.session_id);
    }

    // 1. Decrement source session
    await this.sessionRepository.decrementParticipants(participant.session_id);

    // 2. Reserve seat on target session
    const reserved = await this.sessionRepository.tryReserveSeat(targetSessionId);
    if (!reserved) {
      // Rollback: restore source session
      await this.sessionRepository.tryReserveSeat(participant.session_id);
      throw new SessionFullError(targetSessionId);
    }

    // 3. Update participant to point to target session
    const updatedParticipant = await this.participantRepository.updateParticipantSessionId(
      participantId,
      targetSessionId,
    );

    const updatedTarget = await this.sessionRepository.findSessionById(targetSessionId);

    return {
      participant: updatedParticipant,
      sourceSession,
      targetSession: updatedTarget ?? targetSession,
    };
  }

  /**
   * Atualiza a capacidade de uma sessão.
   * Impede redução abaixo do número atual de participantes confirmados.
   */
  async updateSessionCapacity(sessionId: string, newCapacity: number): Promise<Session> {
    const session = await this.sessionRepository.findSessionById(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    if (newCapacity < session.current_participants) {
      throw new CapacityBelowCurrentParticipantsError(
        sessionId,
        newCapacity,
        session.current_participants,
      );
    }

    return this.sessionRepository.updateSessionCapacity(sessionId, newCapacity);
  }
}

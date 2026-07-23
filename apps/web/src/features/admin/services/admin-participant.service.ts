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

    await this.sessionRepository.removeParticipant(participantId);

    const updated = await this.participantRepository.findParticipantById(participantId);
    if (!updated) {
      throw new ParticipantNotFoundError(participantId);
    }

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

    const sourceSession = await this.sessionRepository.findSessionById(participant.session_id);
    if (!sourceSession) {
      throw new SessionNotFoundError(participant.session_id);
    }

    try {
      await this.sessionRepository.moveParticipant(participantId, targetSessionId);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error) {
        const errObj = error as Record<string, unknown>;
        if (errObj.code === 'P0001') {
          throw new SessionFullError(targetSessionId);
        }
        if (errObj.code === 'P0002') {
          throw new ParticipantNotFoundError(participantId);
        }
        if (errObj.code === 'P0004') {
          throw new ParticipantAlreadyInSessionError(participantId, targetSessionId);
        }
        if (errObj.code === 'P0005') {
          throw new SessionNotFoundError(targetSessionId);
        }
        if (errObj.code === 'P0006') {
          throw new SessionFinishedError(targetSessionId);
        }
      }
      throw error;
    }

    const updatedParticipant = await this.participantRepository.findParticipantById(participantId);
    const updatedTarget = await this.sessionRepository.findSessionById(targetSessionId);

    if (!updatedParticipant) {
      throw new ParticipantNotFoundError(participantId);
    }

    return {
      participant: updatedParticipant,
      sourceSession,
      targetSession: updatedTarget ?? sourceSession,
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

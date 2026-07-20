import {
  ITimeSlotRepository,
  TimeSlot,
  TimeSlotInsert,
  TimeSlotUpdate,
} from '../../scheduling/repositories/interfaces';

export class AdminSlotAlreadyHasParticipantsError extends Error {
  constructor(slotId: string) {
    super(`Time slot ${slotId} has active participants and cannot be edited or closed.`);
    this.name = 'AdminSlotAlreadyHasParticipantsError';
  }
}

export interface IAdminTimeSlotService {
  listAllSlots(): Promise<TimeSlot[]>;
  createSlot(data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>): Promise<TimeSlot>;
  updateSlot(id: string, data: TimeSlotUpdate): Promise<TimeSlot>;
  closeSlot(id: string): Promise<TimeSlot>;
}

/**
 * AdminTimeSlotService
 *
 * Gerencia as operações administrativas de Time Slots.
 * Aplica as regras de negócio RN-Admin-001:
 *   - Não permite editar ou fechar slots com participantes ativos (CONFIRMED).
 */
export class AdminTimeSlotService implements IAdminTimeSlotService {
  constructor(private timeSlotRepository: ITimeSlotRepository) {}

  async listAllSlots(): Promise<TimeSlot[]> {
    return this.timeSlotRepository.findAllSlots();
  }

  async createSlot(
    data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<TimeSlot> {
    return this.timeSlotRepository.createTimeSlot(data);
  }

  /**
   * Atualiza um time slot.
   * Lança AdminSlotAlreadyHasParticipantsError se o slot possuir participantes ativos.
   */
  async updateSlot(id: string, data: TimeSlotUpdate): Promise<TimeSlot> {
    const hasParticipants = await this.timeSlotRepository.hasActiveParticipants(id);
    if (hasParticipants) {
      throw new AdminSlotAlreadyHasParticipantsError(id);
    }

    return this.timeSlotRepository.updateTimeSlot(id, data);
  }

  /**
   * Fecha o time slot (status = CLOSED).
   * Lança AdminSlotAlreadyHasParticipantsError se o slot possuir participantes ativos.
   */
  async closeSlot(id: string): Promise<TimeSlot> {
    const hasParticipants = await this.timeSlotRepository.hasActiveParticipants(id);
    if (hasParticipants) {
      throw new AdminSlotAlreadyHasParticipantsError(id);
    }

    return this.timeSlotRepository.closeTimeSlot(id);
  }
}

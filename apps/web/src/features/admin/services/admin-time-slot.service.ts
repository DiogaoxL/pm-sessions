import {
  ITimeSlotRepository,
  ISessionRepository,
  TimeSlot,
  TimeSlotInsert,
  TimeSlotUpdate,
} from '../../scheduling/repositories/interfaces';
import { IHostAllocatorService } from '../../scheduling/services/host-allocator.service';
import { IGoogleCalendarService } from '../../scheduling/services/google-calendar.service';

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
  deleteSlot(id: string): Promise<void>;
  syncSlotCalendarEvents(
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
  ): Promise<void>;
}

/**
 * AdminTimeSlotService
 *
 * Gerencia as operações administrativas de Time Slots.
 */
export class AdminTimeSlotService implements IAdminTimeSlotService {
  constructor(
    private timeSlotRepository: ITimeSlotRepository,
    private sessionRepository: ISessionRepository,
    private hostAllocator: IHostAllocatorService,
    private googleCalendarService: IGoogleCalendarService,
  ) {}

  async listAllSlots(): Promise<TimeSlot[]> {
    return this.timeSlotRepository.findAllSlots();
  }

  async createSlot(
    data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.createTimeSlot(data);

    // Auto-criar a primeira sessao com o host padrao e capacidade do slot
    try {
      const hostEmail = await this.hostAllocator.getNextHostEmail();
      await this.sessionRepository.createSession(slot.id, hostEmail, slot.capacity);
    } catch (error) {
      console.error('Failed to auto-create first session for slot:', error);
    }

    return slot;
  }

  /**
   * Atualiza um time slot. Sempre permitido.
   */
  async updateSlot(id: string, data: TimeSlotUpdate): Promise<TimeSlot> {
    return this.timeSlotRepository.updateTimeSlot(id, data);
  }

  /**
   * Fecha o time slot (status = CLOSED).
   * Cancela os eventos correspondentes no Google Calendar (o que envia e-mails aos convidados)
   * e atualiza atomicamente os participantes do slot para CANCELLED.
   */
  async closeSlot(id: string): Promise<TimeSlot> {
    // 1. Obter sessoes deste slot
    const sessions = await this.sessionRepository.findSessionsByTimeSlot(id);

    // 2. Excluir eventos no Google Calendar para disparar notificacoes
    for (const session of sessions) {
      if (session.calendar_event_id) {
        await this.googleCalendarService.deleteEvent(session.calendar_event_id);
      }
    }

    // 3. Executar mudancas de banco atomicamente
    await this.timeSlotRepository.closeTimeSlotAtomic(id);

    // 4. Retornar slot atualizado
    const updated = await this.timeSlotRepository.findTimeSlotById(id);
    if (!updated) {
      throw new Error(`Time slot ${id} not found after closing`);
    }

    return updated;
  }

  /**
   * Exclui permanentemente o time slot.
   * Apenas permitido se o status do slot for CLOSED.
   */
  async deleteSlot(id: string): Promise<void> {
    const slot = await this.timeSlotRepository.findTimeSlotById(id);
    if (!slot || slot.status !== 'CLOSED') {
      throw new Error('Only closed time slots can be deleted.');
    }

    await this.timeSlotRepository.deleteTimeSlot(id);
  }

  /**
   * Sincroniza todos os eventos correspondentes no Google Calendar para as sessoes do slot.
   */
  async syncSlotCalendarEvents(
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
  ): Promise<void> {
    const sessions = await this.sessionRepository.findSessionsByTimeSlot(id);
    const parsedStart = new Date(`${newDate}T${newStartTime}`);
    const parsedEnd = new Date(`${newDate}T${newEndTime}`);

    for (const session of sessions) {
      if (session.calendar_event_id) {
        const title = `Mentoria - Host: ${session.organizer_email}`;
        await this.googleCalendarService.updateEventTime(
          session.calendar_event_id,
          title,
          parsedStart,
          parsedEnd,
        );
      }
    }
  }
}

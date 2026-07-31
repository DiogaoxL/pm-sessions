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
  deleteSlot(id: string, deleteCalendarEvents?: boolean): Promise<void>;
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
    title?: string,
    hostEmail?: string,
  ): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.createTimeSlot(data);
    console.log('[PUBLIC] Novo Slot criado:', slot);

    // Auto-criar a primeira sessao com o host padrao e capacidade do slot
    try {
      const finalHostEmail = hostEmail || (await this.hostAllocator.getNextHostEmail());
      const finalTitle = title || 'Entrevista em Grupo';
      const session = await this.sessionRepository.createSession(
        slot.id,
        finalHostEmail,
        slot.capacity,
        finalTitle,
      );

      console.log(`[PUBLIC] Primeira sessão criada automaticamente
ID da sessão: ${session.id}
Título: ${session.title}
Host: ${session.organizer_email}
Status AVAILABLE: ${session.status}`);
    } catch (error) {
      console.error('[PUBLIC] Failed to auto-create first session for slot:', error);
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
    const startTime = performance.now();
    let previousStatus = 'UNKNOWN';
    let success = true;
    let failureReason: string | undefined = undefined;

    try {
      const slot = await this.timeSlotRepository.findTimeSlotById(id);
      if (!slot) {
        throw new Error(`Time slot ${id} not found`);
      }
      previousStatus = slot.status;

      const updated = await this.timeSlotRepository.closeTimeSlot(id);
      return updated;
    } catch (error) {
      success = false;
      failureReason = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      const executionTime = performance.now() - startTime;
      console.log(`[CLOSE_SLOT]`, {
        slotId: id,
        previousStatus,
        newStatus: 'CLOSED',
        execution_time: `${executionTime.toFixed(2)}ms`,
        success,
        failure_reason: failureReason || null,
      });
    }
  }

  /**
   * Exclui permanentemente o time slot.
   * Apenas permitido se o status do slot for CLOSED.
   */
  async deleteSlot(id: string, deleteCalendarEvents: boolean = false): Promise<void> {
    const slot = await this.timeSlotRepository.findTimeSlotById(id);
    if (!slot || slot.status !== 'CLOSED') {
      throw new Error('Only closed time slots can be deleted.');
    }

    const sessions = await this.sessionRepository.findSessionsByTimeSlot(id);
    const calendarEventIds: string[] = [];

    const startTime = performance.now();
    let success = true;
    let failureReason: string | undefined = undefined;

    try {
      if (deleteCalendarEvents) {
        for (const session of sessions) {
          if (session.calendar_event_id) {
            calendarEventIds.push(session.calendar_event_id);
            try {
              await this.googleCalendarService.deleteEvent(session.calendar_event_id);
            } catch (err: unknown) {
              success = false;
              failureReason = err instanceof Error ? err.message : String(err);
              throw new Error(
                `Não foi possível excluir o evento do Google Calendar. Nenhuma alteração foi realizada.`,
              );
            }
          }
        }
      }

      await this.timeSlotRepository.deleteTimeSlot(id);
    } catch (error) {
      success = false;
      failureReason = failureReason || (error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      const executionTime = performance.now() - startTime;
      console.log(`[DELETE_SLOT]`, {
        slotId: id,
        mode: deleteCalendarEvents ? 'dashboard_and_calendar' : 'dashboard_only',
        calendar_event_ids: calendarEventIds,
        execution_time: `${executionTime.toFixed(2)}ms`,
        success,
        failure_reason: failureReason || null,
      });
    }
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

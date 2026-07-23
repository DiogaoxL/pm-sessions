import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  Participant,
  TimeSlot,
  Session,
} from '../repositories/interfaces';
import { ISchedulingService } from './interfaces';
import { IGoogleCalendarService } from './google-calendar.service';
import { IHostAllocatorService } from './host-allocator.service';

export class SchedulingService implements ISchedulingService {
  constructor(
    private timeSlotRepository: ITimeSlotRepository,
    private sessionRepository: ISessionRepository,
    private participantRepository: IParticipantRepository,
    private googleCalendarService: IGoogleCalendarService,
    private hostAllocator: IHostAllocatorService,
  ) {}

  async getAvailableSlots(): Promise<TimeSlot[]> {
    const dbSlots = await this.timeSlotRepository.selectAvailableSlots();
    if (dbSlots.length === 0) return [];

    const slotsByDate: Record<string, TimeSlot[]> = {};
    for (const slot of dbSlots) {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot);
    }

    const filteredSlots: TimeSlot[] = [];
    for (const [dateStr, slots] of Object.entries(slotsByDate)) {
      try {
        const freeTimeSlots = await this.googleCalendarService.filterFreeSlots(dateStr, slots);
        const freeKeys = new Set(freeTimeSlots.map((s) => s.start_time + s.end_time));
        for (const slot of slots) {
          if (freeKeys.has(slot.start_time + slot.end_time)) {
            filteredSlots.push(slot);
          }
        }
      } catch (error) {
        console.error(`Failed to filter slots for date ${dateStr}:`, error);
        // Fallback: under Google Calendar API failures, keep the slots from DB to avoid blocking the user
        filteredSlots.push(...slots);
      }
    }

    // Calcular vagas reais (availableSeats) a partir das sessões
    const slotsWithSeats: TimeSlot[] = [];
    await Promise.all(
      filteredSlots.map(async (slot) => {
        const sessions = await this.sessionRepository.findSessionsByTimeSlot(slot.id);
        const availableSessions = sessions.filter((s) => s.status === 'AVAILABLE');
        const availableSeats = availableSessions.reduce(
          (sum, s) => sum + Math.max(0, s.capacity - s.current_participants),
          0,
        );

        if (availableSeats > 0) {
          slotsWithSeats.push({
            ...slot,
            availableSeats,
          });
        }
      }),
    );

    // Ordenar de volta cronologicamente
    return slotsWithSeats.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.start_time.localeCompare(b.start_time);
    });
  }

  private async registerParticipant(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    const exists = await this.participantRepository.existsConfirmedParticipant(email, timeSlotId);
    if (exists) {
      throw new Error('Duplicated participant registration for this time slot');
    }

    try {
      return await this.participantRepository.insertParticipant({
        email,
        name,
        session_id: sessionId,
        status: 'CONFIRMED',
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        (('code' in error && error.code === '23505') ||
          ('message' in error &&
            typeof error.message === 'string' &&
            (error.message.includes('unique constraint') ||
              error.message.includes('duplicate key'))))
      ) {
        throw new Error('Duplicated participant registration for this time slot');
      }
      throw error;
    }
  }

  async scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    console.log('[TRACE 3.1] getNextHostEmail — ENTROU');
    const organizerEmail = await this.hostAllocator.getNextHostEmail();
    console.log('[TRACE 3.1] getNextHostEmail — SAIU. organizerEmail:', organizerEmail);

    console.log(
      '[TRACE 4] allocateParticipant RPC — ENTROU. timeSlotId:',
      timeSlotId,
      'email:',
      email,
      'organizerEmail:',
      organizerEmail,
    );
    const allocation = await this.sessionRepository.allocateParticipant(
      timeSlotId,
      email,
      name,
      null,
      organizerEmail,
    );
    console.log(
      '[TRACE 4] allocateParticipant RPC — SAIU. allocation:',
      JSON.stringify(allocation),
    );

    console.log('[TRACE 5] findTimeSlotById — ENTROU. timeSlotId:', timeSlotId);
    const slot = await this.timeSlotRepository.findTimeSlotById(timeSlotId);
    console.log('[TRACE 5] findTimeSlotById — SAIU. slot:', JSON.stringify(slot));
    if (!slot) {
      console.error('[TRACE 5] FALHOU — slot não encontrado para ID:', timeSlotId);
      throw new Error('Time slot details not found');
    }

    let calendarEventId = allocation.calendar_event_id;
    let meetUrl = allocation.meet_url;

    try {
      console.log('[TRACE 6] Google Calendar — ENTROU. calendarEventId:', calendarEventId);
      if (!calendarEventId) {
        const startDateTime = new Date(`${slot.date}T${slot.start_time}`);
        const endDateTime = new Date(`${slot.date}T${slot.end_time}`);

        console.log('[TRACE 6.1] createEvent — ENTROU. start:', startDateTime, 'end:', endDateTime);
        const eventResult = await this.googleCalendarService.createEvent(
          `PM Sessions Interview - ${name}`,
          startDateTime,
          endDateTime,
          allocation.organizer_email,
        );
        calendarEventId = eventResult.eventId;
        meetUrl = eventResult.meetUrl;
        console.log('[TRACE 6.1] createEvent — SAIU. eventId:', calendarEventId);

        console.log('[TRACE 6.2] updateSessionCalendar — ENTROU');
        await this.sessionRepository.updateSessionCalendar(
          allocation.session_id,
          calendarEventId,
          meetUrl,
        );
        console.log('[TRACE 6.2] updateSessionCalendar — SAIU');
      }

      console.log('[TRACE 7] syncAttendees — ENTROU. calendarEventId:', calendarEventId);
      const confirmedParticipants = await this.participantRepository.getParticipantsBySession(
        allocation.session_id,
      );
      const emails = Array.from(new Set(confirmedParticipants.map((p) => p.email)));
      if (!emails.includes(email)) {
        emails.push(email);
      }

      if (calendarEventId) {
        await this.googleCalendarService.syncAttendees(calendarEventId, emails);
        console.log('[TRACE 7] syncAttendees — SAIU');
      } else {
        console.log('[TRACE 7] syncAttendees — PULADO (sem calendarEventId)');
      }
    } catch (calendarError) {
      console.warn('[TRACE 6/7] Google Calendar FALHOU (não-blocante):', {
        message: calendarError instanceof Error ? calendarError.message : String(calendarError),
        stack: calendarError instanceof Error ? calendarError.stack : undefined,
      });
    }

    console.log('[TRACE 9] scheduleSession — RETORNANDO participante criado com sucesso');
    return {
      id: allocation.participant_id,
      session_id: allocation.session_id,
      name,
      email,
      phone: null,
      status: 'CONFIRMED',
      allocated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async getOpenSessionsBySlot(timeSlotId: string): Promise<Session[]> {
    return this.sessionRepository.findOpenSessionsByTimeSlot(timeSlotId);
  }

  async cancelSession(participantId: string): Promise<void> {
    const participant = await this.participantRepository.findParticipantById(participantId);
    if (!participant || participant.status !== 'CONFIRMED') {
      throw new Error('Confirmed participant not found');
    }

    // Update status to CANCELLED and decrement session count via RPC
    await this.sessionRepository.removeParticipant(participantId);

    // Sync remaining attendees in the Google Calendar event
    const session = await this.sessionRepository.findSessionById(participant.session_id);
    if (session && session.calendar_event_id) {
      const remainingParticipants = await this.participantRepository.getParticipantsBySession(
        participant.session_id,
      );
      const remainingEmails = remainingParticipants.map((p) => p.email);
      await this.googleCalendarService.syncAttendees(session.calendar_event_id, remainingEmails);
    }
  }
}

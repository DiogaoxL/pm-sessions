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

export class SchedulingService implements ISchedulingService {
  constructor(
    private timeSlotRepository: ITimeSlotRepository,
    private sessionRepository: ISessionRepository,
    private participantRepository: IParticipantRepository,
    private googleCalendarService: IGoogleCalendarService,
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

    return filteredSlots;
  }

  async reserveSeat(sessionId: string): Promise<boolean> {
    return this.sessionRepository.tryReserveSeat(sessionId);
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
    const seatReserved = await this.reserveSeat(sessionId);
    if (!seatReserved) {
      throw new Error('No seats available for this session');
    }

    let participant: Participant | null = null;
    try {
      participant = await this.registerParticipant(email, name, sessionId, timeSlotId);

      // Orchestrate Google Calendar sync
      const slot = await this.timeSlotRepository.findTimeSlotById(timeSlotId);
      if (!slot) {
        throw new Error('Time slot details not found');
      }

      // Fetch active sessions to find the current session details
      const sessions = await this.sessionRepository.findOpenSessionsByTimeSlot(timeSlotId);
      const targetSession = sessions.find((s) => s.id === sessionId);
      if (!targetSession) {
        throw new Error('Session details not found');
      }

      let calendarEventId = targetSession.calendar_event_id;
      let meetUrl = targetSession.meet_url;

      const startDateTime = new Date(`${slot.date}T${slot.start_time}`);
      const endDateTime = new Date(`${slot.date}T${slot.end_time}`);

      // Idempotency check: if event was not created yet
      if (!calendarEventId) {
        const eventResult = await this.googleCalendarService.createEvent(
          `PM Sessions Interview - ${name}`,
          startDateTime,
          endDateTime,
          targetSession.organizer_email,
        );
        calendarEventId = eventResult.eventId;
        meetUrl = eventResult.meetUrl;

        await this.sessionRepository.updateSessionCalendar(sessionId, calendarEventId, meetUrl);
      }

      // Sync attendees list including this participant and other confirmed ones
      const confirmedParticipants =
        await this.participantRepository.getParticipantsBySession(sessionId);
      const emails = Array.from(new Set(confirmedParticipants.map((p) => p.email)));
      if (!emails.includes(email)) {
        emails.push(email);
      }

      await this.googleCalendarService.syncAttendees(calendarEventId, emails);

      return participant;
    } catch (error) {
      if (participant) {
        // Complete rollback: decrement session participants and delete participant record from database
        await this.sessionRepository.decrementParticipants(sessionId);
        await this.participantRepository.deleteParticipant(participant.id);
      } else {
        await this.sessionRepository.decrementParticipants(sessionId);
      }
      throw error;
    }
  }

  async getOpenSessionsBySlot(timeSlotId: string): Promise<Session[]> {
    return this.sessionRepository.findOpenSessionsByTimeSlot(timeSlotId);
  }

  async cancelSession(participantId: string): Promise<void> {
    const participant = await this.participantRepository.findParticipantById(participantId);
    if (!participant || participant.status !== 'CONFIRMED') {
      throw new Error('Confirmed participant not found');
    }

    // Update status to CANCELLED and decrement session count
    await this.participantRepository.updateParticipantStatus(participantId, 'CANCELLED');
    await this.sessionRepository.decrementParticipants(participant.session_id);

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

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

let hasLoggedConfigWarning = false;
function logConfigWarningOnce() {
  if (!hasLoggedConfigWarning) {
    console.info('[Google Calendar] Integração não configurada. Utilizando disponibilidade local.');
    hasLoggedConfigWarning = true;
  }
}

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
    console.log('[PUBLIC] Slots recebidos do Repository:', dbSlots);

    // Instrument timezones and now
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeFormatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    console.log('[PUBLIC] Timezone: America/Sao_Paulo');
    console.log('[PUBLIC] Current Date:', dateFormatter.format(now));
    console.log('[PUBLIC] Current Time:', timeFormatter.format(now));

    if (dbSlots.length === 0) return [];

    // Fetch sessions for all slots first to see if they are already on the calendar
    const slotsWithSessions = await Promise.all(
      dbSlots.map(async (slot) => {
        const sessions = await this.sessionRepository.findSessionsByTimeSlot(slot.id);
        const hasCalendarEvent = sessions.some(
          (s) => s.calendar_event_id !== null && s.calendar_event_id !== '',
        );
        return { slot, sessions, hasCalendarEvent };
      }),
    );

    const filteredSlots: TimeSlot[] = [];

    const isCalendarConfigured = this.googleCalendarService.isCalendarConfigured();
    console.log('[PUBLIC] Google Calendar configured?', isCalendarConfigured);

    if (!isCalendarConfigured) {
      logConfigWarningOnce();
      filteredSlots.push(...dbSlots);
    } else {
      // 1. Keep slots that already have a calendar event (active sessions)
      const slotsToFilter: TimeSlot[] = [];
      for (const item of slotsWithSessions) {
        if (item.hasCalendarEvent) {
          filteredSlots.push(item.slot);
          console.log(
            `[PUBLIC] Slot ${item.slot.id}: ✓ passou Google Calendar (já possui evento ativo: ${item.sessions.find((s) => s.calendar_event_id)?.calendar_event_id})`,
          );
        } else {
          slotsToFilter.push(item.slot);
        }
      }

      // 2. Filter the rest of the slots through Google Calendar
      const slotsByDate: Record<string, TimeSlot[]> = {};
      for (const slot of slotsToFilter) {
        if (!slotsByDate[slot.date]) {
          slotsByDate[slot.date] = [];
        }
        slotsByDate[slot.date].push(slot);
      }

      for (const [dateStr, slots] of Object.entries(slotsByDate)) {
        try {
          const freeTimeSlots = await this.googleCalendarService.filterFreeSlots(dateStr, slots);
          console.log(
            `[PUBLIC] Free slots returned by Google Calendar for ${dateStr}:`,
            freeTimeSlots,
          );
          const freeKeys = new Set(freeTimeSlots.map((s) => s.start_time + s.end_time));
          for (const slot of slots) {
            if (freeKeys.has(slot.start_time + slot.end_time)) {
              filteredSlots.push(slot);
              console.log(`[PUBLIC] Slot ${slot.id}: ✓ passou filtro Google Calendar`);
            } else {
              console.log(
                `[PUBLIC] Slot ${slot.id}: ✗ removido porque: Google Calendar ocupado / conflito`,
              );
            }
          }
        } catch (error) {
          console.warn(
            `[Google Calendar] Falha ao filtrar horários para a data ${dateStr}:`,
            error,
          );
          // Fallback: under Google Calendar API failures, keep the slots from DB to avoid blocking the user
          filteredSlots.push(...slots);
        }
      }
    }

    // Calcular vagas reais (availableSeats) a partir das sessões
    const slotsWithSeats: TimeSlot[] = [];
    const sessionsMap = new Map<string, (typeof slotsWithSessions)[0]['sessions']>();
    for (const item of slotsWithSessions) {
      sessionsMap.set(item.slot.id, item.sessions);
    }

    for (const slot of filteredSlots) {
      const sessions = sessionsMap.get(slot.id) || [];
      console.log(`[PUBLIC] SELECT * FROM sessions WHERE time_slot_id = '${slot.id}'`);
      console.log(`[PUBLIC] Sessions encontradas para slot ${slot.id}:`, sessions.length);

      const availableSessions = sessions.filter((s) => s.status === 'AVAILABLE');
      const availableSeats = availableSessions.reduce(
        (sum, s) => sum + Math.max(0, s.capacity - s.current_participants),
        0,
      );

      console.log(`[PUBLIC] Slot:
id: ${slot.id}
status: ${slot.status}
date: ${slot.date}
start_time: ${slot.start_time}
sessions encontradas: ${sessions.length}
availableSeats: ${availableSeats}`);

      if (sessions.length === 0) {
        console.log(`[PUBLIC] Slot ${slot.id} REMOVED porque: [x] sem sessões`);
      } else if (availableSeats === 0) {
        console.log(`[PUBLIC] Slot ${slot.id} REMOVED porque: [x] sem vagas`);
      } else if (slot.status !== 'OPEN') {
        console.log(`[PUBLIC] Slot ${slot.id} REMOVED porque: [x] status diferente de OPEN`);
      } else {
        console.log(`[PUBLIC] Slot ${slot.id} PASSED`);
        slotsWithSeats.push({
          ...slot,
          availableSeats,
        });
      }
    }

    // Ordenar de volta cronologicamente
    const processedSlots = slotsWithSeats.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.start_time.localeCompare(b.start_time);
    });

    console.log('[PUBLIC] Slots processados:', processedSlots);
    return processedSlots;
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
    phone?: string | null,
    correlationId?: string,
  ): Promise<Participant> {
    const cid = correlationId || 'N/A';
    const exists = await this.participantRepository.existsConfirmedParticipant(email, timeSlotId);
    if (exists) {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    console.log(`[Correlation-ID: ${cid}] [TRACE 3.1] getNextHostEmail — ENTROU`);
    const organizerEmail = await this.hostAllocator.getNextHostEmail();
    console.log(
      `[Correlation-ID: ${cid}] [TRACE 3.1] getNextHostEmail — SAIU. organizerEmail:`,
      organizerEmail,
    );

    console.log(
      `[Correlation-ID: ${cid}] [TRACE 4] allocateParticipant RPC — ENTROU. timeSlotId: ${timeSlotId} email: ${email} organizerEmail: ${organizerEmail}`,
    );
    const allocation = await this.sessionRepository.allocateParticipant(
      timeSlotId,
      email,
      name,
      phone || null,
      organizerEmail,
    );
    console.log(
      `[Correlation-ID: ${cid}] [TRACE 4] allocateParticipant RPC — SAIU. allocation:`,
      JSON.stringify(allocation),
    );

    console.log(
      `[Correlation-ID: ${cid}] [TRACE 5] findTimeSlotById — ENTROU. timeSlotId: ${timeSlotId}`,
    );
    const slot = await this.timeSlotRepository.findTimeSlotById(timeSlotId);
    console.log(
      `[Correlation-ID: ${cid}] [TRACE 5] findTimeSlotById — SAIU. slot:`,
      JSON.stringify(slot),
    );
    if (!slot) {
      console.error(
        `[Correlation-ID: ${cid}] [TRACE 5] FALHOU — slot não encontrado para ID:`,
        timeSlotId,
      );
      throw new Error('Time slot details not found');
    }

    let calendarEventId = allocation.calendar_event_id;
    let meetUrl = allocation.meet_url;
    let isNewEvent = false;

    try {
      console.log(
        `[Correlation-ID: ${cid}] [TRACE 6] Google Calendar — ENTROU. calendarEventId: ${calendarEventId}`,
      );
      if (!calendarEventId) {
        isNewEvent = true;

        console.log(
          `[Correlation-ID: ${cid}] [TRACE 6.1] createEvent — ENTROU. date: ${slot.date} start: ${slot.start_time} end: ${slot.end_time}`,
        );
        const sessionDetails = await this.sessionRepository.findSessionById(allocation.session_id);
        const capacity = sessionDetails?.capacity ?? slot.capacity ?? 1;

        const eventDescription = [
          'Participantes:',
          `${name} — ${email}`,
          '',
          'Sessão:',
          `1/${capacity} participantes`,
        ].join('\n');

        const eventResult = await this.googleCalendarService.createEvent(
          sessionDetails?.title || 'Entrevista em Grupo',
          slot.date,
          slot.start_time,
          slot.end_time,
          [email],
          eventDescription,
        );
        calendarEventId = eventResult.eventId;
        meetUrl = eventResult.meetUrl;
        console.log(
          `[Correlation-ID: ${cid}] [TRACE 6.1] createEvent — SAIU. eventId: ${calendarEventId}`,
        );

        console.log(`[Correlation-ID: ${cid}] [TRACE 6.2] updateSessionCalendar — ENTROU`);
        await this.sessionRepository.updateSessionCalendar(
          allocation.session_id,
          calendarEventId,
          meetUrl,
        );
        console.log(`[Correlation-ID: ${cid}] [TRACE 6.2] updateSessionCalendar — SAIU`);
      }

      if (!isNewEvent) {
        console.log(
          `[Correlation-ID: ${cid}] [TRACE 7] syncAttendees — ENTROU. calendarEventId: ${calendarEventId}`,
        );
        const confirmedParticipants = await this.participantRepository.getParticipantsBySession(
          allocation.session_id,
        );
        console.log(
          `[Correlation-ID: ${cid}] [TRACE 7.1] confirmedParticipants do banco:`,
          JSON.stringify(confirmedParticipants),
        );

        const emails = Array.from(new Set(confirmedParticipants.map((p) => p.email)));
        if (!emails.includes(email)) {
          emails.push(email);
        }
        console.log(
          `[Correlation-ID: ${cid}] [TRACE 7.2] Lista final de e-mails para sync:`,
          emails,
        );

        const sessionDetails = await this.sessionRepository.findSessionById(allocation.session_id);
        const capacity = sessionDetails?.capacity ?? slot.capacity ?? 1;

        const participantsLines = confirmedParticipants.map((p) => `${p.name} — ${p.email}`);
        if (!confirmedParticipants.some((p) => p.email === email)) {
          participantsLines.push(`${name} — ${email}`);
        }

        const eventDescription = [
          'Participantes:',
          participantsLines.join('\n'),
          '',
          'Sessão:',
          `${participantsLines.length}/${capacity} participantes`,
        ].join('\n');

        if (calendarEventId) {
          await this.googleCalendarService.syncAttendees(calendarEventId, emails, eventDescription);
          console.log(`[Correlation-ID: ${cid}] [TRACE 7] syncAttendees — SAIU COM SUCESSO`);
        } else {
          console.log(
            `[Correlation-ID: ${cid}] [TRACE 7] syncAttendees — PULADO (sem calendarEventId)`,
          );
        }
      } else {
        console.log(
          `[Correlation-ID: ${cid}] [TRACE 7] syncAttendees — PULADO (evento recém-criado já possui o participante)`,
        );
      }
    } catch (calendarError: unknown) {
      const errObj = calendarError as { response?: { data?: unknown } };
      console.warn(
        `[Correlation-ID: ${cid}] [TRACE ERROR 6/7] Google Calendar FALHOU (não-blocante):`,
        {
          message: calendarError instanceof Error ? calendarError.message : String(calendarError),
          stack: calendarError instanceof Error ? calendarError.stack : undefined,
          response: errObj.response?.data,
          calendarEventId,
        },
      );
    }

    console.log(
      `[Correlation-ID: ${cid}] [TRACE 9] scheduleSession — RETORNANDO participante criado com sucesso`,
    );
    return {
      id: allocation.participant_id,
      session_id: allocation.session_id,
      name,
      email,
      phone: phone || null,
      status: 'CONFIRMED',
      allocated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      organizer_email: allocation.organizer_email,
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

      if (remainingEmails.length === 0) {
        // Se não restam participantes, remove o evento do calendário e limpa a sessão no banco
        await this.googleCalendarService.deleteEvent(session.calendar_event_id);
        await this.sessionRepository.updateSessionCalendar(session.id, null, null);
      } else {
        // Caso contrário, sincroniza a nova lista de e-mails
        const participantsLines = remainingParticipants
          .map((p) => `${p.name} — ${p.email}`)
          .join('\n');
        const eventDescription = [
          'Participantes:',
          participantsLines,
          '',
          'Sessão:',
          `${remainingParticipants.length}/${session.capacity} participantes`,
        ].join('\n');

        await this.googleCalendarService.syncAttendees(
          session.calendar_event_id,
          remainingEmails,
          eventDescription,
        );
      }
    }
  }
}

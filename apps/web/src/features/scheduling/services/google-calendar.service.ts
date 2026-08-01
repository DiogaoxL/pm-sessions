import { google } from 'googleapis';
import { APP_TIMEZONE } from '../../../shared/constants';

export function formatLocalDate(date: Date, timeZone: string = APP_TIMEZONE): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
}

export function parseBusinessDate(
  dateStr: string,
  timeStr: string,
  timeZone: string = APP_TIMEZONE,
): Date {
  const baseUtcDate = new Date(`${dateStr}T${timeStr}Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(baseUtcDate);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '0';

  const year = parseInt(getPart('year'), 10);
  const month = parseInt(getPart('month'), 10);
  const day = parseInt(getPart('day'), 10);
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);
  const second = parseInt(getPart('second'), 10);

  const baseTzDateAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const diff = baseUtcDate.getTime() - baseTzDateAsUtc;

  return new Date(baseUtcDate.getTime() + diff);
}

export interface IGoogleCalendarService {
  isCalendarConfigured(): boolean;
  checkAvailability(startTime: Date, endTime: Date): Promise<{ start: Date; end: Date }[]>;
  filterFreeSlots(
    dateStr: string,
    potentialSlots: { start_time: string; end_time: string }[],
  ): Promise<{ start_time: string; end_time: string }[]>;
  createEvent(
    title: string,
    startTime: Date,
    endTime: Date,
    attendees?: string[],
    description?: string,
  ): Promise<{ eventId: string; meetUrl: string | null }>;
  createEvent(
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    attendees?: string[],
    description?: string,
  ): Promise<{ eventId: string; meetUrl: string | null }>;
  syncAttendees(eventId: string, attendees: string[], description: string): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  updateEventTime(eventId: string, title: string, startTime: Date, endTime: Date): Promise<void>;
  updateEventTime(
    eventId: string,
    title: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<void>;
  getPrimaryCalendarEmail(): Promise<string>;
}

export class GoogleCalendarService implements IGoogleCalendarService {
  private oauth2Client;
  private calendarClient;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    if (refreshToken) {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    }

    this.calendarClient = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  isCalendarConfigured(): boolean {
    if (process.env.FEATURE_GOOGLE_CALENDAR === 'false') {
      return false;
    }
    return !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    );
  }

  async getPrimaryCalendarEmail(): Promise<string> {
    if (!this.isCalendarConfigured()) {
      return process.env.DEFAULT_HOST_EMAIL || 'admin@example.com';
    }
    try {
      const response = await this.calendarClient.calendars.get({
        calendarId: 'primary',
      });
      return response.data.id || 'admin@example.com';
    } catch (error) {
      console.error('[Google Calendar] Failed to fetch primary calendar email:', error);
      return 'admin@example.com';
    }
  }

  async checkAvailability(startTime: Date, endTime: Date): Promise<{ start: Date; end: Date }[]> {
    try {
      const response = await this.calendarClient.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: 'primary' }],
        },
      });

      const busyPeriods = response.data.calendars?.primary?.busy || [];
      return busyPeriods.map((period) => ({
        start: new Date(period.start!),
        end: new Date(period.end!),
      }));
    } catch (error) {
      console.warn(
        '[Google Calendar] Falha ao consultar disponibilidade no Google Calendar (serviço indisponível ou erro de rede):',
        error,
      );
      return [];
    }
  }

  async filterFreeSlots(
    dateStr: string,
    potentialSlots: { start_time: string; end_time: string }[],
  ): Promise<{ start_time: string; end_time: string }[]> {
    if (potentialSlots.length === 0) return [];

    // Find the minimum and maximum boundaries of all candidate slots for FreeBusy query
    const sortedTimes = potentialSlots
      .map((s) => ({
        start: new Date(`${dateStr}T${s.start_time}-03:00`),
        end: new Date(`${dateStr}T${s.end_time}-03:00`),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const minStart = sortedTimes[0].start;
    const maxEnd = sortedTimes[sortedTimes.length - 1].end;

    // Get busy periods from Google Calendar
    const busyPeriods = await this.checkAvailability(minStart, maxEnd);

    // Filter candidate slots that do NOT overlap with any busy periods
    return potentialSlots.filter((slot) => {
      const candidateStart = new Date(`${dateStr}T${slot.start_time}-03:00`);
      const candidateEnd = new Date(`${dateStr}T${slot.end_time}-03:00`);

      const hasOverlap = busyPeriods.some((busy) => {
        return candidateStart < busy.end && candidateEnd > busy.start;
      });

      return !hasOverlap;
    });
  }

  async createEvent(
    title: string,
    startTimeOrDate: Date | string,
    endTimeOrStartTime: Date | string,
    attendeesOrEndTime?: string[] | string,
    descriptionOrAttendees?: string | string[],
    description?: string,
  ): Promise<{ eventId: string; meetUrl: string | null }> {
    let startLocal: Date;
    let endLocal: Date;
    let finalAttendees: string[] | undefined;
    let finalDescription: string | undefined;

    if (
      typeof startTimeOrDate === 'string' &&
      typeof endTimeOrStartTime === 'string' &&
      typeof attendeesOrEndTime === 'string'
    ) {
      const dateStr = startTimeOrDate;
      const startTimeStr = endTimeOrStartTime;
      const endTimeStr = attendeesOrEndTime;

      console.log(`[STEP A]
Input:
date=${dateStr}
start=${startTimeStr}

↓`);

      startLocal = parseBusinessDate(dateStr, startTimeStr);
      endLocal = parseBusinessDate(dateStr, endTimeStr);

      console.log(`[STEP B]
Parsed Date:
${startLocal.toString()}

↓

ISO:
${startLocal.toISOString()}

↓`);

      finalAttendees = Array.isArray(descriptionOrAttendees) ? descriptionOrAttendees : undefined;
      finalDescription = description;
    } else if (startTimeOrDate instanceof Date && endTimeOrStartTime instanceof Date) {
      startLocal = startTimeOrDate;
      endLocal = endTimeOrStartTime;
      finalAttendees = Array.isArray(attendeesOrEndTime) ? attendeesOrEndTime : undefined;
      finalDescription =
        typeof descriptionOrAttendees === 'string' ? descriptionOrAttendees : undefined;
    } else {
      throw new Error('Invalid arguments passed to createEvent');
    }

    const formattedStart = formatLocalDate(startLocal);
    const formattedEnd = formatLocalDate(endLocal);

    if (typeof startTimeOrDate === 'string') {
      console.log(`Google Payload:
start.dateTime = ${formattedStart}
start.timeZone = America/Sao_Paulo`);
    }

    try {
      const updatedAttendees = finalAttendees ? finalAttendees.map((email) => ({ email })) : [];
      const response = await this.calendarClient.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: {
          summary: title,
          description: finalDescription || 'PM Sessions - Interview Session',
          start: {
            dateTime: formattedStart,
            timeZone: APP_TIMEZONE,
          },
          end: {
            dateTime: formattedEnd,
            timeZone: APP_TIMEZONE,
          },
          attendees: updatedAttendees,
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        },
      });

      const eventId = response.data.id!;
      const meetUrl = response.data.hangoutLink || null;

      return { eventId, meetUrl };
    } catch (error: unknown) {
      console.error('Error creating calendar event:', error);
      const errObj = error as { response?: { data?: unknown } };
      if (errObj.response?.data) {
        console.error('Google API Error Details:', JSON.stringify(errObj.response.data, null, 2));
      }
      throw new Error('Failed to create event in Google Calendar');
    }
  }

  async syncAttendees(eventId: string, attendees: string[], description: string): Promise<void> {
    try {
      const updatedAttendees = attendees.map((email) => ({ email }));

      await this.calendarClient.events.patch({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
        requestBody: {
          attendees: updatedAttendees,
          description,
        },
      });
    } catch (error) {
      console.error('Error syncing attendees:', error);
      throw new Error('Failed to sync attendees in Google Calendar');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.calendarClient.events.delete({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object') {
        const errObj = error as Record<string, unknown>;
        if (
          errObj.code === 404 ||
          errObj.code === 410 ||
          (typeof errObj.message === 'string' && errObj.message.includes('Not Found'))
        ) {
          console.warn(
            `Event ${eventId} not found or already deleted on Google Calendar. Skipping.`,
          );
          return;
        }
      }
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete event in Google Calendar');
    }
  }

  async updateEventTime(
    eventId: string,
    title: string,
    startTimeOrDate: Date | string,
    endTimeOrStartTime: Date | string,
    endTimeStr?: string,
  ): Promise<void> {
    let startLocal: Date;
    let endLocal: Date;

    if (
      typeof startTimeOrDate === 'string' &&
      typeof endTimeOrStartTime === 'string' &&
      typeof endTimeStr === 'string'
    ) {
      const dateStr = startTimeOrDate;
      const startTimeStr = endTimeOrStartTime;

      console.log(`[STEP A]
Input:
date=${dateStr}
start=${startTimeStr}

↓`);

      startLocal = parseBusinessDate(dateStr, startTimeStr);
      endLocal = parseBusinessDate(dateStr, endTimeStr);

      console.log(`[STEP B]
Parsed Date:
${startLocal.toString()}

↓

ISO:
${startLocal.toISOString()}

↓`);
    } else if (startTimeOrDate instanceof Date && endTimeOrStartTime instanceof Date) {
      startLocal = startTimeOrDate;
      endLocal = endTimeOrStartTime;
    } else {
      throw new Error('Invalid arguments passed to updateEventTime');
    }

    const formattedStart = formatLocalDate(startLocal);
    const formattedEnd = formatLocalDate(endLocal);

    if (typeof startTimeOrDate === 'string') {
      console.log(`Google Payload:
start.dateTime = ${formattedStart}
start.timeZone = America/Sao_Paulo`);
    }

    try {
      await this.calendarClient.events.patch({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
        requestBody: {
          summary: title,
          start: {
            dateTime: formattedStart,
            timeZone: APP_TIMEZONE,
          },
          end: {
            dateTime: formattedEnd,
            timeZone: APP_TIMEZONE,
          },
        },
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update event in Google Calendar');
    }
  }
}

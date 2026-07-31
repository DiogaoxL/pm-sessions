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
  syncAttendees(eventId: string, attendees: string[], description: string): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  updateEventTime(eventId: string, title: string, startTime: Date, endTime: Date): Promise<void>;
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
    startTime: Date,
    endTime: Date,
    attendees?: string[],
    description?: string,
  ): Promise<{ eventId: string; meetUrl: string | null }> {
    try {
      const updatedAttendees = attendees ? attendees.map((email) => ({ email })) : [];
      const response = await this.calendarClient.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: {
          summary: title,
          description: description || 'PM Sessions - Interview Session',
          start: {
            dateTime: formatLocalDate(startTime),
            timeZone: APP_TIMEZONE,
          },
          end: {
            dateTime: formatLocalDate(endTime),
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
      // Se o evento ja foi deletado ou nao existe mais, prossegue silenciosamente
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
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    try {
      await this.calendarClient.events.patch({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
        requestBody: {
          summary: title,
          start: {
            dateTime: formatLocalDate(startTime),
            timeZone: APP_TIMEZONE,
          },
          end: {
            dateTime: formatLocalDate(endTime),
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

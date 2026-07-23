import { google } from 'googleapis';

export interface IGoogleCalendarService {
  checkAvailability(startTime: Date, endTime: Date): Promise<{ start: Date; end: Date }[]>;
  filterFreeSlots(
    dateStr: string,
    potentialSlots: { start_time: string; end_time: string }[],
  ): Promise<{ start_time: string; end_time: string }[]>;
  createEvent(
    title: string,
    startTime: Date,
    endTime: Date,
    organizerEmail: string,
  ): Promise<{ eventId: string; meetUrl: string | null }>;
  syncAttendees(eventId: string, attendees: string[]): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  updateEventTime(eventId: string, title: string, startTime: Date, endTime: Date): Promise<void>;
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
      console.error('Error fetching calendar availability:', error);
      throw new Error('Failed to fetch availability from Google Calendar');
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
        start: new Date(`${dateStr}T${s.start_time}Z`),
        end: new Date(`${dateStr}T${s.end_time}Z`),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const minStart = sortedTimes[0].start;
    const maxEnd = sortedTimes[sortedTimes.length - 1].end;

    // Get busy periods from Google Calendar
    const busyPeriods = await this.checkAvailability(minStart, maxEnd);

    // Filter candidate slots that do NOT overlap with any busy periods
    return potentialSlots.filter((slot) => {
      const candidateStart = new Date(`${dateStr}T${slot.start_time}Z`);
      const candidateEnd = new Date(`${dateStr}T${slot.end_time}Z`);

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
    organizerEmail: string,
  ): Promise<{ eventId: string; meetUrl: string | null }> {
    try {
      const response = await this.calendarClient.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: title,
          description: 'PM Sessions - Interview Session',
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          organizer: {
            email: organizerEmail,
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              conferenceSolutionKey: {
                type: 'hangoutMeet',
              },
            },
          },
        },
      });

      const eventId = response.data.id!;
      const meetUrl = response.data.hangoutLink || null;

      return { eventId, meetUrl };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create event in Google Calendar');
    }
  }

  async syncAttendees(eventId: string, attendees: string[]): Promise<void> {
    try {
      const updatedAttendees = attendees.map((email) => ({ email }));

      await this.calendarClient.events.patch({
        calendarId: 'primary',
        eventId,
        sendUpdates: 'all',
        requestBody: {
          attendees: updatedAttendees,
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
            dateTime: startTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
        },
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update event in Google Calendar');
    }
  }
}

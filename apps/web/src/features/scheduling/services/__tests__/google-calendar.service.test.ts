import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleCalendarService } from '../google-calendar.service';

const { mockQuery, mockInsert, mockPatch, MockOAuth2 } = vi.hoisted(() => {
  return {
    mockQuery: vi.fn(),
    mockInsert: vi.fn(),
    mockPatch: vi.fn(),
    MockOAuth2: class {
      setCredentials = vi.fn();
    },
  };
});

vi.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: MockOAuth2,
      },
      calendar: vi.fn().mockImplementation(() => ({
        freebusy: {
          query: mockQuery,
        },
        events: {
          insert: mockInsert,
          patch: mockPatch,
        },
      })),
    },
  };
});

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token';
    service = new GoogleCalendarService();
  });

  describe('checkAvailability', () => {
    it('deve retornar periodos ocupados da API do Google', async () => {
      mockQuery.mockResolvedValue({
        data: {
          calendars: {
            primary: {
              busy: [{ start: '2026-07-20T14:00:00Z', end: '2026-07-20T15:00:00Z' }],
            },
          },
        },
      });

      const busy = await service.checkAvailability(
        new Date('2026-07-20T13:00:00Z'),
        new Date('2026-07-20T16:00:00Z'),
      );

      expect(busy).toHaveLength(1);
      expect(busy[0].start.toISOString()).toBe('2026-07-20T14:00:00.000Z');
      expect(busy[0].end.toISOString()).toBe('2026-07-20T15:00:00.000Z');
      expect(mockQuery).toHaveBeenCalled();
    });

    it('deve propagar erro amigavel sob falha', async () => {
      mockQuery.mockRejectedValue(new Error('Google API Error'));
      await expect(service.checkAvailability(new Date(), new Date())).rejects.toThrow(
        'Failed to fetch availability from Google Calendar',
      );
    });
  });

  describe('filterFreeSlots', () => {
    it('deve filtrar slots ocupados mantendo apenas os livres', async () => {
      mockQuery.mockResolvedValue({
        data: {
          calendars: {
            primary: {
              busy: [{ start: '2026-07-20T14:00:00Z', end: '2026-07-20T15:00:00Z' }],
            },
          },
        },
      });

      const potentialSlots = [
        { start_time: '13:00:00', end_time: '14:00:00' }, // livre
        { start_time: '14:00:00', end_time: '15:00:00' }, // ocupado (overlap)
        { start_time: '15:00:00', end_time: '16:00:00' }, // livre
      ];

      const freeSlots = await service.filterFreeSlots('2026-07-20', potentialSlots);

      expect(freeSlots).toHaveLength(2);
      expect(freeSlots[0].start_time).toBe('13:00:00');
      expect(freeSlots[1].start_time).toBe('15:00:00');
    });
  });

  describe('createEvent', () => {
    it('deve criar um evento com conferenceData e retornar id e hangoutLink', async () => {
      mockInsert.mockResolvedValue({
        data: {
          id: 'google-event-123',
          hangoutLink: 'https://meet.google.com/abc-defg-hij',
        },
      });

      const result = await service.createEvent(
        'Interview Session',
        new Date('2026-07-20T14:00:00Z'),
        new Date('2026-07-20T15:00:00Z'),
        'admin@example.com',
      );

      expect(result.eventId).toBe('google-event-123');
      expect(result.meetUrl).toBe('https://meet.google.com/abc-defg-hij');
      expect(mockInsert).toHaveBeenCalled();
    });

    it('deve propagar erro amigavel se insert falhar', async () => {
      mockInsert.mockRejectedValue(new Error('Google API Error'));
      await expect(
        service.createEvent('Test', new Date(), new Date(), 'admin@example.com'),
      ).rejects.toThrow('Failed to create event in Google Calendar');
    });
  });

  describe('syncAttendees', () => {
    it('deve disparar requisicao patch com a lista de e-mails', async () => {
      mockPatch.mockResolvedValue({});

      await service.syncAttendees('event-id-123', ['attendee@example.com']);

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'event-id-123',
          sendUpdates: 'all',
          requestBody: {
            attendees: [{ email: 'attendee@example.com' }],
          },
        }),
      );
    });

    it('deve propagar erro amigavel se patch falhar', async () => {
      mockPatch.mockRejectedValue(new Error('Google API Error'));
      await expect(service.syncAttendees('event-id', [])).rejects.toThrow(
        'Failed to sync attendees in Google Calendar',
      );
    });
  });
});

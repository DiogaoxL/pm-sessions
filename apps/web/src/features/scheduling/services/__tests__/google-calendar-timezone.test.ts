import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoogleCalendarService, parseBusinessDate } from '../google-calendar.service';

const { mockInsert, MockOAuth2 } = vi.hoisted(() => {
  return {
    mockInsert: vi.fn(),
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
        events: {
          insert: mockInsert,
        },
      })),
    },
  };
});

describe('Google Calendar Timezone Anti-Regression Suite', () => {
  let service: GoogleCalendarService;
  const originalTZ = process.env.TZ;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'test-token';
    service = new GoogleCalendarService();
  });

  afterEach(() => {
    process.env.TZ = originalTZ || 'America/Sao_Paulo';
  });

  // Helper to run the test in a specific environment timezone
  async function testWithServerTZ(tzName: string) {
    process.env.TZ = tzName;

    mockInsert.mockResolvedValue({
      data: {
        id: 'event-xyz',
        hangoutLink: 'https://meet.google.com/abc-def-ghi',
      },
    });

    // Instant representing 2026-07-31T08:00:00 in America/Sao_Paulo (which is 11:00:00 UTC)
    const startTimeInUTC = new Date('2026-07-31T11:00:00Z');
    const endTimeInUTC = new Date('2026-07-31T12:00:00Z');

    await service.createEvent('Test Meeting', startTimeInUTC, endTimeInUTC);

    expect(mockInsert).toHaveBeenCalledTimes(1);
    const payload = mockInsert.mock.calls[0][0].requestBody;

    // Cenários 1-4 & 5: Validate explicit timezone and exact formatted YYYY-MM-DDTHH:mm:ss local value
    expect(payload.start.dateTime).toBe('2026-07-31T08:00:00');
    expect(payload.start.timeZone).toBe('America/Sao_Paulo');
    expect(payload.end.dateTime).toBe('2026-07-31T09:00:00');
    expect(payload.end.timeZone).toBe('America/Sao_Paulo');

    // Cenário 6: Ensure no Z or UTC suffixes are present in the local date strings
    expect(payload.start.dateTime).not.toContain('Z');
    expect(payload.start.dateTime).not.toContain('UTC');
    expect(payload.end.dateTime).not.toContain('Z');
    expect(payload.end.dateTime).not.toContain('UTC');

    return payload;
  }

  it('Cenário 1: Servidor em fuso UTC', async () => {
    await testWithServerTZ('UTC');
  });

  it('Cenário 2: Servidor em fuso America/Sao_Paulo', async () => {
    await testWithServerTZ('America/Sao_Paulo');
  });

  it('Cenário 3: Servidor em fuso Europe/London', async () => {
    await testWithServerTZ('Europe/London');
  });

  it('Cenário 4: Servidor em fuso Asia/Tokyo', async () => {
    await testWithServerTZ('Asia/Tokyo');
  });

  it('Cenário 7: Teste de snapshot do payload completo', async () => {
    process.env.TZ = 'UTC';
    mockInsert.mockResolvedValue({
      data: {
        id: 'event-xyz',
        hangoutLink: 'https://meet.google.com/abc-def-ghi',
      },
    });

    const startTimeInUTC = new Date('2026-07-31T11:00:00Z');
    const endTimeInUTC = new Date('2026-07-31T12:00:00Z');

    await service.createEvent(
      'Test Meeting with Snapshot',
      startTimeInUTC,
      endTimeInUTC,
      ['test@example.com'],
      'Test Desc',
    );
    const payload = mockInsert.mock.calls[0][0].requestBody;

    expect(payload).toMatchInlineSnapshot(
      {
        conferenceData: {
          createRequest: {
            requestId: expect.any(String),
          },
        },
      },
      `
      {
        "attendees": [
          {
            "email": "test@example.com",
          },
        ],
        "conferenceData": {
          "createRequest": {
            "conferenceSolutionKey": {
              "type": "hangoutsMeet",
            },
            "requestId": Any<String>,
          },
        },
        "description": "Test Desc",
        "end": {
          "dateTime": "2026-07-31T09:00:00",
          "timeZone": "America/Sao_Paulo",
        },
        "start": {
          "dateTime": "2026-07-31T08:00:00",
          "timeZone": "America/Sao_Paulo",
        },
        "summary": "Test Meeting with Snapshot",
      }
    `,
    );
  });

  describe('String Parameters - Timezone Correction Regression Suite', () => {
    const timezones = ['UTC', 'America/Sao_Paulo', 'Europe/London', 'Asia/Tokyo'];

    timezones.forEach((tz) => {
      describe(`Simulated Server Timezone: ${tz}`, () => {
        beforeEach(() => {
          process.env.TZ = tz;
        });

        it('should correctly parse the business date to the exact UTC instant', () => {
          const date = '2026-07-31';
          const startTime = '20:00:00';
          const parsed = parseBusinessDate(date, startTime, 'America/Sao_Paulo');
          expect(parsed.toISOString()).toBe('2026-07-31T23:00:00.000Z');
        });

        it('should produce the exact payload for Google Calendar without timezone shift', async () => {
          mockInsert.mockResolvedValue({
            data: {
              id: 'event-abc',
              hangoutLink: 'https://meet.google.com/abc',
            },
          });

          await service.createEvent('Test Meeting', '2026-07-31', '20:00:00', '21:00:00');

          expect(mockInsert).toHaveBeenCalledTimes(1);
          const payload = mockInsert.mock.calls[0][0].requestBody;

          expect(payload.start.dateTime).toBe('2026-07-31T20:00:00');
          expect(payload.start.timeZone).toBe('America/Sao_Paulo');
          expect(payload.end.dateTime).toBe('2026-07-31T21:00:00');
          expect(payload.end.timeZone).toBe('America/Sao_Paulo');

          // Verify no Z or UTC is present in the dateTime string
          expect(payload.start.dateTime).not.toContain('Z');
          expect(payload.start.dateTime).not.toContain('UTC');
          expect(payload.end.dateTime).not.toContain('Z');
          expect(payload.end.dateTime).not.toContain('UTC');
        });
      });
    });
  });
});

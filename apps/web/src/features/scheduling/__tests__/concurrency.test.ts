import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulingService } from '../services/scheduling.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
} from '../repositories/interfaces';
import { IGoogleCalendarService } from '../services/google-calendar.service';
import { IHostAllocatorService } from '../services/host-allocator.service';

vi.mock('server-only', () => ({}));

describe('Concurrency Reservation Suite', () => {
  let mockTimeSlotRepository: Partial<ITimeSlotRepository>;
  let mockSessionRepository: Partial<ISessionRepository>;
  let mockParticipantRepository: Partial<IParticipantRepository>;
  let mockGoogleCalendarService: Partial<IGoogleCalendarService>;
  let mockHostAllocatorService: Partial<IHostAllocatorService>;
  let service: SchedulingService;

  beforeEach(() => {
    mockTimeSlotRepository = {
      findTimeSlotById: vi.fn().mockResolvedValue({
        id: 'slot-1',
        date: '2026-08-15',
        start_time: '14:00:00',
        end_time: '15:00:00',
        capacity: 1,
        status: 'OPEN',
        created_at: '',
        updated_at: '',
      }),
    };

    mockParticipantRepository = {
      existsConfirmedParticipant: vi.fn().mockResolvedValue(false),
      insertParticipant: vi.fn().mockImplementation(async (data) => ({
        id: 'p-inst-1',
        ...data,
      })),
      getParticipantsBySession: vi.fn().mockResolvedValue([]),
    };

    mockGoogleCalendarService = {
      createEvent: vi
        .fn()
        .mockResolvedValue({ eventId: 'g-event-id', meetUrl: 'https://meet.google.com' }),
      isCalendarConfigured: vi.fn().mockReturnValue(true),
      syncAttendees: vi.fn().mockResolvedValue(undefined),
    };

    mockHostAllocatorService = {
      getNextHostEmail: vi.fn().mockResolvedValue('diogo@pulsemais.org.br'),
    };

    // Mock session repository with atomic counter check simulated
    let currentParticipants = 0;
    const capacity = 1;

    mockSessionRepository = {
      findSessionById: vi.fn().mockResolvedValue({
        id: 's-1',
        title: 'Entrevista em Grupo',
        capacity: 1,
        current_participants: 0,
      }),
      updateSessionCalendar: vi.fn().mockResolvedValue(undefined),
      allocateParticipant: vi.fn().mockImplementation(async () => {
        // Atomic transaction check simulation
        if (currentParticipants >= capacity) {
          throw new Error('No seats available');
        }
        currentParticipants += 1;
        return {
          participant_id: 'p-1',
          session_id: 's-1',
          is_new_session: false,
          organizer_email: 'host@test.com',
          calendar_event_id: 'g-event-id',
          meet_url: 'https://meet.google.com',
        };
      }),
    };

    service = new SchedulingService(
      mockTimeSlotRepository as ITimeSlotRepository,
      mockSessionRepository as ISessionRepository,
      mockParticipantRepository as IParticipantRepository,
      mockGoogleCalendarService as IGoogleCalendarService,
      mockHostAllocatorService as IHostAllocatorService,
    );
  });

  it('should allow exactly 1 reservation out of 100 concurrent requests (No Overbooking)', async () => {
    const promises = Array.from({ length: 100 }).map((_, index) =>
      service.scheduleSession(`john-${index}@test.com`, 'John Concurrency', 's-1', 'slot-1', null),
    );

    const results = await Promise.allSettled(promises);

    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(99);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulingService } from '../scheduling.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
} from '../../repositories/interfaces';
import { IGoogleCalendarService } from '../google-calendar.service';
import { IHostAllocatorService } from '../host-allocator.service';

vi.mock('server-only', () => ({}));

describe('Chaos Engineering Suite - Graceful Degradation', () => {
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
        capacity: 3,
        status: 'OPEN',
        created_at: '',
        updated_at: '',
      }),
    };

    mockParticipantRepository = {
      existsConfirmedParticipant: vi.fn().mockResolvedValue(false),
      insertParticipant: vi.fn().mockImplementation(async (data) => ({
        id: 'p-1',
        ...data,
      })),
      getParticipantsBySession: vi.fn().mockResolvedValue([]),
    };

    mockHostAllocatorService = {
      getNextHostEmail: vi.fn().mockResolvedValue('diogo@pulsemais.org.br'),
    };

    mockSessionRepository = {
      findSessionById: vi.fn().mockResolvedValue({
        id: 's-1',
        title: 'Entrevista em Grupo',
        capacity: 3,
        current_participants: 0,
      }),
      updateSessionCalendar: vi.fn().mockResolvedValue(undefined),
      allocateParticipant: vi.fn().mockResolvedValue({
        participant_id: 'p-1',
        session_id: 's-1',
        is_new_session: true,
        organizer_email: 'diogo@pulsemais.org.br',
        calendar_event_id: null,
        meet_url: null,
      }),
      removeParticipant: vi.fn().mockResolvedValue(undefined),
    };

    mockGoogleCalendarService = {
      isCalendarConfigured: vi.fn().mockReturnValue(true),
    };
  });

  it('should degrade gracefully on Google Calendar failures (non-blocking for the scheduling user)', async () => {
    // 1. Simulate Google Calendar API quota exceeded
    mockGoogleCalendarService.createEvent = vi
      .fn()
      .mockRejectedValue(new Error('Google API Quota Exceeded (403)'));

    service = new SchedulingService(
      mockTimeSlotRepository as ITimeSlotRepository,
      mockSessionRepository as ISessionRepository,
      mockParticipantRepository as IParticipantRepository,
      mockGoogleCalendarService as IGoogleCalendarService,
      mockHostAllocatorService as IHostAllocatorService,
    );

    // 2. Perform reservation attempt - it should succeed to avoid locking out the user
    const res = await service.scheduleSession('john@test.com', 'John Chaos', 's-1', 'slot-1', null);
    expect(res.id).toBe('p-1');
    expect(res.status).toBe('CONFIRMED');
  });

  it('should fail and propagate error when local Database (Supabase) is offline (blocking error)', async () => {
    // 1. Simulate Supabase connection timeout
    mockParticipantRepository.existsConfirmedParticipant = vi
      .fn()
      .mockRejectedValue(new Error('PGRST_OFFLINE: Database connection timeout'));

    service = new SchedulingService(
      mockTimeSlotRepository as ITimeSlotRepository,
      mockSessionRepository as ISessionRepository,
      mockParticipantRepository as IParticipantRepository,
      mockGoogleCalendarService as IGoogleCalendarService,
      mockHostAllocatorService as IHostAllocatorService,
    );

    // 2. Perform reservation attempt - it must fail because local database is required
    await expect(
      service.scheduleSession('john@test.com', 'John Chaos', 's-1', 'slot-1', null),
    ).rejects.toThrow('PGRST_OFFLINE: Database connection timeout');
  });
});

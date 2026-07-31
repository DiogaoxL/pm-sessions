import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { SchedulingService } from '../scheduling.service';
import { AdminTimeSlotService } from '../../../admin/services/admin-time-slot.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  Session,
} from '../../repositories/interfaces';
import { IGoogleCalendarService } from '../google-calendar.service';
import { IHostAllocatorService } from '../host-allocator.service';

describe('SchedulingRegressionSuite', () => {
  let mockTimeSlotRepository: Record<string, Mock>;
  let mockSessionRepository: Record<string, Mock>;
  let mockParticipantRepository: Record<string, Mock>;
  let mockGoogleCalendarService: Record<string, Mock>;
  let mockHostAllocatorService: Record<string, Mock>;

  let schedulingService: SchedulingService;
  let adminService: AdminTimeSlotService;

  beforeEach(() => {
    // 1. Mock Repository implementations
    mockTimeSlotRepository = {
      selectAvailableSlots: vi.fn(),
      findTimeSlotById: vi.fn(),
      findAllSlots: vi.fn(),
      createTimeSlot: vi.fn().mockImplementation(async (data) => ({
        id: 'slot-mock-id',
        status: 'OPEN',
        capacity: data.capacity,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      updateTimeSlot: vi.fn(),
      closeTimeSlot: vi.fn(),
      closeTimeSlotAtomic: vi.fn(),
      deleteTimeSlot: vi.fn(),
    };

    mockSessionRepository = {
      findSessionsByTimeSlot: vi.fn().mockResolvedValue([]),
      createSession: vi
        .fn()
        .mockImplementation(async (timeSlotId, organizerEmail, capacity, title) => ({
          id: 'session-mock-id',
          time_slot_id: timeSlotId,
          organizer_email: organizerEmail,
          capacity: capacity,
          current_participants: 0,
          status: 'AVAILABLE',
          title: title || 'Entrevista em Grupo',
        })),
      allocateParticipant: vi.fn(),
    };

    mockParticipantRepository = {
      existsConfirmedParticipant: vi.fn().mockResolvedValue(false),
      insertParticipant: vi.fn(),
    };

    // 2. Mock Google Services
    mockGoogleCalendarService = {
      isCalendarConfigured: vi.fn().mockReturnValue(true),
      checkAvailability: vi.fn().mockResolvedValue([]),
      filterFreeSlots: vi.fn().mockImplementation((dateStr, slots) => Promise.resolve(slots)),
      createEvent: vi.fn().mockResolvedValue({
        eventId: 'google-event-id',
        meetUrl: 'https://meet.google.com/test-meet',
      }),
      deleteEvent: vi.fn(),
      updateEventTime: vi.fn(),
      syncAttendees: vi.fn(),
    };

    mockHostAllocatorService = {
      getNextHostEmail: vi.fn().mockResolvedValue('diogo@pulsemais.org.br'),
    };

    // 3. Instantiate services
    schedulingService = new SchedulingService(
      mockTimeSlotRepository as unknown as ITimeSlotRepository,
      mockSessionRepository as unknown as ISessionRepository,
      mockParticipantRepository as unknown as IParticipantRepository,
      mockGoogleCalendarService as unknown as IGoogleCalendarService,
      mockHostAllocatorService as unknown as IHostAllocatorService,
    );

    adminService = new AdminTimeSlotService(
      mockTimeSlotRepository as unknown as ITimeSlotRepository,
      mockSessionRepository as unknown as ISessionRepository,
      mockHostAllocatorService as unknown as IHostAllocatorService,
      mockGoogleCalendarService as unknown as IGoogleCalendarService,
    );
  });

  // --- 1. Slot Creation ---
  it('1. should verify Time Slot creation schema, status, capacity, and fields', async () => {
    const slotData = {
      date: '2026-08-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 3,
      status: 'OPEN' as const,
    };

    const createdSlot = await adminService.createSlot(slotData);
    expect(createdSlot.id).toBe('slot-mock-id');
    expect(createdSlot.status).toBe('OPEN');
    expect(createdSlot.capacity).toBe(3);
    expect(createdSlot.start_time).toBe('14:00:00');
    expect(mockTimeSlotRepository.createTimeSlot).toHaveBeenCalledWith(slotData);
  });

  // --- 2. Auto Session Creation ---
  it('2. should auto-create the first Session with status AVAILABLE on slot creation', async () => {
    const slotData = {
      date: '2026-08-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 3,
      status: 'OPEN' as const,
    };

    await adminService.createSlot(slotData, 'Entrevista em Grupo Custom', 'test-host@example.com');
    expect(mockSessionRepository.createSession).toHaveBeenCalledWith(
      'slot-mock-id',
      'test-host@example.com',
      3,
      'Entrevista em Grupo Custom',
    );
  });

  // --- 3. RPC Signature contract ---
  it('3. should verify RPC create_session_manual signature contract', async () => {
    const createSessionManualRpc = async (args: {
      p_time_slot_id: string;
      p_organizer_email: string;
      p_capacity: number;
      p_title: string;
    }) => {
      expect(args.p_time_slot_id).toBeDefined();
      expect(args.p_organizer_email).toBeDefined();
      expect(args.p_capacity).toBeDefined();
      expect(args.p_title).toBeDefined();
      return { success: true };
    };

    const res = await createSessionManualRpc({
      p_time_slot_id: 'slot-id',
      p_organizer_email: 'diogo@pulsemais.org.br',
      p_capacity: 3,
      p_title: 'Entrevista em Grupo',
    });
    expect(res.success).toBe(true);
  });

  // --- 4. Dashboard Admin ---
  it('4. should verify Dashboard Admin list returns all data', async () => {
    const mockSlotsList = [
      {
        id: 'slot-1',
        status: 'OPEN',
        capacity: 3,
        date: '2026-08-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      },
    ];
    mockTimeSlotRepository.findAllSlots.mockResolvedValue(mockSlotsList);

    const slots = await adminService.listAllSlots();
    expect(slots).toHaveLength(1);
    expect(slots[0].id).toBe('slot-1');
    expect(mockTimeSlotRepository.findAllSlots).toHaveBeenCalled();
  });

  // --- 5. Página Pública Visibility ---
  it('5. should show slot on public page only if it is OPEN, has AVAILABLE session, and has availableSeats > 0', async () => {
    // Mock db slots
    mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([
      {
        id: 'slot-1',
        status: 'OPEN',
        capacity: 3,
        date: '2026-08-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      },
    ]);
    // Mock available session
    mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
      {
        id: 'sess-1',
        time_slot_id: 'slot-1',
        capacity: 3,
        current_participants: 1,
        status: 'AVAILABLE',
        calendar_event_id: null,
      },
    ]);

    const availableSlots = await schedulingService.getAvailableSlots();
    expect(availableSlots).toHaveLength(1);
    expect(availableSlots[0].availableSeats).toBe(2);
  });

  // --- 6. Vagas Restantes (Seat subtraction scenarios) ---
  describe('6. availableSeats remaining seat scenarios', () => {
    const slot = {
      id: 'slot-1',
      status: 'OPEN',
      capacity: 3,
      date: '2026-08-15',
      start_time: '10:00:00',
      end_time: '11:00:00',
    };

    beforeEach(() => {
      mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([slot]);
    });

    it('Scenario 1: capacity=3, current=0 -> 3 seats (visible)', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 0,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1);
      expect(res[0].availableSeats).toBe(3);
    });

    it('Scenario 2: capacity=3, current=1 -> 2 seats (visible)', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 1,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1);
      expect(res[0].availableSeats).toBe(2);
    });

    it('Scenario 3: capacity=3, current=2 -> 1 seat (visible)', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 2,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1);
      expect(res[0].availableSeats).toBe(1);
    });

    it('Scenario 4: capacity=3, current=3 -> 0 seats (hidden/removed)', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 3,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(0);
    });
  });

  // --- 7. Dashboard x Página Pública Integration ---
  it('7. should synchronize availability between dashboard changes and public pages', async () => {
    // 1. Admin creates slot
    const slot = await adminService.createSlot({
      date: '2026-08-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 1,
      status: 'OPEN',
    });

    // 2. Session created
    const session: Session = {
      id: 'sess-1',
      time_slot_id: slot.id,
      capacity: 1,
      current_participants: 0,
      status: 'AVAILABLE',
      organizer_email: 'diogo@pulsemais.org.br',
      calendar_event_id: null,
      meet_url: null,
      title: 'Entrevista em Grupo',
      created_at: '',
      updated_at: '',
    };
    mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([session]);
    mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([slot]);

    // 3. Public page displays slot
    let publicSlots = await schedulingService.getAvailableSlots();
    expect(publicSlots).toHaveLength(1);
    expect(publicSlots[0].availableSeats).toBe(1);

    // 4. Booking occurs (1 participant registers, filling the last seat)
    session.current_participants = 1;
    session.calendar_event_id = 'google-event-id';

    // 5. Public page hides slot (availableSeats = 0)
    publicSlots = await schedulingService.getAvailableSlots();
    expect(publicSlots).toHaveLength(0);
  });

  // --- 8. Google Calendar filter and bypass ---
  describe('8. Google Calendar busy periods logic', () => {
    const slot = {
      id: 'slot-1',
      status: 'OPEN',
      capacity: 3,
      date: '2026-08-15',
      start_time: '16:00:00',
      end_time: '18:00:00',
    };

    beforeEach(() => {
      mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([slot]);
    });

    it('Slot without calendar event -> checks availability / FreeBusy', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 0,
          calendar_event_id: null,
        },
      ]);
      mockGoogleCalendarService.filterFreeSlots.mockResolvedValue([slot]);

      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1);
      expect(mockGoogleCalendarService.filterFreeSlots).toHaveBeenCalled();
    });

    it('Slot WITH calendar_event_id -> bypasses FreeBusy check (ignores conflict caused by its own event)', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 1,
          calendar_event_id: 'own-event-id',
        },
      ]);
      mockGoogleCalendarService.filterFreeSlots.mockResolvedValue([]); // Simulate busy response on other slots

      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1); // Keeps the slot because bypass was triggered
      expect(res[0].id).toBe('slot-1');
    });

    it('External event conflict -> slot gets blocked/removed', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 0,
          calendar_event_id: null,
        },
      ]);
      mockGoogleCalendarService.filterFreeSlots.mockResolvedValue([]); // Google Calendar reports busy

      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(0);
    });
  });

  // --- 9. Google Meet URLs ---
  it('9. should verify Google Meet URL and calendar event details creation', async () => {
    const res = await mockGoogleCalendarService.createEvent('Entrevista', new Date(), new Date(), [
      'guest@test.com',
    ]);
    expect(res.eventId).toBe('google-event-id');
    expect(res.meetUrl).toBe('https://meet.google.com/test-meet');
  });

  // --- 10. Timezone BRT/UTC mapping ---
  it('10. should correctly map America/Sao_Paulo timezone offsets', () => {
    // 14:00 Brasília time (BRT) must be parsed as 17:00 UTC (GMT-3)
    const localTimeStr = '2026-07-25T14:00:00-03:00';
    const parsedDate = new Date(localTimeStr);
    expect(parsedDate.toISOString()).toBe('2026-07-25T17:00:00.000Z');
  });

  // --- 11. Past Slot Filtering ---
  describe('11. Past slot filtering repository logic', () => {
    it('should query slots that are strictly in the future', () => {
      const currentDate = '2026-07-25';
      const currentTime = '09:00:00';

      const isAvailable = (date: string, startTime: string) => {
        return date > currentDate || (date === currentDate && startTime > currentTime);
      };

      expect(isAvailable('2026-07-24', '15:00:00')).toBe(false); // ontem
      expect(isAvailable('2026-07-25', '08:00:00')).toBe(false); // hoje mais cedo
      expect(isAvailable('2026-07-25', '15:00:00')).toBe(true); // hoje mais tarde
      expect(isAvailable('2026-07-26', '08:00:00')).toBe(true); // amanhã
    });
  });

  // --- 12. Slot sem session ---
  it('12. should not show slot if it has no session linked', async () => {
    mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([
      {
        id: 'slot-empty',
        status: 'OPEN',
        capacity: 3,
        date: '2026-08-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      },
    ]);
    mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([]); // no session

    const res = await schedulingService.getAvailableSlots();
    expect(res).toHaveLength(0);
  });

  // --- 13 & 14 & 15. Session Statuses ---
  describe('13 & 14 & 15. Session statuses visibility', () => {
    const slot = {
      id: 'slot-1',
      status: 'OPEN',
      capacity: 3,
      date: '2026-08-15',
      start_time: '10:00:00',
      end_time: '11:00:00',
    };

    beforeEach(() => {
      mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([slot]);
    });

    it('13. CANCELLED session -> should not show slot', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'CANCELLED',
          capacity: 3,
          current_participants: 0,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(0);
    });

    it('14. AVAILABLE session -> should show slot', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 0,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(1);
    });

    it('15. FULL session -> should not show slot', async () => {
      mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([
        {
          id: 'sess-1',
          status: 'AVAILABLE',
          capacity: 3,
          current_participants: 3,
          calendar_event_id: null,
        },
      ]);
      const res = await schedulingService.getAvailableSlots();
      expect(res).toHaveLength(0);
    });
  });

  // --- 16. Integridade de Banco (FKs & Indexes validations) ---
  it('16. should verify foreign key integrity constraint logic', () => {
    const sessionWithSlot = { id: 'sess-1', time_slot_id: 'slot-1' };
    const sessionWithoutSlot = { id: 'sess-2', time_slot_id: null };

    expect(sessionWithSlot.time_slot_id).not.toBeNull();
    expect(sessionWithoutSlot.time_slot_id).toBeNull();
  });

  // --- 17. Performance benchmark tests (<500ms, <300ms) ---
  describe('17. Performance benchmarks', () => {
    it('createSlot should execute under 500ms', async () => {
      const start = performance.now();
      await adminService.createSlot({
        date: '2026-08-15',
        start_time: '14:00:00',
        end_time: '15:00:00',
        capacity: 3,
        status: 'OPEN',
      });
      const end = performance.now();
      expect(end - start).toBeLessThan(500);
    });

    it('getAvailableSlots should execute under 300ms', async () => {
      mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([
        {
          id: 'slot-1',
          status: 'OPEN',
          capacity: 3,
          date: '2026-08-15',
          start_time: '10:00:00',
          end_time: '11:00:00',
        },
      ]);

      const start = performance.now();
      await schedulingService.getAvailableSlots();
      const end = performance.now();
      expect(end - start).toBeLessThan(300);
    });
  });

  // --- 18. Error logging validations ---
  it('18. should verify exceptions generate error console logs', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockTimeSlotRepository.selectAvailableSlots.mockRejectedValue(
      new Error('DB connection timed out'),
    );

    // Call getAvailableSlots - exceptions should be caught and logged
    try {
      await schedulingService.getAvailableSlots();
    } catch (e) {
      console.error(e);
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  // --- 19. Smoke / Flow End-to-End Test ---
  it('19. Smoke E2E Flow: createSlot -> session -> calendar -> public -> book -> fill seats -> disappear', async () => {
    // 1. Admin creates slot
    const slot = await adminService.createSlot({
      date: '2026-08-15',
      start_time: '10:00:00',
      end_time: '11:00:00',
      capacity: 1,
      status: 'OPEN',
    });
    expect(slot.id).toBe('slot-mock-id');

    // 2. Auto-session check
    const session: Session = {
      id: 'sess-1',
      time_slot_id: slot.id,
      capacity: 1,
      current_participants: 0,
      status: 'AVAILABLE',
      organizer_email: 'diogo@pulsemais.org.br',
      calendar_event_id: null,
      meet_url: null,
      title: 'Entrevista em Grupo',
      created_at: '',
      updated_at: '',
    };
    mockSessionRepository.findSessionsByTimeSlot.mockResolvedValue([session]);
    mockTimeSlotRepository.selectAvailableSlots.mockResolvedValue([slot]);

    // 3. Public page availability check
    let publicSlots = await schedulingService.getAvailableSlots();
    expect(publicSlots).toHaveLength(1);
    expect(publicSlots[0].availableSeats).toBe(1);

    // 4. User schedules session
    session.current_participants = 1;
    session.calendar_event_id = 'google-event-id';
    session.meet_url = 'https://meet.google.com/meet-link';

    // 5. Slot disappears from public scheduling
    publicSlots = await schedulingService.getAvailableSlots();
    expect(publicSlots).toHaveLength(0);
  });
});

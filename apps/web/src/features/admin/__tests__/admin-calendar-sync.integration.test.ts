import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IGoogleCalendarService } from '@/features/scheduling/services/google-calendar.service';
import {
  ISessionRepository,
  IParticipantRepository,
  Session,
  Participant,
} from '@/features/scheduling/repositories/interfaces';
import { AdminParticipantService } from '@/features/admin/services/admin-participant.service';

// These tests validate the integration pattern used by the server actions (participant-actions.ts)
// by simulating the full flow: local DB change + Google Calendar sync + rollback on failure.

const mockParticipant: Participant = {
  id: 'part-1',
  name: 'Maria Santos',
  email: 'maria@test.com',
  session_id: 'session-1',
  status: 'CONFIRMED',
  phone: null,
  allocated_at: '',
  created_at: '',
  updated_at: '',
};

const mockSession: Session = {
  id: 'session-1',
  time_slot_id: 'slot-1',
  organizer_email: 'host@test.com',
  calendar_event_id: 'gcal-event-1',
  meet_url: 'https://meet.google.com/abc',
  capacity: 3,
  current_participants: 1,
  status: 'AVAILABLE',
  title: 'Entrevista em Grupo',
  created_at: '',
  updated_at: '',
};

function makeSessionRepo(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    findOpenSessionsByTimeSlot: vi.fn(),
    removeParticipant: vi.fn().mockResolvedValue(undefined),
    moveParticipant: vi.fn().mockResolvedValue(undefined),
    updateSessionCalendar: vi.fn(),
    findSessionById: vi.fn().mockResolvedValue(mockSession),
    findSessionsByTimeSlot: vi.fn(),
    allocateParticipant: vi.fn(),
    updateSessionCapacity: vi.fn(),
    createSession: vi.fn(),
    ...overrides,
  };
}

function makeParticipantRepo(
  overrides: Partial<IParticipantRepository> = {},
): IParticipantRepository {
  return {
    insertParticipant: vi.fn(),
    existsConfirmedParticipant: vi.fn(),
    getParticipantsBySession: vi.fn().mockResolvedValue([]),
    findParticipantById: vi.fn().mockResolvedValue(mockParticipant),
    updateParticipantStatus: vi
      .fn()
      .mockImplementation((id: string, status: Participant['status']) =>
        Promise.resolve({ ...mockParticipant, id, status }),
      ),
    deleteParticipant: vi.fn(),
    updateParticipantSessionId: vi.fn().mockResolvedValue(mockParticipant),
    ...overrides,
  };
}

function makeCalendarService(
  overrides: Partial<IGoogleCalendarService> = {},
): IGoogleCalendarService {
  return {
    isCalendarConfigured: vi.fn().mockReturnValue(true),
    getPrimaryCalendarEmail: vi.fn().mockResolvedValue('host@test.com'),
    checkAvailability: vi.fn(),
    filterFreeSlots: vi.fn(),
    createEvent: vi.fn(),
    syncAttendees: vi.fn().mockResolvedValue(undefined),
    deleteEvent: vi.fn().mockResolvedValue(undefined),
    updateEventTime: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

// Simulates the removeParticipantAction flow inline for integration testing
async function simulateRemoveParticipantAction(
  participantId: string,
  sessionRepo: ISessionRepository,
  participantRepo: IParticipantRepository,
  calendarService: IGoogleCalendarService,
) {
  const adminService = new AdminParticipantService(sessionRepo, participantRepo);
  const participantBefore = await participantRepo.findParticipantById(participantId);
  if (!participantBefore || participantBefore.status !== 'CONFIRMED') {
    return { success: false, error: 'Participant not found' };
  }

  // Under the new RPC architecture, we retrieve a cancelled participant state after removeParticipant (which calls the RPC)
  let callCount = 0;
  vi.mocked(participantRepo.findParticipantById).mockImplementation(async (id: string) => {
    callCount++;
    return {
      ...mockParticipant,
      id,
      status: callCount > 1 ? 'CANCELLED' : 'CONFIRMED',
    };
  });

  const removed = await adminService.removeParticipant(participantId);
  const session = await sessionRepo.findSessionById(removed.session_id);

  if (session?.calendar_event_id) {
    try {
      const remaining = await participantRepo.getParticipantsBySession(removed.session_id);
      const emails = remaining.map((p: Participant) => p.email);
      await calendarService.syncAttendees(session.calendar_event_id, emails, 'Description');
    } catch (calendarError) {
      console.error('[test] Calendar sync failed, rolling back', {
        session_id: removed.session_id,
        participant_id: participantId,
        organizer_email: session.organizer_email,
        error: calendarError,
      });
      await sessionRepo.allocateParticipant(
        session.time_slot_id,
        removed.email,
        removed.name,
        removed.phone || null,
        session.organizer_email,
      );
      return { success: false, error: 'Calendar sync failed, rolled back' };
    }
  }

  return { success: true, data: removed };
}

describe('Admin Actions — Google Calendar Integration (Task 05)', () => {
  let sessionRepo: ISessionRepository;
  let participantRepo: IParticipantRepository;
  let calendarService: IGoogleCalendarService;

  beforeEach(() => {
    sessionRepo = makeSessionRepo();
    participantRepo = makeParticipantRepo();
    calendarService = makeCalendarService();
  });

  describe('removeParticipant + syncAttendees', () => {
    it('deve remover participante e sincronizar o Google Calendar com sucesso', async () => {
      const result = await simulateRemoveParticipantAction(
        'part-1',
        sessionRepo,
        participantRepo,
        calendarService,
      );

      expect(result.success).toBe(true);
      expect(sessionRepo.removeParticipant).toHaveBeenCalledWith('part-1');
      expect(calendarService.syncAttendees).toHaveBeenCalledWith('gcal-event-1', [], 'Description');
    });

    it('deve reverter remoção local quando Google Calendar falhar', async () => {
      vi.mocked(calendarService.syncAttendees).mockRejectedValue(new Error('API quota exceeded'));

      const result = await simulateRemoveParticipantAction(
        'part-1',
        sessionRepo,
        participantRepo,
        calendarService,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Calendar sync failed');

      // Rollback: participant re-allocated via RPC
      expect(sessionRepo.allocateParticipant).toHaveBeenCalledWith(
        mockSession.time_slot_id,
        mockParticipant.email,
        mockParticipant.name,
        null,
        mockSession.organizer_email,
      );
    });

    it('deve emitir log estruturado ao falhar sincronização com Google Calendar', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(calendarService.syncAttendees).mockRejectedValue(new Error('Timeout'));

      await simulateRemoveParticipantAction(
        'part-1',
        sessionRepo,
        participantRepo,
        calendarService,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        '[test] Calendar sync failed, rolling back',
        expect.objectContaining({
          session_id: 'session-1',
          participant_id: 'part-1',
          organizer_email: 'host@test.com',
        }),
      );

      consoleSpy.mockRestore();
    });

    it('deve pular sincronização com Google Calendar se sessão não tiver calendar_event_id', async () => {
      vi.mocked(sessionRepo.findSessionById).mockResolvedValue({
        ...mockSession,
        calendar_event_id: null,
      });

      const result = await simulateRemoveParticipantAction(
        'part-1',
        sessionRepo,
        participantRepo,
        calendarService,
      );

      expect(result.success).toBe(true);
      expect(calendarService.syncAttendees).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AdminParticipantService,
  ParticipantNotFoundError,
  SessionNotFoundError,
  SessionFullError,
  SessionFinishedError,
  ParticipantAlreadyInSessionError,
  CapacityBelowCurrentParticipantsError,
} from '@/features/admin/services/admin-participant.service';
import {
  ISessionRepository,
  IParticipantRepository,
  Participant,
  Session,
} from '@/features/scheduling/repositories/interfaces';

const mockParticipant: Participant = {
  id: 'part-1',
  name: 'João Silva',
  email: 'joao@test.com',
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
  calendar_event_id: 'event-1',
  meet_url: 'https://meet.google.com/test',
  capacity: 3,
  current_participants: 1,
  status: 'AVAILABLE',
  created_at: '',
  updated_at: '',
};

const mockTargetSession: Session = {
  id: 'session-2',
  time_slot_id: 'slot-1',
  organizer_email: 'host2@test.com',
  calendar_event_id: 'event-2',
  meet_url: 'https://meet.google.com/test2',
  capacity: 3,
  current_participants: 1,
  status: 'AVAILABLE',
  created_at: '',
  updated_at: '',
};

function makeMockSessionRepo(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    findOpenSessionsByTimeSlot: vi.fn(),
    tryReserveSeat: vi.fn().mockResolvedValue(true),
    decrementParticipants: vi.fn().mockResolvedValue(undefined),
    updateSessionCalendar: vi.fn(),
    findSessionById: vi.fn().mockImplementation((id: string) => {
      if (id === 'session-1') return Promise.resolve(mockSession);
      if (id === 'session-2') return Promise.resolve(mockTargetSession);
      return Promise.resolve(null);
    }),
    findSessionsByTimeSlot: vi.fn(),
    allocateParticipant: vi.fn(),
    updateSessionCapacity: vi.fn().mockResolvedValue({ ...mockSession, capacity: 5 }),
    ...overrides,
  };
}

function makeMockParticipantRepo(
  overrides: Partial<IParticipantRepository> = {},
): IParticipantRepository {
  return {
    insertParticipant: vi.fn(),
    existsConfirmedParticipant: vi.fn(),
    getParticipantsBySession: vi.fn().mockResolvedValue([mockParticipant]),
    findParticipantById: vi.fn().mockResolvedValue(mockParticipant),
    updateParticipantStatus: vi
      .fn()
      .mockImplementation((id: string, status: Participant['status']) =>
        Promise.resolve({ ...mockParticipant, id, status }),
      ),
    deleteParticipant: vi.fn(),
    updateParticipantSessionId: vi
      .fn()
      .mockImplementation((id: string, sessionId: string) =>
        Promise.resolve({ ...mockParticipant, id, session_id: sessionId }),
      ),
    ...overrides,
  };
}

describe('AdminParticipantService', () => {
  let sessionRepo: ISessionRepository;
  let participantRepo: IParticipantRepository;
  let service: AdminParticipantService;

  beforeEach(() => {
    sessionRepo = makeMockSessionRepo();
    participantRepo = makeMockParticipantRepo();
    service = new AdminParticipantService(sessionRepo, participantRepo);
  });

  // --- removeParticipant ---

  describe('removeParticipant', () => {
    it('deve cancelar participante e decrementar a sessão', async () => {
      const result = await service.removeParticipant('part-1');

      expect(participantRepo.updateParticipantStatus).toHaveBeenCalledWith('part-1', 'CANCELLED');
      expect(sessionRepo.decrementParticipants).toHaveBeenCalledWith('session-1');
      expect(result.status).toBe('CANCELLED');
    });

    it('deve lançar ParticipantNotFoundError se participante não for CONFIRMED', async () => {
      vi.mocked(participantRepo.findParticipantById).mockResolvedValue({
        ...mockParticipant,
        status: 'CANCELLED',
      });
      await expect(service.removeParticipant('part-1')).rejects.toThrow(ParticipantNotFoundError);
    });

    it('deve lançar ParticipantNotFoundError se participante não existir', async () => {
      vi.mocked(participantRepo.findParticipantById).mockResolvedValue(null);
      await expect(service.removeParticipant('part-999')).rejects.toThrow(ParticipantNotFoundError);
    });
  });

  // --- moveParticipant ---

  describe('moveParticipant', () => {
    it('deve mover participante para sessão de destino com sucesso', async () => {
      vi.mocked(participantRepo.getParticipantsBySession).mockResolvedValue([]);

      const result = await service.moveParticipant('part-1', 'session-2');

      expect(sessionRepo.decrementParticipants).toHaveBeenCalledWith('session-1');
      expect(sessionRepo.tryReserveSeat).toHaveBeenCalledWith('session-2');
      expect(participantRepo.updateParticipantSessionId).toHaveBeenCalledWith(
        'part-1',
        'session-2',
      );
      expect(result.participant.session_id).toBe('session-2');
    });

    it('deve lançar SessionFinishedError ao mover para sessão encerrada', async () => {
      vi.mocked(sessionRepo.findSessionById).mockImplementation((id: string) =>
        id === 'session-2'
          ? Promise.resolve({ ...mockTargetSession, status: 'FINISHED' })
          : Promise.resolve(mockSession),
      );

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        SessionFinishedError,
      );
    });

    it('deve lançar SessionFullError ao mover para sessão lotada', async () => {
      vi.mocked(sessionRepo.findSessionById).mockImplementation((id: string) =>
        id === 'session-2'
          ? Promise.resolve({ ...mockTargetSession, current_participants: 3, capacity: 3 })
          : Promise.resolve(mockSession),
      );

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        SessionFullError,
      );
    });

    it('deve lançar ParticipantAlreadyInSessionError se o email já está na sessão destino', async () => {
      vi.mocked(participantRepo.getParticipantsBySession).mockResolvedValue([
        { ...mockParticipant, id: 'part-other', session_id: 'session-2' },
      ]);

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        ParticipantAlreadyInSessionError,
      );
    });

    it('deve lançar ParticipantAlreadyInSessionError ao mover para a mesma sessão', async () => {
      await expect(service.moveParticipant('part-1', 'session-1')).rejects.toThrow(
        ParticipantAlreadyInSessionError,
      );
    });

    it('deve reverter e lançar SessionFullError se tryReserveSeat falhar', async () => {
      vi.mocked(participantRepo.getParticipantsBySession).mockResolvedValue([]);
      vi.mocked(sessionRepo.tryReserveSeat).mockResolvedValue(false);

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        SessionFullError,
      );
      // Should have tried to restore source seat
      expect(sessionRepo.tryReserveSeat).toHaveBeenCalledWith('session-1');
    });
  });

  // --- updateSessionCapacity ---

  describe('updateSessionCapacity', () => {
    it('deve atualizar capacidade da sessão', async () => {
      const result = await service.updateSessionCapacity('session-1', 5);
      expect(sessionRepo.updateSessionCapacity).toHaveBeenCalledWith('session-1', 5);
      expect(result.capacity).toBe(5);
    });

    it('deve lançar CapacityBelowCurrentParticipantsError se nova capacidade for menor que atual', async () => {
      vi.mocked(sessionRepo.findSessionById).mockResolvedValue({
        ...mockSession,
        current_participants: 3,
      });

      await expect(service.updateSessionCapacity('session-1', 2)).rejects.toThrow(
        CapacityBelowCurrentParticipantsError,
      );
    });

    it('deve lançar SessionNotFoundError se sessão não existir', async () => {
      vi.mocked(sessionRepo.findSessionById).mockResolvedValue(null);
      await expect(service.updateSessionCapacity('session-999', 5)).rejects.toThrow(
        SessionNotFoundError,
      );
    });
  });
});

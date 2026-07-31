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
  title: 'Entrevista em Grupo',
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
  title: 'Entrevista em Grupo',
  created_at: '',
  updated_at: '',
};

function makeMockSessionRepo(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    findOpenSessionsByTimeSlot: vi.fn(),
    removeParticipant: vi.fn().mockResolvedValue(undefined),
    moveParticipant: vi.fn().mockResolvedValue(undefined),
    updateSessionCalendar: vi.fn(),
    findSessionById: vi.fn().mockImplementation((id: string) => {
      if (id === 'session-1') return Promise.resolve(mockSession);
      if (id === 'session-2') return Promise.resolve(mockTargetSession);
      return Promise.resolve(null);
    }),
    findSessionsByTimeSlot: vi.fn(),
    allocateParticipant: vi.fn(),
    updateSessionCapacity: vi.fn().mockResolvedValue({ ...mockSession, capacity: 5 }),
    createSession: vi.fn(),
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
      let callCount = 0;
      vi.mocked(participantRepo.findParticipantById).mockImplementation(async (id: string) => {
        callCount++;
        return {
          ...mockParticipant,
          id,
          status: callCount > 1 ? 'CANCELLED' : 'CONFIRMED',
        };
      });

      const result = await service.removeParticipant('part-1');

      expect(sessionRepo.removeParticipant).toHaveBeenCalledWith('part-1');
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
      let callCount = 0;
      vi.mocked(participantRepo.findParticipantById).mockImplementation(async (id: string) => {
        callCount++;
        return {
          ...mockParticipant,
          id,
          session_id: callCount > 1 ? 'session-2' : 'session-1',
        };
      });

      const result = await service.moveParticipant('part-1', 'session-2');

      expect(sessionRepo.moveParticipant).toHaveBeenCalledWith('part-1', 'session-2');
      expect(result.participant.session_id).toBe('session-2');
    });

    it('deve lançar SessionFinishedError ao mover para sessão encerrada', async () => {
      vi.mocked(sessionRepo.moveParticipant).mockRejectedValue({ code: 'P0006' });

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        SessionFinishedError,
      );
    });

    it('deve lançar SessionFullError ao mover para sessão lotada', async () => {
      vi.mocked(sessionRepo.moveParticipant).mockRejectedValue({ code: 'P0001' });

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        SessionFullError,
      );
    });

    it('deve lançar ParticipantAlreadyInSessionError se o email já está na sessão destino', async () => {
      vi.mocked(sessionRepo.moveParticipant).mockRejectedValue({ code: 'P0004' });

      await expect(service.moveParticipant('part-1', 'session-2')).rejects.toThrow(
        ParticipantAlreadyInSessionError,
      );
    });

    it('deve lançar ParticipantAlreadyInSessionError ao mover para a mesma sessão', async () => {
      vi.mocked(sessionRepo.moveParticipant).mockRejectedValue({ code: 'P0004' });

      await expect(service.moveParticipant('part-1', 'session-1')).rejects.toThrow(
        ParticipantAlreadyInSessionError,
      );
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

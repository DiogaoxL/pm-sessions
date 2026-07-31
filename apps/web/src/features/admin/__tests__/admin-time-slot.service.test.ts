import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminTimeSlotService } from '@/features/admin/services/admin-time-slot.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  TimeSlot,
} from '@/features/scheduling/repositories/interfaces';
import { IHostAllocatorService } from '@/features/scheduling/services/host-allocator.service';

import { IGoogleCalendarService } from '@/features/scheduling/services/google-calendar.service';

const mockSlot: TimeSlot = {
  id: 'slot-1',
  date: '2026-12-01',
  start_time: '09:00:00',
  end_time: '10:00:00',
  capacity: 5,
  status: 'OPEN',
  created_at: '',
  updated_at: '',
};

function makeMockRepo(overrides: Partial<ITimeSlotRepository> = {}): ITimeSlotRepository {
  return {
    selectAvailableSlots: vi.fn(),
    findTimeSlotById: vi.fn().mockResolvedValue(mockSlot),
    findAllSlots: vi.fn().mockResolvedValue([mockSlot]),
    createTimeSlot: vi.fn().mockResolvedValue(mockSlot),
    updateTimeSlot: vi.fn().mockResolvedValue(mockSlot),
    closeTimeSlot: vi.fn().mockResolvedValue({ ...mockSlot, status: 'CLOSED' }),
    closeTimeSlotAtomic: vi.fn().mockResolvedValue(undefined),
    deleteTimeSlot: vi.fn().mockResolvedValue(undefined),
    hasActiveParticipants: vi.fn().mockResolvedValue(false),

    ...overrides,
  };
}

describe('AdminTimeSlotService', () => {
  let repo: ITimeSlotRepository;
  let service: AdminTimeSlotService;
  let mockSessionRepo: ISessionRepository;
  let mockHostAllocator: IHostAllocatorService;
  let mockGoogleCalendar: IGoogleCalendarService;

  beforeEach(() => {
    repo = makeMockRepo();
    mockSessionRepo = {
      createSession: vi.fn().mockResolvedValue({}),
      findSessionsByTimeSlot: vi.fn().mockResolvedValue([]),
      findOpenSessionsByTimeSlot: vi.fn(),
      removeParticipant: vi.fn(),
      moveParticipant: vi.fn(),
      updateSessionCalendar: vi.fn(),
      findSessionById: vi.fn(),
      allocateParticipant: vi.fn(),
      updateSessionCapacity: vi.fn(),
    };
    mockHostAllocator = {
      getNextHostEmail: vi.fn().mockResolvedValue('host@test.com'),
    };
    mockGoogleCalendar = {
      isCalendarConfigured: vi.fn().mockReturnValue(true),
      getPrimaryCalendarEmail: vi.fn().mockResolvedValue('host@test.com'),
      checkAvailability: vi.fn(),
      filterFreeSlots: vi.fn(),
      createEvent: vi.fn(),
      syncAttendees: vi.fn(),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      updateEventTime: vi.fn().mockResolvedValue(undefined),
    };
    service = new AdminTimeSlotService(
      repo,
      mockSessionRepo,
      mockHostAllocator,
      mockGoogleCalendar,
    );
  });

  describe('listAllSlots', () => {
    it('deve retornar todos os slots via repositório', async () => {
      const result = await service.listAllSlots();
      expect(repo.findAllSlots).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockSlot]);
    });
  });

  describe('createSlot', () => {
    it('deve criar slot via repositório', async () => {
      const data = {
        date: '2026-12-01',
        start_time: '09:00:00',
        end_time: '10:00:00',
        capacity: 5,
        status: 'OPEN' as const,
      };
      const result = await service.createSlot(data);
      expect(repo.createTimeSlot).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockSlot);
    });
  });

  describe('updateSlot', () => {
    it('deve atualizar slot', async () => {
      await service.updateSlot('slot-1', { capacity: 10 });
      expect(repo.updateTimeSlot).toHaveBeenCalledWith('slot-1', { capacity: 10 });
    });
  });

  describe('closeSlot', () => {
    it('Caso 1: deve fechar o slot alterando apenas o status para CLOSED no banco, sem chamar Google Calendar', async () => {
      vi.mocked(repo.closeTimeSlot).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });

      const result = await service.closeSlot('slot-1');
      expect(mockGoogleCalendar.deleteEvent).not.toHaveBeenCalled();
      expect(repo.closeTimeSlot).toHaveBeenCalledWith('slot-1');
      expect(result.status).toBe('CLOSED');
    });
  });

  describe('updateSlot / Reabrir Slot', () => {
    it('Caso 2: deve reabrir o slot alterando o status de volta para OPEN', async () => {
      await service.updateSlot('slot-1', { status: 'OPEN' });
      expect(repo.updateTimeSlot).toHaveBeenCalledWith('slot-1', { status: 'OPEN' });
    });
  });

  describe('deleteSlot', () => {
    it('Caso 1: deve excluir apenas do Dashboard quando deleteCalendarEvents = false (evento continua existindo no Google)', async () => {
      vi.mocked(repo.findTimeSlotById).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });
      vi.mocked(mockSessionRepo.findSessionsByTimeSlot).mockResolvedValue([
        {
          id: 'session-1',
          time_slot_id: 'slot-1',
          organizer_email: 'host@test.com',
          capacity: 5,
          current_participants: 0,
          calendar_event_id: 'cal-event-1',
          meet_url: null,
          title: 'Entrevista em Grupo',
          created_at: '',
          updated_at: '',
          status: 'AVAILABLE',
        },
      ]);

      await service.deleteSlot('slot-1', false);
      expect(mockGoogleCalendar.deleteEvent).not.toHaveBeenCalled();
      expect(repo.deleteTimeSlot).toHaveBeenCalledWith('slot-1');
    });

    it('Caso 2: deve excluir Dashboard + Google Calendar quando deleteCalendarEvents = true', async () => {
      vi.mocked(repo.findTimeSlotById).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });
      vi.mocked(mockSessionRepo.findSessionsByTimeSlot).mockResolvedValue([
        {
          id: 'session-1',
          time_slot_id: 'slot-1',
          organizer_email: 'host@test.com',
          capacity: 5,
          current_participants: 0,
          calendar_event_id: 'cal-event-1',
          meet_url: null,
          title: 'Entrevista em Grupo',
          created_at: '',
          updated_at: '',
          status: 'AVAILABLE',
        },
      ]);

      await service.deleteSlot('slot-1', true);
      expect(mockGoogleCalendar.deleteEvent).toHaveBeenCalledWith('cal-event-1');
      expect(repo.deleteTimeSlot).toHaveBeenCalledWith('slot-1');
    });

    it('Caso 3: deve lançar erro amigável e manter banco de dados íntegro quando a exclusão do Calendar falhar', async () => {
      vi.mocked(repo.findTimeSlotById).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });
      vi.mocked(mockSessionRepo.findSessionsByTimeSlot).mockResolvedValue([
        {
          id: 'session-1',
          time_slot_id: 'slot-1',
          organizer_email: 'host@test.com',
          capacity: 5,
          current_participants: 0,
          calendar_event_id: 'cal-event-1',
          meet_url: null,
          title: 'Entrevista em Grupo',
          created_at: '',
          updated_at: '',
          status: 'AVAILABLE',
        },
      ]);
      vi.mocked(mockGoogleCalendar.deleteEvent).mockRejectedValue(new Error('Google API Error'));

      await expect(service.deleteSlot('slot-1', true)).rejects.toThrow(
        'Não foi possível excluir o evento do Google Calendar. Nenhuma alteração foi realizada.',
      );
      expect(repo.deleteTimeSlot).not.toHaveBeenCalled();
    });

    it('Caso 4: deve continuar fluxo de exclusão normalmente se slot não possuir calendar_event_id', async () => {
      vi.mocked(repo.findTimeSlotById).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });
      vi.mocked(mockSessionRepo.findSessionsByTimeSlot).mockResolvedValue([
        {
          id: 'session-1',
          time_slot_id: 'slot-1',
          organizer_email: 'host@test.com',
          capacity: 5,
          current_participants: 0,
          calendar_event_id: null,
          meet_url: null,
          title: 'Entrevista em Grupo',
          created_at: '',
          updated_at: '',
          status: 'AVAILABLE',
        },
      ]);

      await service.deleteSlot('slot-1', true);
      expect(mockGoogleCalendar.deleteEvent).not.toHaveBeenCalled();
      expect(repo.deleteTimeSlot).toHaveBeenCalledWith('slot-1');
    });
  });
});

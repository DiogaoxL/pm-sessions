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
    it('deve fechar o slot, remover do Google Calendar e rodar closeTimeSlotAtomic', async () => {
      vi.mocked(mockSessionRepo.findSessionsByTimeSlot).mockResolvedValue([
        {
          id: 'session-1',
          time_slot_id: 'slot-1',
          organizer_email: 'host@test.com',
          capacity: 5,
          current_participants: 2,
          calendar_event_id: 'cal-event-1',
          meet_url: null,
          created_at: '',
          updated_at: '',
          status: 'AVAILABLE',
        },
      ]);
      vi.mocked(repo.findTimeSlotById).mockResolvedValue({ ...mockSlot, status: 'CLOSED' });

      const result = await service.closeSlot('slot-1');
      expect(mockGoogleCalendar.deleteEvent).toHaveBeenCalledWith('cal-event-1');
      expect(repo.closeTimeSlotAtomic).toHaveBeenCalledWith('slot-1');
      expect(result.status).toBe('CLOSED');
    });
  });
});

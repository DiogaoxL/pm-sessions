import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AdminTimeSlotService,
  AdminSlotAlreadyHasParticipantsError,
} from '@/features/admin/services/admin-time-slot.service';
import { ITimeSlotRepository, TimeSlot } from '@/features/scheduling/repositories/interfaces';

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
    findTimeSlotById: vi.fn(),
    findAllSlots: vi.fn().mockResolvedValue([mockSlot]),
    createTimeSlot: vi.fn().mockResolvedValue(mockSlot),
    updateTimeSlot: vi.fn().mockResolvedValue(mockSlot),
    closeTimeSlot: vi.fn().mockResolvedValue({ ...mockSlot, status: 'CLOSED' }),
    hasActiveParticipants: vi.fn().mockResolvedValue(false),
    ...overrides,
  };
}

describe('AdminTimeSlotService', () => {
  let repo: ITimeSlotRepository;
  let service: AdminTimeSlotService;

  beforeEach(() => {
    repo = makeMockRepo();
    service = new AdminTimeSlotService(repo);
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
    it('deve atualizar slot se não tiver participantes ativos', async () => {
      vi.mocked(repo.hasActiveParticipants).mockResolvedValue(false);
      await service.updateSlot('slot-1', { capacity: 10 });
      expect(repo.updateTimeSlot).toHaveBeenCalledWith('slot-1', { capacity: 10 });
    });

    it('deve lançar AdminSlotAlreadyHasParticipantsError se houver participantes ativos', async () => {
      vi.mocked(repo.hasActiveParticipants).mockResolvedValue(true);
      await expect(service.updateSlot('slot-1', { capacity: 10 })).rejects.toThrow(
        AdminSlotAlreadyHasParticipantsError,
      );
    });
  });

  describe('closeSlot', () => {
    it('deve fechar slot se não tiver participantes ativos', async () => {
      vi.mocked(repo.hasActiveParticipants).mockResolvedValue(false);
      const result = await service.closeSlot('slot-1');
      expect(repo.closeTimeSlot).toHaveBeenCalledWith('slot-1');
      expect(result.status).toBe('CLOSED');
    });

    it('deve lançar AdminSlotAlreadyHasParticipantsError ao tentar fechar slot com participantes', async () => {
      vi.mocked(repo.hasActiveParticipants).mockResolvedValue(true);
      await expect(service.closeSlot('slot-1')).rejects.toThrow(
        AdminSlotAlreadyHasParticipantsError,
      );
    });
  });
});

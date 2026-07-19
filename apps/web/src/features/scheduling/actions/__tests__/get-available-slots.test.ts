import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAvailableSlotsAction } from '../get-available-slots';
import { getSchedulingService } from '../factory';
import { TimeSlot } from '../../repositories/interfaces';
import { SchedulingService } from '../../services/scheduling.service';

vi.mock('../factory', () => ({
  getSchedulingService: vi.fn(),
}));

describe('getAvailableSlotsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar sucesso com a lista de slots quando o serviço responder corretamente', async () => {
    const mockSlots: TimeSlot[] = [
      {
        id: 'slot-1',
        date: '2026-07-20',
        start_time: '10:00:00',
        end_time: '11:00:00',
        capacity: 1,
        status: 'OPEN',
        created_at: '2026-07-20T10:00:00Z',
        updated_at: '2026-07-20T10:00:00Z',
      },
    ];

    const mockSchedulingService = {
      getAvailableSlots: vi.fn().mockResolvedValue(mockSlots),
      reserveSeat: vi.fn(),
      registerParticipant: vi.fn(),
      scheduleSession: vi.fn(),
    };

    vi.mocked(getSchedulingService).mockResolvedValue(
      mockSchedulingService as unknown as SchedulingService,
    );

    const result = await getAvailableSlotsAction();

    expect(result).toEqual({
      success: true,
      data: mockSlots,
    });
    expect(getSchedulingService).toHaveBeenCalledTimes(1);
    expect(mockSchedulingService.getAvailableSlots).toHaveBeenCalledTimes(1);
  });

  it('deve retornar falha com mensagem amigável quando ocorrer uma exceção inesperada', async () => {
    vi.mocked(getSchedulingService).mockRejectedValue(new Error('Database breakdown'));

    const result = await getAvailableSlotsAction();

    expect(result).toEqual({
      success: false,
      error: 'Não foi possível carregar os horários disponíveis. Tente novamente mais tarde.',
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scheduleSessionAction } from '../schedule-session';
import { getSchedulingService } from '../factory';
import { Participant } from '../../repositories/interfaces';
import { SchedulingService } from '../../services/scheduling.service';

vi.mock('../factory', () => ({
  getSchedulingService: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('scheduleSessionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar agendamento com sucesso quando os dados forem válidos', async () => {
    const mockParticipant: Participant = {
      id: 'part-1',
      session_id: 'session-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      status: 'CONFIRMED',
      allocated_at: '2026-07-20T10:00:00Z',
      created_at: '2026-07-20T10:00:00Z',
      updated_at: '2026-07-20T10:00:00Z',
    };

    const mockSchedulingService = {
      getAvailableSlots: vi.fn(),
      registerParticipant: vi.fn(),
      scheduleSession: vi.fn().mockResolvedValue(mockParticipant),
    };

    vi.mocked(getSchedulingService).mockResolvedValue(
      mockSchedulingService as unknown as SchedulingService,
    );

    const validPayload = {
      email: 'john@example.com',
      name: 'John Doe',
      sessionId: 'session-1',
      timeSlotId: 'slot-1',
      phone: '123456789',
    };

    const result = await scheduleSessionAction(validPayload);

    expect(result).toEqual({
      success: true,
      data: mockParticipant,
    });
    expect(mockSchedulingService.scheduleSession).toHaveBeenCalledWith(
      'john@example.com',
      'John Doe',
      'session-1',
      'slot-1',
      '123456789',
    );
  });

  it('deve retornar falha de validação Zod quando o payload for inválido', async () => {
    const invalidPayload = {
      email: 'invalid-email',
      name: 'J', // less than 2 chars
      sessionId: '', // empty
      timeSlotId: '', // empty
    };

    const result = await scheduleSessionAction(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Dados inválidos');
      expect(result.validationErrors).toBeDefined();
      expect(result.validationErrors?.fieldErrors.email).toContain('E-mail inválido');
      expect(result.validationErrors?.fieldErrors.name).toContain(
        'Nome deve ter pelo menos 2 caracteres',
      );
      expect(result.validationErrors?.fieldErrors.sessionId).toContain('Session ID é obrigatório');
      expect(result.validationErrors?.fieldErrors.timeSlotId).toContain(
        'Time Slot ID é obrigatório',
      );
    }
  });

  it('deve tratar erro de falta de vagas amigavelmente', async () => {
    const mockSchedulingService = {
      getAvailableSlots: vi.fn(),
      registerParticipant: vi.fn(),
      scheduleSession: vi.fn().mockRejectedValue(new Error('No seats available for this session')),
    };

    vi.mocked(getSchedulingService).mockResolvedValue(
      mockSchedulingService as unknown as SchedulingService,
    );

    const validPayload = {
      email: 'john@example.com',
      name: 'John Doe',
      sessionId: 'session-1',
      timeSlotId: 'slot-1',
    };

    const result = await scheduleSessionAction(validPayload);

    expect(result).toEqual({
      success: false,
      error: 'SESSION_FULL',
    });
  });

  it('deve tratar erro de participante duplicado amigavelmente', async () => {
    const mockSchedulingService = {
      getAvailableSlots: vi.fn(),
      registerParticipant: vi.fn(),
      scheduleSession: vi
        .fn()
        .mockRejectedValue(new Error('Duplicated participant registration for this time slot')),
    };

    vi.mocked(getSchedulingService).mockResolvedValue(
      mockSchedulingService as unknown as SchedulingService,
    );

    const validPayload = {
      email: 'john@example.com',
      name: 'John Doe',
      sessionId: 'session-1',
      timeSlotId: 'slot-1',
    };

    const result = await scheduleSessionAction(validPayload);

    expect(result).toEqual({
      success: false,
      error: 'Este e-mail já está inscrito nesta sessão.',
    });
  });

  it('deve mascarar erros técnicos genéricos/inesperados', async () => {
    const mockSchedulingService = {
      getAvailableSlots: vi.fn(),
      registerParticipant: vi.fn(),
      scheduleSession: vi
        .fn()
        .mockRejectedValue(new Error('Database unique constraint or timeout')),
    };

    vi.mocked(getSchedulingService).mockResolvedValue(
      mockSchedulingService as unknown as SchedulingService,
    );

    const validPayload = {
      email: 'john@example.com',
      name: 'John Doe',
      sessionId: 'session-1',
      timeSlotId: 'slot-1',
    };

    const result = await scheduleSessionAction(validPayload);

    expect(result).toEqual({
      success: false,
      error: 'Ocorreu um erro ao processar o seu agendamento. Tente novamente mais tarde.',
    });
  });
});

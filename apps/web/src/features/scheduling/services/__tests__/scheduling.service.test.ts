import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulingService } from '../scheduling.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  TimeSlot,
  Participant,
} from '../../repositories/interfaces';

describe('SchedulingService - Camada de Serviços', () => {
  let mockTimeSlotRepository: ITimeSlotRepository;
  let mockSessionRepository: ISessionRepository;
  let mockParticipantRepository: IParticipantRepository;
  let service: SchedulingService;

  beforeEach(() => {
    mockTimeSlotRepository = {
      selectAvailableSlots: vi.fn(),
    };
    mockSessionRepository = {
      findOpenSessionsByTimeSlot: vi.fn(),
      tryReserveSeat: vi.fn(),
      decrementParticipants: vi.fn(),
    };
    mockParticipantRepository = {
      existsConfirmedParticipant: vi.fn(),
      insertParticipant: vi.fn(),
    };

    service = new SchedulingService(
      mockTimeSlotRepository,
      mockSessionRepository,
      mockParticipantRepository,
    );
  });

  describe('getAvailableSlots', () => {
    it('deve delegar a consulta de slots disponíveis para o timeSlotRepository', async () => {
      const mockSlots: TimeSlot[] = [
        {
          id: 'slot-1',
          date: '2026-07-20',
          start_time: '09:00:00',
          end_time: '10:00:00',
          status: 'OPEN',
          capacity: 1,
          created_at: '',
          updated_at: '',
        },
      ];
      vi.mocked(mockTimeSlotRepository.selectAvailableSlots).mockResolvedValue(mockSlots);

      const result = await service.getAvailableSlots();

      expect(mockTimeSlotRepository.selectAvailableSlots).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSlots);
    });
  });

  describe('reserveSeat', () => {
    it('deve delegar a reserva de assento para o sessionRepository', async () => {
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);

      const result = await service.reserveSeat('session-1');

      expect(mockSessionRepository.tryReserveSeat).toHaveBeenCalledWith('session-1');
      expect(result).toBe(true);
    });
  });

  describe('scheduleSession', () => {
    const email = 'candidate@test.com';
    const name = 'Candidate Name';
    const sessionId = 'session-1';
    const timeSlotId = 'slot-1';

    it('deve agendar sessão com sucesso no fluxo feliz (reserva assento e cadastra participante sem rollback)', async () => {
      const mockParticipant: Participant = {
        id: 'part-1',
        name,
        email,
        session_id: sessionId,
        status: 'CONFIRMED',
        phone: null,
        allocated_at: '',
        created_at: '',
        updated_at: '',
      };

      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);
      vi.mocked(mockParticipantRepository.existsConfirmedParticipant).mockResolvedValue(false);
      vi.mocked(mockParticipantRepository.insertParticipant).mockResolvedValue(mockParticipant);

      const result = await service.scheduleSession(email, name, sessionId, timeSlotId);

      expect(mockSessionRepository.tryReserveSeat).toHaveBeenCalledWith(sessionId);
      expect(mockParticipantRepository.existsConfirmedParticipant).toHaveBeenCalledWith(
        email,
        timeSlotId,
      );
      expect(mockParticipantRepository.insertParticipant).toHaveBeenCalledWith({
        email,
        name,
        session_id: sessionId,
        status: 'CONFIRMED',
      });
      expect(mockSessionRepository.decrementParticipants).not.toHaveBeenCalled();
      expect(result).toEqual(mockParticipant);
    });

    it('deve lançar erro se a sessão não tiver vagas disponíveis, sem cadastrar ou executar rollback', async () => {
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(false);

      await expect(service.scheduleSession(email, name, sessionId, timeSlotId)).rejects.toThrow(
        'No seats available for this session',
      );

      expect(mockSessionRepository.tryReserveSeat).toHaveBeenCalledWith(sessionId);
      expect(mockParticipantRepository.existsConfirmedParticipant).not.toHaveBeenCalled();
      expect(mockParticipantRepository.insertParticipant).not.toHaveBeenCalled();
      expect(mockSessionRepository.decrementParticipants).not.toHaveBeenCalled();
    });

    it('deve lançar erro de duplicidade e executar rollback da vaga se participante já possuir cadastro confirmado no slot', async () => {
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);
      vi.mocked(mockParticipantRepository.existsConfirmedParticipant).mockResolvedValue(true);

      await expect(service.scheduleSession(email, name, sessionId, timeSlotId)).rejects.toThrow(
        'Duplicated participant registration for this time slot',
      );

      expect(mockSessionRepository.tryReserveSeat).toHaveBeenCalledWith(sessionId);
      expect(mockParticipantRepository.existsConfirmedParticipant).toHaveBeenCalledWith(
        email,
        timeSlotId,
      );
      expect(mockParticipantRepository.insertParticipant).not.toHaveBeenCalled();

      // Validação explícita do Rollback
      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledWith(sessionId);
    });

    it('deve propagar erro de inserção e executar rollback da vaga se insertParticipant falhar', async () => {
      const dbError = new Error('Database connection failed');
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);
      vi.mocked(mockParticipantRepository.existsConfirmedParticipant).mockResolvedValue(false);
      vi.mocked(mockParticipantRepository.insertParticipant).mockRejectedValue(dbError);

      await expect(service.scheduleSession(email, name, sessionId, timeSlotId)).rejects.toThrow(
        'Database connection failed',
      );

      expect(mockSessionRepository.tryReserveSeat).toHaveBeenCalledWith(sessionId);
      expect(mockParticipantRepository.existsConfirmedParticipant).toHaveBeenCalledWith(
        email,
        timeSlotId,
      );
      expect(mockParticipantRepository.insertParticipant).toHaveBeenCalled();

      // Validação explícita do Rollback
      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledWith(sessionId);
    });
  });
});

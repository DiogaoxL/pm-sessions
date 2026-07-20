import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulingService } from '../scheduling.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  TimeSlot,
  Participant,
  Session,
} from '../../repositories/interfaces';
import { IGoogleCalendarService } from '../google-calendar.service';

describe('SchedulingService - Camada de Serviços', () => {
  let mockTimeSlotRepository: ITimeSlotRepository;
  let mockSessionRepository: ISessionRepository;
  let mockParticipantRepository: IParticipantRepository;
  let mockGoogleCalendarService: IGoogleCalendarService;
  let service: SchedulingService;

  beforeEach(() => {
    mockTimeSlotRepository = {
      selectAvailableSlots: vi.fn(),
      findTimeSlotById: vi.fn(),
    };
    mockSessionRepository = {
      findOpenSessionsByTimeSlot: vi.fn(),
      tryReserveSeat: vi.fn(),
      decrementParticipants: vi.fn(),
      updateSessionCalendar: vi.fn(),
      findSessionById: vi.fn(),
    };
    mockParticipantRepository = {
      existsConfirmedParticipant: vi.fn(),
      insertParticipant: vi.fn(),
      getParticipantsBySession: vi.fn(),
      findParticipantById: vi.fn(),
      updateParticipantStatus: vi.fn(),
      deleteParticipant: vi.fn(),
    };
    mockGoogleCalendarService = {
      checkAvailability: vi.fn(),
      filterFreeSlots: vi.fn().mockImplementation((dateStr, slots) => Promise.resolve(slots)),
      createEvent: vi.fn().mockResolvedValue({
        eventId: 'google-event-id',
        meetUrl: 'https://meet.google.com/test',
      }),
      syncAttendees: vi.fn(),
    };

    service = new SchedulingService(
      mockTimeSlotRepository,
      mockSessionRepository,
      mockParticipantRepository,
      mockGoogleCalendarService,
    );
  });

  describe('getAvailableSlots', () => {
    it('deve delegar a consulta de slots disponíveis para o timeSlotRepository e filtrar pelo Google Calendar', async () => {
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
      expect(mockGoogleCalendarService.filterFreeSlots).toHaveBeenCalledWith(
        '2026-07-20',
        mockSlots,
      );
      expect(result).toEqual(mockSlots);
    });

    it('deve usar fallback dos slots do banco de dados quando o Google Calendar falhar', async () => {
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
      vi.mocked(mockGoogleCalendarService.filterFreeSlots).mockRejectedValue(
        new Error('Google API Error'),
      );

      const result = await service.getAvailableSlots();

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

    const mockSlot: TimeSlot = {
      id: timeSlotId,
      date: '2026-07-20',
      start_time: '09:00:00',
      end_time: '10:00:00',
      status: 'OPEN',
      capacity: 1,
      created_at: '',
      updated_at: '',
    };

    const mockSession: Session = {
      id: sessionId,
      time_slot_id: timeSlotId,
      organizer_email: 'organizer@test.com',
      calendar_event_id: null,
      meet_url: null,
      capacity: 1,
      current_participants: 0,
      status: 'AVAILABLE',
      created_at: '',
      updated_at: '',
    };

    beforeEach(() => {
      vi.mocked(mockTimeSlotRepository.findTimeSlotById).mockResolvedValue(mockSlot);
      vi.mocked(mockSessionRepository.findOpenSessionsByTimeSlot).mockResolvedValue([mockSession]);
      vi.mocked(mockParticipantRepository.getParticipantsBySession).mockResolvedValue([]);
    });

    it('deve agendar sessão com sucesso no fluxo feliz (reserva assento, cadastra participante, cria evento e sync attendees)', async () => {
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
      expect(mockGoogleCalendarService.createEvent).toHaveBeenCalled();
      expect(mockSessionRepository.updateSessionCalendar).toHaveBeenCalledWith(
        sessionId,
        'google-event-id',
        'https://meet.google.com/test',
      );
      expect(mockGoogleCalendarService.syncAttendees).toHaveBeenCalledWith('google-event-id', [
        email,
      ]);
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

    it('deve pular a criacao do evento e fazer apenas o patch se o calendarEventId ja existir na sessao (idempotência)', async () => {
      const mockSessionWithEvent: Session = {
        ...mockSession,
        calendar_event_id: 'existing-event-id',
        meet_url: 'https://meet.google.com/existing',
      };
      vi.mocked(mockSessionRepository.findOpenSessionsByTimeSlot).mockResolvedValue([
        mockSessionWithEvent,
      ]);
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);
      vi.mocked(mockParticipantRepository.existsConfirmedParticipant).mockResolvedValue(false);

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
      vi.mocked(mockParticipantRepository.insertParticipant).mockResolvedValue(mockParticipant);

      await service.scheduleSession(email, name, sessionId, timeSlotId);

      expect(mockGoogleCalendarService.createEvent).not.toHaveBeenCalled();
      expect(mockGoogleCalendarService.syncAttendees).toHaveBeenCalledWith('existing-event-id', [
        email,
      ]);
    });

    it('deve executar rollback completo deletando o participante e decrementando a sessao se a criacao de evento no Google Calendar falhar', async () => {
      vi.mocked(mockSessionRepository.tryReserveSeat).mockResolvedValue(true);
      vi.mocked(mockParticipantRepository.existsConfirmedParticipant).mockResolvedValue(false);

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
      vi.mocked(mockParticipantRepository.insertParticipant).mockResolvedValue(mockParticipant);
      vi.mocked(mockGoogleCalendarService.createEvent).mockRejectedValue(
        new Error('Google API Error'),
      );

      await expect(service.scheduleSession(email, name, sessionId, timeSlotId)).rejects.toThrow(
        'Google API Error',
      );

      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledWith(sessionId);
      expect(mockParticipantRepository.deleteParticipant).toHaveBeenCalledWith('part-1');
    });
  });

  describe('cancelSession', () => {
    const participantId = 'part-1';
    const sessionId = 'session-1';
    const mockParticipant: Participant = {
      id: participantId,
      name: 'Participant Name',
      email: 'attendee@test.com',
      session_id: sessionId,
      status: 'CONFIRMED',
      phone: null,
      allocated_at: '',
      created_at: '',
      updated_at: '',
    };

    it('deve cancelar o participante, decrementar participantes na sessao e sincronizar attendees remanescentes no Google Calendar', async () => {
      vi.mocked(mockParticipantRepository.findParticipantById).mockResolvedValue(mockParticipant);
      vi.mocked(mockSessionRepository.findSessionById).mockResolvedValue({
        id: sessionId,
        time_slot_id: 'slot-1',
        organizer_email: 'organizer@test.com',
        calendar_event_id: 'google-event-id',
        meet_url: 'https://meet.google.com/test',
        capacity: 1,
        current_participants: 1,
        status: 'AVAILABLE',
        created_at: '',
        updated_at: '',
      });
      vi.mocked(mockParticipantRepository.getParticipantsBySession).mockResolvedValue([]);

      await service.cancelSession(participantId);

      expect(mockParticipantRepository.updateParticipantStatus).toHaveBeenCalledWith(
        participantId,
        'CANCELLED',
      );
      expect(mockSessionRepository.decrementParticipants).toHaveBeenCalledWith(sessionId);
      expect(mockGoogleCalendarService.syncAttendees).toHaveBeenCalledWith('google-event-id', []);
    });
  });
});

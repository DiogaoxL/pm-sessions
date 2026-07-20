import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulingService } from '../scheduling.service';
import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  TimeSlot,
  Participant,
} from '../../repositories/interfaces';
import { IGoogleCalendarService } from '../google-calendar.service';
import { IHostAllocatorService } from '../host-allocator.service';

describe('SchedulingService - Camada de Serviços', () => {
  let mockTimeSlotRepository: ITimeSlotRepository;
  let mockSessionRepository: ISessionRepository;
  let mockParticipantRepository: IParticipantRepository;
  let mockGoogleCalendarService: IGoogleCalendarService;
  let mockHostAllocatorService: IHostAllocatorService;
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
      findSessionsByTimeSlot: vi.fn(),
      allocateParticipant: vi.fn(),
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
    mockHostAllocatorService = {
      getNextHostEmail: vi.fn().mockResolvedValue('host@test.com'),
    };

    service = new SchedulingService(
      mockTimeSlotRepository,
      mockSessionRepository,
      mockParticipantRepository,
      mockGoogleCalendarService,
      mockHostAllocatorService,
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

    beforeEach(() => {
      vi.mocked(mockTimeSlotRepository.findTimeSlotById).mockResolvedValue(mockSlot);
      vi.mocked(mockParticipantRepository.getParticipantsBySession).mockResolvedValue([]);
    });

    it('deve agendar sessão com sucesso no fluxo feliz (aloca via RPC, cria evento no Google Calendar e sync)', async () => {
      vi.mocked(mockSessionRepository.allocateParticipant).mockResolvedValue({
        participant_id: 'part-1',
        session_id: sessionId,
        is_new_session: true,
        organizer_email: 'organizer@test.com',
        calendar_event_id: null,
        meet_url: null,
      });

      const result = await service.scheduleSession(email, name, sessionId, timeSlotId);

      expect(mockSessionRepository.allocateParticipant).toHaveBeenCalledWith(
        timeSlotId,
        email,
        name,
        null,
        'host@test.com',
      );
      expect(mockGoogleCalendarService.createEvent).toHaveBeenCalled();
      expect(mockSessionRepository.updateSessionCalendar).toHaveBeenCalledWith(
        sessionId,
        'google-event-id',
        'https://meet.google.com/test',
      );
      expect(mockGoogleCalendarService.syncAttendees).toHaveBeenCalledWith('google-event-id', [
        email,
      ]);
      expect(result.id).toBe('part-1');
    });

    it('deve propagar erro se a alocacao falhar (ex.: sem vagas ou erro de banco)', async () => {
      const dbError = new Error('No seats available for this session');
      vi.mocked(mockSessionRepository.allocateParticipant).mockRejectedValue(dbError);

      await expect(service.scheduleSession(email, name, sessionId, timeSlotId)).rejects.toThrow(
        'No seats available for this session',
      );

      expect(mockGoogleCalendarService.createEvent).not.toHaveBeenCalled();
    });

    it('deve pular a criacao do evento e fazer apenas o patch se o calendarEventId ja existir na sessao (idempotência)', async () => {
      vi.mocked(mockSessionRepository.allocateParticipant).mockResolvedValue({
        participant_id: 'part-1',
        session_id: sessionId,
        is_new_session: false,
        organizer_email: 'organizer@test.com',
        calendar_event_id: 'existing-event-id',
        meet_url: 'https://meet.google.com/existing',
      });

      await service.scheduleSession(email, name, sessionId, timeSlotId);

      expect(mockGoogleCalendarService.createEvent).not.toHaveBeenCalled();
      expect(mockGoogleCalendarService.syncAttendees).toHaveBeenCalledWith('existing-event-id', [
        email,
      ]);
    });

    it('deve simular concorrencia com aproximadamente 20-30 chamadas simultaneas e validar integridade', async () => {
      vi.mocked(mockSessionRepository.allocateParticipant).mockResolvedValue({
        participant_id: 'part-1',
        session_id: sessionId,
        is_new_session: false,
        organizer_email: 'organizer@test.com',
        calendar_event_id: 'existing-event-id',
        meet_url: 'https://meet.google.com/existing',
      });

      const promises = Array.from({ length: 25 }).map(() =>
        service.scheduleSession(email, name, sessionId, timeSlotId),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(25);
      expect(mockSessionRepository.allocateParticipant).toHaveBeenCalledTimes(25);
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimeSlotRepository } from '../time-slot.repository';
import { SessionRepository } from '../session.repository';
import { ParticipantRepository } from '../participant.repository';

// Construtor auxiliar fluent para queries do Supabase
class MockQueryBuilder {
  constructor(private result: any) {}
  select = vi.fn().mockReturnValue(this);
  eq = vi.fn().mockReturnValue(this);
  or = vi.fn().mockReturnValue(this);
  order = vi.fn().mockReturnValue(this);
  update = vi.fn().mockReturnValue(this);
  insert = vi.fn().mockReturnValue(this);
  single = vi.fn().mockImplementation(() => Promise.resolve(this.result));

  then(onfulfilled?: (value: any) => any) {
    const promise = Promise.resolve(this.result);
    return onfulfilled ? promise.then(onfulfilled) : promise;
  }
}

describe('Persistência - Repositórios de Scheduling', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };
  });

  describe('TimeSlotRepository', () => {
    it('deve retornar apenas slots futuros OPEN ordenados por data e hora crescentes (DR-008)', async () => {
      const mockSlots = [
        {
          id: '1',
          date: '2026-07-20',
          start_time: '09:00:00',
          end_time: '10:00:00',
          status: 'OPEN',
        },
        {
          id: '2',
          date: '2026-07-20',
          start_time: '10:00:00',
          end_time: '11:00:00',
          status: 'OPEN',
        },
      ];

      const builder = new MockQueryBuilder({ data: mockSlots, error: null });
      mockSupabase.from.mockReturnValue(builder);

      const repository = new TimeSlotRepository(mockSupabase);
      const result = await repository.selectAvailableSlots();

      expect(mockSupabase.from).toHaveBeenCalledWith('time_slots');
      expect(builder.eq).toHaveBeenCalledWith('status', 'OPEN');
      expect(builder.or).toHaveBeenCalled();
      expect(builder.order).toHaveBeenCalledWith('date', { ascending: true });
      expect(result).toEqual(mockSlots);
    });

    it('deve propagar erro de banco de dados caso ocorra falha na consulta de slots', async () => {
      const mockError = { message: 'Database error' };
      const builder = new MockQueryBuilder({ data: null, error: mockError });
      mockSupabase.from.mockReturnValue(builder);

      const repository = new TimeSlotRepository(mockSupabase);
      await expect(repository.selectAvailableSlots()).rejects.toEqual(mockError);
    });
  });

  describe('SessionRepository', () => {
    describe('findOpenSessionsByTimeSlot', () => {
      it('deve retornar apenas sessões AVAILABLE filtradas por time_slot_id', async () => {
        const mockSessions = [
          {
            id: 'session-1',
            time_slot_id: 'slot-1',
            status: 'AVAILABLE',
            current_participants: 0,
            capacity: 1,
          },
        ];

        const builder = new MockQueryBuilder({ data: mockSessions, error: null });
        mockSupabase.from.mockReturnValue(builder);

        const repository = new SessionRepository(mockSupabase);
        const result = await repository.findOpenSessionsByTimeSlot('slot-1');

        expect(mockSupabase.from).toHaveBeenCalledWith('sessions');
        expect(builder.eq).toHaveBeenCalledWith('time_slot_id', 'slot-1');
        expect(builder.eq).toHaveBeenCalledWith('status', 'AVAILABLE');
        expect(result).toEqual(mockSessions);
      });
    });

    describe('tryReserveSeat (Optimistic Locking)', () => {
      it('deve reservar vaga com sucesso quando há vagas e não há alteração concorrente', async () => {
        const sessionData = { id: 'session-1', current_participants: 0, capacity: 1 };

        const fetchBuilder = new MockQueryBuilder({ data: sessionData, error: null });
        const updateBuilder = new MockQueryBuilder({
          data: [{ ...sessionData, current_participants: 1, status: 'FULL' }],
          error: null,
        });

        // Mock das chamadas sequenciais do from()
        mockSupabase.from.mockReturnValueOnce(fetchBuilder).mockReturnValueOnce(updateBuilder);

        const repository = new SessionRepository(mockSupabase);
        const success = await repository.tryReserveSeat('session-1');

        expect(success).toBe(true);
        expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'sessions');
        expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'sessions');
        expect(updateBuilder.update).toHaveBeenCalledWith({
          current_participants: 1,
          status: 'FULL',
        });
        expect(updateBuilder.eq).toHaveBeenLastCalledWith('current_participants', 0);
      });

      it('deve falhar e retornar false se a sessão já estiver em sua capacidade máxima', async () => {
        const sessionData = { id: 'session-1', current_participants: 1, capacity: 1 };
        const fetchBuilder = new MockQueryBuilder({ data: sessionData, error: null });
        mockSupabase.from.mockReturnValueOnce(fetchBuilder);

        const repository = new SessionRepository(mockSupabase);
        const success = await repository.tryReserveSeat('session-1');

        expect(success).toBe(false);
      });

      it('deve retornar false se ocorrer concorrência (conflito de versão no optimistic check)', async () => {
        const sessionData = { id: 'session-1', current_participants: 0, capacity: 2 };
        const fetchBuilder = new MockQueryBuilder({ data: sessionData, error: null });
        const updateBuilder = new MockQueryBuilder({ data: [], error: null });

        mockSupabase.from.mockReturnValueOnce(fetchBuilder).mockReturnValueOnce(updateBuilder);

        const repository = new SessionRepository(mockSupabase);
        const success = await repository.tryReserveSeat('session-1');

        expect(success).toBe(false);
      });
    });

    describe('decrementParticipants (Rollback)', () => {
      it('deve decrementar o participante e restaurar status para AVAILABLE', async () => {
        const sessionData = { id: 'session-1', current_participants: 1 };
        const fetchBuilder = new MockQueryBuilder({ data: sessionData, error: null });
        const updateBuilder = new MockQueryBuilder({ data: null, error: null });

        mockSupabase.from.mockReturnValueOnce(fetchBuilder).mockReturnValueOnce(updateBuilder);

        const repository = new SessionRepository(mockSupabase);
        await repository.decrementParticipants('session-1');

        expect(updateBuilder.update).toHaveBeenCalledWith({
          current_participants: 0,
          status: 'AVAILABLE',
        });
      });

      it('nunca deve decrementar para valor abaixo de zero', async () => {
        const sessionData = { id: 'session-1', current_participants: 0 };
        const fetchBuilder = new MockQueryBuilder({ data: sessionData, error: null });
        const updateBuilder = new MockQueryBuilder({ data: null, error: null });

        mockSupabase.from.mockReturnValueOnce(fetchBuilder).mockReturnValueOnce(updateBuilder);

        const repository = new SessionRepository(mockSupabase);
        await repository.decrementParticipants('session-1');

        expect(updateBuilder.update).toHaveBeenCalledWith({
          current_participants: 0,
          status: 'AVAILABLE',
        });
      });
    });
  });

  describe('ParticipantRepository', () => {
    describe('existsConfirmedParticipant', () => {
      it('deve retornar true se participante confirmado existir no mesmo TimeSlot', async () => {
        const builder = new MockQueryBuilder({ data: [{ id: 'part-1' }], error: null });
        mockSupabase.from.mockReturnValue(builder);

        const repository = new ParticipantRepository(mockSupabase);
        const result = await repository.existsConfirmedParticipant('test@email.com', 'slot-1');

        expect(mockSupabase.from).toHaveBeenCalledWith('participants');
        expect(builder.select).toHaveBeenCalledWith('id, sessions!inner(time_slot_id)');
        expect(builder.eq).toHaveBeenCalledWith('email', 'test@email.com');
        expect(builder.eq).toHaveBeenCalledWith('status', 'CONFIRMED');
        expect(result).toBe(true);
      });

      it('deve retornar false se nenhum participante confirmado correspondente for retornado', async () => {
        const builder = new MockQueryBuilder({ data: [], error: null });
        mockSupabase.from.mockReturnValue(builder);

        const repository = new ParticipantRepository(mockSupabase);
        const result = await repository.existsConfirmedParticipant('test@email.com', 'slot-1');

        expect(result).toBe(false);
      });
    });

    describe('insertParticipant', () => {
      it('deve inserir o participante corretamente e retornar o registro criado', async () => {
        const insertData = { name: 'John Doe', email: 'john@email.com', session_id: 'session-1' };
        const createdRecord = { id: 'part-1', ...insertData, status: 'CONFIRMED' };

        const builder = new MockQueryBuilder({ data: createdRecord, error: null });
        mockSupabase.from.mockReturnValue(builder);

        const repository = new ParticipantRepository(mockSupabase);
        const result = await repository.insertParticipant(insertData);

        expect(mockSupabase.from).toHaveBeenCalledWith('participants');
        expect(builder.insert).toHaveBeenCalledWith(insertData);
        expect(result).toEqual(createdRecord);
      });
    });
  });
});

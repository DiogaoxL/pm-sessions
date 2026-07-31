import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { ITimeSlotRepository, TimeSlot, TimeSlotInsert, TimeSlotUpdate } from './interfaces';

export class TimeSlotRepository implements ITimeSlotRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Busca slots de data futura com status 'OPEN', ordenados por data e horário de início crescentes.
   * Respeita a regra DR-008 considerando o timezone 'America/Sao_Paulo'.
   */
  async selectAvailableSlots(): Promise<TimeSlot[]> {
    const now = new Date();

    // Obtém a data atual no timezone de Brasília (formato YYYY-MM-DD)
    const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const currentDate = dateFormatter.format(now);

    // Obtém o horário atual no timezone de Brasília (formato HH:mm:ss)
    const timeFormatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const currentTime = timeFormatter.format(now);

    // Constrói a consulta respeitando a regra:
    // status = 'OPEN' AND (date > currentDate OR (date = currentDate AND start_time > currentTime))
    const { data, error } = await this.supabase
      .from('time_slots')
      .select('*')
      .eq('status', 'OPEN')
      .or(`date.gt.${currentDate},and(date.eq.${currentDate},start_time.gt.${currentTime})`)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    console.log('[PUBLIC] Slots encontrados:', data);

    if (error) {
      throw error;
    }

    return data || [];
  }

  async findTimeSlotById(id: string): Promise<TimeSlot | null> {
    const { data, error } = await this.supabase
      .from('time_slots')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * [Admin] Busca todos os time slots, ordenados cronologicamente (sem filtro de status).
   */
  async findAllSlots(): Promise<TimeSlot[]> {
    const { data, error } = await this.supabase
      .from('time_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * [Admin] Cria um novo time slot e retorna o registro criado.
   */
  async createTimeSlot(
    data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<TimeSlot> {
    const { data: created, error } = await this.supabase
      .from('time_slots')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return created;
  }

  /**
   * [Admin] Atualiza campos de um time slot existente e retorna o registro atualizado.
   */
  async updateTimeSlot(id: string, data: TimeSlotUpdate): Promise<TimeSlot> {
    const { data: updated, error } = await this.supabase
      .from('time_slots')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updated;
  }

  /**
   * [Admin] Fecha o time slot (status = 'CLOSED') e retorna o registro atualizado.
   */
  async closeTimeSlot(id: string): Promise<TimeSlot> {
    return this.updateTimeSlot(id, { status: 'CLOSED' });
  }

  async closeTimeSlotAtomic(id: string): Promise<void> {
    const { error } = await (
      this.supabase.rpc as unknown as (
        name: string,
        args: Record<string, unknown>,
      ) => PromiseLike<{ error: { message: string; code?: string } | null }>
    )('close_time_slot_manual', {
      p_time_slot_id: id,
    });

    if (error) {
      throw error;
    }
  }

  /**
   * [Admin] Remove o time slot permanentemente do banco de dados.
   */
  async deleteTimeSlot(id: string): Promise<void> {
    const { error } = await this.supabase.from('time_slots').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  /**
   * [Admin] Verifica se o slot possui ao menos um participante CONFIRMED em qualquer de suas sessões.
   */
  async hasActiveParticipants(id: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from('participants')
      .select('id, sessions!inner(time_slot_id)', { count: 'exact', head: true })
      .eq('sessions.time_slot_id', id)
      .eq('status', 'CONFIRMED');

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }
}

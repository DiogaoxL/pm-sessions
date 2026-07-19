import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { ITimeSlotRepository, TimeSlot } from './interfaces';

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

    if (error) {
      throw error;
    }

    return data || [];
  }
}

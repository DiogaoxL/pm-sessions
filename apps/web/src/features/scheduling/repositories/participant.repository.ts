import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { IParticipantRepository, Participant, ParticipantInsert } from './interfaces';

export class ParticipantRepository implements IParticipantRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Valida se o email fornecido já possui inscrição ativa (CONFIRMED) no mesmo TimeSlot.
   * Executa uma query de junção interna (inner join) com a tabela de sessões.
   */
  async existsConfirmedParticipant(email: string, timeSlotId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('participants')
      .select('id, sessions!inner(time_slot_id)')
      .eq('email', email)
      .eq('status', 'CONFIRMED')
      .eq('sessions.time_slot_id', timeSlotId);

    if (error) {
      throw error;
    }

    return !!data && data.length > 0;
  }

  /**
   * Insere o registro de participante no banco e retorna o registro criado.
   */
  async insertParticipant(participant: ParticipantInsert): Promise<Participant> {
    const { data, error } = await this.supabase
      .from('participants')
      .insert(participant)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

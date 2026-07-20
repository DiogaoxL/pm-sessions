import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';

export interface IHostAllocatorService {
  getNextHostEmail(): Promise<string>;
}

export class HostAllocatorService implements IHostAllocatorService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getNextHostEmail(): Promise<string> {
    const { data: admins, error: adminsError } = await this.supabase
      .from('admins')
      .select('email')
      .order('email', { ascending: true });

    if (adminsError) {
      throw adminsError;
    }

    const hostEmails = admins?.map((a) => a.email) || [];
    if (hostEmails.length === 0) {
      return process.env.DEFAULT_HOST_EMAIL || 'admin@example.com';
    }

    const { count, error: countError } = await this.supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    const nextIndex = (count || 0) % hostEmails.length;
    return hostEmails[nextIndex];
  }
}

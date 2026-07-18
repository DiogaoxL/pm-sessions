import { supabaseAdmin } from '@/shared/lib/supabase/admin';
import type { Database } from '@/shared/types/database';

type Admin = Database['public']['Tables']['admins']['Row'];

export class AdminRepository {
  /**
   * Finds an admin by their email address using the privileged admin client.
   * This is necessary because RLS policies block regular client queries before
   * the auth_user_id mapping is established.
   */
  async findByEmail(email: string): Promise<Admin | null> {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Links an authenticated user's ID to their corresponding admin record.
   * Uses the privileged admin client to bypass RLS restrictions during bootstrap.
   */
  async linkAuthUser(email: string, authUserId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('admins')
      .update({ auth_user_id: authUserId })
      .eq('email', email);

    if (error) {
      throw error;
    }
  }
}

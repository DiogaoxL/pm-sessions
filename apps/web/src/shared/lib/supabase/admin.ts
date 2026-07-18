import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';
import type { Database } from '../../types/database';

if (typeof window !== 'undefined') {
  throw new Error('Supabase Admin Client can only be imported in server environments.');
}

/**
 * Supabase admin client using the service role key.
 * Bypasses Row Level Security (RLS) policies.
 * WARNING: NEVER use this client on the client-side/browser.
 */
export const supabaseAdmin = createClient<Database>(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

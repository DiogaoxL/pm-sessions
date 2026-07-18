import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './config';
import type { Database } from '../../types/database';

/**
 * Supabase client for client-side components.
 * Runs in the browser. Uses the anonymous key.
 */
export const supabaseClient = createBrowserClient<Database>(
  supabaseConfig.url,
  supabaseConfig.anonKey,
);

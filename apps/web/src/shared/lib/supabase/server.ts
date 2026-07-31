import { createServerClient as createSsrClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from './config';
import type { Database } from '../../types/database';

/**
 * Creates a Supabase client for server-side execution.
 * Compatible with Next.js 16 async cookies API.
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSsrClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
        });
      },
    },
  });
}

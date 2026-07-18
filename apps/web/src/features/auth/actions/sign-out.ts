'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/config/routes';

/**
 * Signs the user out from Supabase and redirects them to the login page.
 */
export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect(ROUTES.redirects.afterLogout);
}

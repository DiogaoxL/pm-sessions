'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Initiates the Google OAuth sign-in flow.
 * Redirects the user to Google's consent screen.
 */
export async function signInWithGoogle() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth initiation error:', error.message);
    throw error;
  }

  if (data?.url) {
    redirect(data.url);
  }
}

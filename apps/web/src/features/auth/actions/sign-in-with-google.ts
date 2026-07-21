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
      scopes:
        'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
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

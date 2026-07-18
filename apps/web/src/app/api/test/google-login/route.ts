import { NextResponse } from 'next/server';
import { createServerClient } from '@/shared/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? 'OAuth URL not generated',
      },
      { status: 500 },
    );
  }

  return NextResponse.redirect(new URL(data.url));
}

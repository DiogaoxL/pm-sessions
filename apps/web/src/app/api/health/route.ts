import { NextResponse } from 'next/server';
import { createServerClient } from '@/shared/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerClient();

    // Validate connection by reading from the admins table (checking schema, keys, and connection)
    const { error } = await supabase.from('admins').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          services: {
            supabase: {
              status: 'unhealthy',
              error: error.message,
            },
          },
        },
        { status: 500 },
      );
    }

    const googleConfigured = !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    );

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        supabase: {
          status: 'healthy',
        },
        googleCalendar: {
          status: googleConfigured ? 'healthy' : 'unconfigured',
        },
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      {
        status: 'error',
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

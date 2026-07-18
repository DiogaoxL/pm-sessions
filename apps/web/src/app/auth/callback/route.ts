import { NextResponse } from 'next/server';
import { createServerClient } from '@/shared/lib/supabase/server';
import { AuthService } from '@/features/auth/services/auth-service';
import { ROUTES } from '@/shared/config/routes';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  try {
    if (code) {
      const supabase = await createServerClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw error;
      }

      if (user?.email) {
        const authService = new AuthService();
        const isAuthorized = await authService.validateAndRegisterAdmin(user.email, user.id);

        if (!isAuthorized) {
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}${ROUTES.redirects.unauthorized}`);
        }

        return NextResponse.redirect(`${origin}${ROUTES.redirects.afterLogin}`);
      }
    }

    return NextResponse.redirect(`${origin}${ROUTES.redirects.unauthorized}`);
  } catch (err: unknown) {
    const timestamp = new Date().toISOString();
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(
      `[ERROR] Authentication callback failed\n` +
        `error: ${errorMessage}\n` +
        `timestamp: ${timestamp}`,
    );

    return NextResponse.redirect(`${origin}${ROUTES.redirects.afterLogout}?error=server`);
  }
}

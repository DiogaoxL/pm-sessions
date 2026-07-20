import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from '@/shared/config/routes';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session and validate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = ROUTES.protected.some((route) => pathname.startsWith(route));
  const isAuthRoute = ROUTES.auth.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith('/admin');
  // Prevent redirect loops: the forbidden page is not an admin route guard target
  const isForbiddenPage = pathname === '/';

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.redirects.afterLogout;
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.redirects.afterLogin;
    return NextResponse.redirect(url);
  }

  // Admin route guard: verify the user has the 'admin' role in the admins table.
  // Only applies to /admin/* routes and not to the forbidden landing page to prevent loops.
  if (user && isAdminRoute && !isForbiddenPage) {
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('role')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const isAdmin = adminRecord?.role === 'admin' || adminRecord?.role === 'super_admin';

    if (!isAdmin) {
      console.warn('[middleware] Access denied to admin route', {
        pathname,
        userId: user.id,
        adminRecord,
      });
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '?error=forbidden';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

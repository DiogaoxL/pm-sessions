import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

// Mock routes
vi.mock('@/shared/config/routes', () => ({
  ROUTES: {
    public: ['/api/health'],
    auth: ['/login'],
    protected: ['/admin', '/admin/dashboard'],
    callback: '/auth/callback',
    logout: '/logout',
    redirects: {
      afterLogin: '/admin/dashboard',
      afterLogout: '/login',
      unauthorized: '/login?error=unauthorized',
      forbidden: '/?error=forbidden',
    },
  },
}));

import { createServerClient } from '@supabase/ssr';

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost:3000${pathname}`);
}

function makeMockSupabase(user: object | null, adminRecord: object | null = null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: adminRecord }),
    }),
    cookies: {},
  };
}

describe('middleware — Admin Route Guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para /login quando usuário não está autenticado e acessa rota protegida /admin', async () => {
    const mockSupabase = makeMockSupabase(null);
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/admin');
    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
  });

  it('redireciona para /admin/dashboard quando usuário autenticado acessa rota de auth /login', async () => {
    const user = { id: 'user-1', email: 'admin@test.com' };
    const mockSupabase = makeMockSupabase(user, { role: 'admin' });
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/login');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/admin/dashboard');
  });

  it('permite acesso ao admin quando usuário autenticado tem role admin', async () => {
    const user = { id: 'user-1', email: 'admin@test.com' };
    const mockSupabase = makeMockSupabase(user, { role: 'admin' });
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).not.toBe(307);
  });

  it('permite acesso ao admin quando usuário autenticado tem role super_admin', async () => {
    const user = { id: 'user-1', email: 'superadmin@test.com' };
    const mockSupabase = makeMockSupabase(user, { role: 'super_admin' });
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).not.toBe(307);
  });

  it('redireciona para /?error=forbidden quando usuário autenticado NÃO tem role admin', async () => {
    const user = { id: 'user-2', email: 'candidate@test.com' };
    // adminRecord null = usuário não está na tabela admins
    const mockSupabase = makeMockSupabase(user, null);
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/?error=forbidden');
  });

  it('não entra em loop de redirect ao acessar / com erro forbidden', async () => {
    const user = { id: 'user-2', email: 'candidate@test.com' };
    const mockSupabase = makeMockSupabase(user, null);
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    // / não é rota admin, então não deve verificar role
    const req = makeRequest('/?error=forbidden');
    const res = await middleware(req);

    // Deve passar normalmente sem redirect loop
    expect(res.status).not.toBe(307);
  });

  it('bloqueia role diferente de admin (ex.: moderator)', async () => {
    const user = { id: 'user-3', email: 'mod@test.com' };
    const mockSupabase = makeMockSupabase(user, { role: 'moderator' });
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);

    const req = makeRequest('/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/?error=forbidden');
  });
});

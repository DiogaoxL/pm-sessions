import { createServerClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/features/auth/components/logout-button';

export const metadata = {
  title: 'Dashboard - PM Sessions',
  description: 'Painel administrativo do PM Sessions.',
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch admin profile details from public.admins
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  return (
    <div className="flex flex-col flex-1 bg-neutral-950 text-white min-h-screen">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-[#003870] to-[#33B458] flex items-center justify-center font-bold text-lg tracking-tight text-white">
              P
            </div>
            <span className="font-semibold tracking-tight text-lg">PM Sessions Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-neutral-400">
              Olá, <span className="text-white font-medium">{admin?.name || user.email}</span> (
              {admin?.role || 'Admin'})
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo à Fundação 004!</h1>
          <p className="text-neutral-400 max-w-2xl leading-relaxed">
            A infraestrutura de autenticação via Supabase SSR, cookies, Google OAuth e segurança de
            nível de linha (RLS) foi configurada e validada com sucesso.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              Sessão persistida em Cookies SSR
            </div>
            <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
              Mapeamento de Administrador Concluído
            </div>
            <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
              Políticas de RLS Ativas
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

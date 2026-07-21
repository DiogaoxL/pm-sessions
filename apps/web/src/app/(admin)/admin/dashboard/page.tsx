import { createServerClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { AdminStatsCards } from '@/features/admin/components/admin-stats-cards';
import { AdminTimeSlotList } from '@/features/admin/components/admin-time-slot-list';
import { AdminDashboardRepository } from '@/features/admin/repositories/admin-dashboard.repository';
import { CalendarAuthBanner } from '@/features/admin/components/calendar-auth-banner';

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

  const dashboardRepo = new AdminDashboardRepository(supabase);

  const [stats, slotsWithSessions] = await Promise.all([
    dashboardRepo.getDashboardStats(),
    dashboardRepo.getTimeSlotsWithSessions(),
  ]);

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Google Calendar Permission Warn Banner */}
        <CalendarAuthBanner />

        {/* Stats */}
        <section>
          <h1 className="text-2xl font-bold tracking-tight mb-5">Visão Geral</h1>
          <AdminStatsCards stats={stats} />
        </section>

        {/* Time Slots and Sessions */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-5">Time Slots e Sessões</h2>
          <AdminTimeSlotList slots={slotsWithSessions} />
        </section>
      </main>
    </div>
  );
}

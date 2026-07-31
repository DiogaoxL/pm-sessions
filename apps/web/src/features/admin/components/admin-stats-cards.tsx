import { AdminDashboardStats } from '../repositories/admin-dashboard.repository';
import { UserCheck, Calendar, Briefcase } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

function StatCard({ icon, label, value, colorClass }: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col gap-4 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/80">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg bg-neutral-950 border border-neutral-800 ${colorClass}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          {label}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-4xl font-bold tracking-tight text-white">{value}</span>
      </div>
    </div>
  );
}

interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<UserCheck className="size-4 text-emerald-400" />}
        label="Inscritos Confirmados"
        value={stats.totalParticipants}
        colorClass="text-emerald-400"
      />
      <StatCard
        icon={<Calendar className="size-4 text-sky-400" />}
        label="Slots Disponíveis"
        value={stats.availableSlots}
        colorClass="text-sky-400"
      />
      <StatCard
        icon={<Briefcase className="size-4 text-purple-400" />}
        label="Sessões Ativas"
        value={stats.activeSessions}
        colorClass="text-purple-400"
      />
    </div>
  );
}

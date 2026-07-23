import { AdminDashboardStats } from '../repositories/admin-dashboard.repository';
import { UserCheck, Calendar, Briefcase } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variation: string;
  progress: number;
  colorClass: string;
  barColor: string;
}

function StatCard({
  icon,
  label,
  value,
  variation,
  progress,
  colorClass,
  barColor,
}: StatCardProps) {
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
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          {variation}
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-end text-[10px] text-neutral-500 font-medium">{progress}%</div>
      </div>
    </div>
  );
}

interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  // Derive percentages or use defaults from wireframe
  const confirmedPercent = Math.min(Math.round((stats.totalParticipants / 60) * 100), 100) || 72;
  const slotsPercent = Math.min(Math.round((stats.availableSlots / 20) * 100), 100) || 40;
  const sessionsPercent = Math.min(Math.round((stats.activeSessions / 18) * 100), 100) || 90;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<UserCheck className="size-4 text-emerald-400" />}
        label="Inscritos Confirmados"
        value={stats.totalParticipants || 42}
        variation="▲ +8 hoje"
        progress={confirmedPercent}
        colorClass="text-emerald-400"
        barColor="bg-emerald-500"
      />
      <StatCard
        icon={<Calendar className="size-4 text-sky-400" />}
        label="Slots Disponíveis"
        value={stats.availableSlots || 8}
        variation="▲ +2 hoje"
        progress={slotsPercent}
        colorClass="text-sky-400"
        barColor="bg-sky-500"
      />
      <StatCard
        icon={<Briefcase className="size-4 text-purple-400" />}
        label="Sessões Ativas"
        value={stats.activeSessions || 16}
        variation="▲ +4 hoje"
        progress={sessionsPercent}
        colorClass="text-purple-400"
        barColor="bg-purple-500"
      />
    </div>
  );
}

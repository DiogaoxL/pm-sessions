import { AdminDashboardStats } from '../repositories/admin-dashboard.repository';

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  colorClass: string;
}

function StatCard({ label, value, description, colorClass }: StatCardProps) {
  return (
    <div className={`rounded-xl border bg-neutral-900/60 p-5 flex flex-col gap-2 ${colorClass}`}>
      <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-4xl font-bold tracking-tight">{value}</span>
      <span className="text-xs opacity-60">{description}</span>
    </div>
  );
}

interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Inscritos Confirmados"
        value={stats.totalParticipants}
        description="Participantes com status CONFIRMED"
        colorClass="border-emerald-500/20 text-emerald-300"
      />
      <StatCard
        label="Slots Disponíveis"
        value={stats.availableSlots}
        description="Time Slots com status OPEN"
        colorClass="border-sky-500/20 text-sky-300"
      />
      <StatCard
        label="Sessões Ativas"
        value={stats.activeSessions}
        description="Sessões com status AVAILABLE"
        colorClass="border-purple-500/20 text-purple-300"
      />
    </div>
  );
}

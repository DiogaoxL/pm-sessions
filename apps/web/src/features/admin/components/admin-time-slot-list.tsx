import { TimeSlotWithSessions } from '../../admin/repositories/admin-dashboard.repository';

interface TimeSlotStatusBadgeProps {
  status: 'OPEN' | 'FULL' | 'CLOSED';
}

function TimeSlotStatusBadge({ status }: TimeSlotStatusBadgeProps) {
  const classes = {
    OPEN: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    FULL: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    CLOSED: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400',
  }[status];

  const labels = { OPEN: 'Aberto', FULL: 'Lotado', CLOSED: 'Encerrado' };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {labels[status]}
    </span>
  );
}

interface SessionStatusBadgeProps {
  current: number;
  capacity: number;
  status: 'AVAILABLE' | 'FULL' | 'FINISHED';
}

function SessionCapacityBadge({ current, capacity, status }: SessionStatusBadgeProps) {
  const isFull = current >= capacity;
  const isFinished = status === 'FINISHED';

  const badgeClass = isFinished
    ? 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
    : isFull
      ? 'bg-red-500/10 border-red-500/20 text-red-400'
      : 'bg-sky-500/10 border-sky-500/20 text-sky-400';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {isFinished ? 'Encerrada' : `${current}/${capacity}`}
    </span>
  );
}

interface AdminTimeSlotListProps {
  slots: TimeSlotWithSessions[];
}

export function AdminTimeSlotList({ slots }: AdminTimeSlotListProps) {
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-16 rounded-2xl bg-neutral-800/60 flex items-center justify-center mb-4">
          <svg
            className="size-8 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-300">Nenhum slot cadastrado</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Crie um novo Time Slot para começar a gerenciar as sessões.
        </p>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, TimeSlotWithSessions[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(slotsByDate).map(([date, dateSlots]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-3">
            {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <div className="flex flex-col gap-4">
            {dateSlots.map((slot) => (
              <div
                key={slot.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">
                      {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                    </span>
                    <TimeSlotStatusBadge status={slot.status} />
                  </div>
                  <span className="text-xs text-neutral-500">
                    Cap. padrão: <span className="text-neutral-300">{slot.capacity}</span>
                  </span>
                </div>

                {/* Sessions */}
                {slot.sessions.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-neutral-500 italic">
                    Nenhuma sessão criada ainda.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-800">
                    {slot.sessions.map((session) => (
                      <div key={session.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-200">
                                Host: {session.organizer_email}
                              </span>
                              <SessionCapacityBadge
                                current={session.current_participants}
                                capacity={session.capacity}
                                status={session.status}
                              />
                            </div>
                            {session.meet_url && (
                              <a
                                href={session.meet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
                              >
                                Abrir Google Meet
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Participants */}
                        {session.participants.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                              Participantes
                            </span>
                            <ul className="flex flex-col gap-1">
                              {session.participants.map((p) => (
                                <li
                                  key={p.id}
                                  className="flex items-center gap-2 text-sm text-neutral-300"
                                >
                                  <span className="size-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                  <span className="font-medium">{p.name}</span>
                                  <span className="text-neutral-500">—</span>
                                  <span className="text-neutral-400">{p.email}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

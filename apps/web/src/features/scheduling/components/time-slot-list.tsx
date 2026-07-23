import React, { useMemo } from 'react';
import { TimeSlot } from '../repositories/interfaces';
import { TimeSlotCard } from './time-slot-card';

interface TimeSlotListProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelect?: (slot: TimeSlot) => void;
}

export function TimeSlotList({ slots, selectedSlotId, onSelect }: TimeSlotListProps) {
  // Group and sort slots chronologically by date and start_time
  const groupedSlots = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {};

    for (const slot of slots) {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    }

    // Sort dates ascending
    const sortedDates = Object.keys(groups).sort(
      (a, b) => new Date(a + 'T00:00:00').getTime() - new Date(b + 'T00:00:00').getTime(),
    );

    // Sort slots inside each date by start_time ascending
    return sortedDates.map((date) => {
      const sortedSlots = groups[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
      return {
        date,
        slots: sortedSlots,
      };
    });
  }, [slots]);

  // Safe formatting helper to avoid timezone offset shifts
  const formatHeaderDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const formatted = localDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  if (slots.length === 0) {
    return (
      <div className="w-full py-16 text-center border border-dashed border-[#2B3A55] rounded-3xl bg-[#162133]/40 space-y-3">
        <div className="size-12 bg-[#2B3A55]/30 rounded-full flex items-center justify-center mx-auto text-[#AEB8C5]">
          <svg
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Nenhum horário disponível</h3>
          <p className="text-sm text-[#AEB8C5] max-w-sm mx-auto">
            No momento não existem horários abertos para agendamento. Novas sessões serão
            disponibilizadas em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {groupedSlots.map((group) => (
        <section key={group.date} className="space-y-4">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2">
            {formatHeaderDate(group.date)}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {group.slots.map((slot) => (
              <TimeSlotCard
                key={slot.id}
                slot={slot}
                selected={slot.id === selectedSlotId}
                onClick={onSelect ? () => onSelect(slot) : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

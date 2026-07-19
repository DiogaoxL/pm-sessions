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
      <div className="w-full py-12 text-center text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <p className="text-base font-medium">Nenhum horário disponível no momento.</p>
        <p className="text-sm text-gray-400 mt-1">
          Por favor, tente novamente mais tarde ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {groupedSlots.map((group) => (
        <section key={group.date} className="space-y-4">
          <h3 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-2">
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

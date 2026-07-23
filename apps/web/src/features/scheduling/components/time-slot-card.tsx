import React from 'react';
import { TimeSlot } from '../repositories/interfaces';
import { cn } from '@/lib/utils';

interface TimeSlotCardProps {
  slot: TimeSlot;
  selected?: boolean;
  onClick?: () => void;
}

export function TimeSlotCard({ slot, selected = false, onClick }: TimeSlotCardProps) {
  const isAvailable = slot.status === 'OPEN';

  // Format times nicely (e.g. "10:00 - 11:00")
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  const formattedStart = formatTime(slot.start_time);
  const formattedEnd = formatTime(slot.end_time);

  return (
    <button
      type="button"
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      aria-pressed={selected}
      aria-label={`Horário das ${formattedStart} às ${formattedEnd}. Status: ${
        isAvailable ? 'Disponível' : 'Indisponível'
      }. Vagas: ${slot.availableSeats ?? slot.capacity}.`}
      className={cn(
        'w-full p-4 rounded-xl border text-left transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500',
        isAvailable
          ? selected
            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
            : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
          : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">
          {formattedStart} - {formattedEnd}
        </span>
        <span
          className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium',
            isAvailable
              ? selected
                ? 'bg-blue-200 text-blue-800'
                : 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-600',
          )}
        >
          {isAvailable ? `${slot.availableSeats ?? slot.capacity} vagas` : 'Esgotado'}
        </span>
      </div>
    </button>
  );
}

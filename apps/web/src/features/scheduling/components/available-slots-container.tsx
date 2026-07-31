'use client';

import React, { useEffect, useState } from 'react';
import { TimeSlot } from '../repositories/interfaces';
import { getAvailableSlotsAction } from '../actions/get-available-slots';
import { TimeSlotList } from './time-slot-list';
import { SchedulingSkeleton } from './scheduling-skeleton';

interface AvailableSlotsContainerProps {
  selectedSlotId?: string;
  onSelectSlot?: (slot: TimeSlot) => void;
  refreshKey?: number;
  onSlotsLoaded?: (slots: TimeSlot[]) => void;
}

function areSlotsEqual(a: TimeSlot[], b: TimeSlot[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].status !== b[i].status ||
      a[i].capacity !== b[i].capacity ||
      a[i].date !== b[i].date ||
      a[i].start_time !== b[i].start_time ||
      a[i].end_time !== b[i].end_time ||
      a[i].availableSeats !== b[i].availableSeats
    ) {
      return false;
    }
  }
  return true;
}

export function AvailableSlotsContainer({
  selectedSlotId,
  onSelectSlot,
  refreshKey = 0,
  onSlotsLoaded,
}: AvailableSlotsContainerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSlots() {
      try {
        const result = await getAvailableSlotsAction();
        if (!isMounted) return;

        if (result.success) {
          console.log('[PUBLIC] Slots recebidos pela página:', result.data);
          setSlots((prevSlots) => {
            if (areSlotsEqual(prevSlots, result.data)) {
              return prevSlots;
            }
            return result.data;
          });
          if (onSlotsLoaded) {
            onSlotsLoaded(result.data);
          }
          setError(null);
        } else {
          setError(result.error);
        }
      } catch {
        if (!isMounted) return;
        setError('Ocorreu um erro inesperado ao carregar os horários.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSlots();

    const interval = setInterval(loadSlots, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshKey, onSlotsLoaded]);

  if (loading) {
    return <SchedulingSkeleton />;
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="w-full p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm text-center"
      >
        <p className="font-semibold text-base">Não foi possível carregar os horários</p>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    );
  }

  return <TimeSlotList slots={slots} selectedSlotId={selectedSlotId} onSelect={onSelectSlot} />;
}

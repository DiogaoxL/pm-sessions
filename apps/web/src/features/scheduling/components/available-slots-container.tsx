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
}

export function AvailableSlotsContainer({
  selectedSlotId,
  onSelectSlot,
  refreshKey = 0,
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
          setSlots(result.data);
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

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

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

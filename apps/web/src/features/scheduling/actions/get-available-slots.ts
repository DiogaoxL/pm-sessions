'use server';

import { getSchedulingService } from './factory';
import { TimeSlot } from '../repositories/interfaces';

/**
 * Server Action to fetch available public scheduling time slots.
 */
export async function getAvailableSlotsAction(): Promise<
  { success: true; data: TimeSlot[] } | { success: false; error: string }
> {
  try {
    const schedulingService = await getSchedulingService();
    const slots = await schedulingService.getAvailableSlots();

    let finalSlots = slots;
    if (finalSlots.length === 0 && process.env.NODE_ENV === 'development') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      finalSlots = [
        {
          id: 'mock-slot-1',
          date: tomorrowStr,
          start_time: '10:00:00',
          end_time: '11:00:00',
          capacity: 3,
          status: 'OPEN',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'mock-slot-2',
          date: tomorrowStr,
          start_time: '14:30:00',
          end_time: '15:30:00',
          capacity: 0,
          status: 'FULL',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    return {
      success: true,
      data: finalSlots,
    };
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return {
      success: false,
      error: 'Não foi possível carregar os horários disponíveis. Tente novamente mais tarde.',
    };
  }
}

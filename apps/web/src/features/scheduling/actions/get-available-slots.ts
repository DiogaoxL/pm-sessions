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
    console.log('[PUBLIC] Slots retornados pela service:', slots);

    return {
      success: true,
      data: slots,
    };
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return {
      success: false,
      error: 'Não foi possível carregar os horários disponíveis. Tente novamente mais tarde.',
    };
  }
}

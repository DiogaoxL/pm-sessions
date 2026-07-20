'use server';

import { getSchedulingService } from './factory';

/**
 * Server Action to fetch the active session associated with a selected Time Slot.
 */
export async function getSessionBySlotAction(
  timeSlotId: string,
): Promise<{ success: true; sessionId: string } | { success: false; error: string }> {
  // Development check to avoid querying DB with invalid UUID formats (e.g. 'mock-slot-1')
  if (process.env.NODE_ENV === 'development' && timeSlotId.startsWith('mock-')) {
    return {
      success: true,
      sessionId: 'mock-session-1',
    };
  }

  try {
    const schedulingService = await getSchedulingService();
    const sessions = await schedulingService.getOpenSessionsBySlot(timeSlotId);

    if (sessions.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          sessionId: 'mock-session-1',
        };
      }
      return {
        success: false,
        error: 'Este horário não possui sessões ativas.',
      };
    }

    // Return the first active session's ID
    return {
      success: true,
      sessionId: sessions[0].id,
    };
  } catch (error) {
    console.error('Error fetching session by slot:', error);
    return {
      success: false,
      error: 'Não foi possível carregar a sessão para o horário selecionado.',
    };
  }
}

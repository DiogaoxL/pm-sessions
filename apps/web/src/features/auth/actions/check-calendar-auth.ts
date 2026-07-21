'use server';

import { GoogleCalendarService } from '@/features/scheduling/services/google-calendar.service';

/**
 * Checks if the Google Calendar API integration is currently authorized and active.
 * Attempts a lightweight query (e.g., checking availability for a 1-minute window).
 * If the credentials are revoked or invalid, it returns success: false.
 */
export async function checkCalendarAuthAction() {
  try {
    const calendarService = new GoogleCalendarService();
    // Lightweight check: query availability for next 1 minute
    const now = new Date();
    const oneMinLater = new Date(now.getTime() + 60000);
    await calendarService.checkAvailability(now, oneMinLater);
    return { success: true } as const;
  } catch (error: unknown) {
    console.warn('[auth] Google Calendar authorization check failed:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const isRevoked =
      msg.includes('invalid_grant') ||
      msg.includes('auth') ||
      msg.includes('credential') ||
      msg.includes('token');
    return { success: false, error: isRevoked ? 'revoked' : 'error' } as const;
  }
}

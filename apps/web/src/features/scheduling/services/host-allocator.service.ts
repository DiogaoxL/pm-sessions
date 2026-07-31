import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { IGoogleCalendarService } from './google-calendar.service';

export interface IHostAllocatorService {
  getNextHostEmail(): Promise<string>;
}

export class HostAllocatorService implements IHostAllocatorService {
  constructor(
    private supabase: SupabaseClient<Database>,
    private googleCalendarService?: IGoogleCalendarService,
  ) {}

  async getNextHostEmail(): Promise<string> {
    if (this.googleCalendarService && this.googleCalendarService.isCalendarConfigured()) {
      try {
        const primaryEmail = await this.googleCalendarService.getPrimaryCalendarEmail();
        if (primaryEmail) {
          return primaryEmail;
        }
      } catch (error) {
        console.warn('[HostAllocator] Failed to get primary calendar email, falling back:', error);
      }
    }

    return process.env.DEFAULT_HOST_EMAIL || 'diogo@pulsemais.org.br';
  }
}

import { supabaseAdmin } from '@/shared/lib/supabase/admin';
import { SchedulingService } from '../services/scheduling.service';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { SessionRepository } from '../repositories/session.repository';
import { ParticipantRepository } from '../repositories/participant.repository';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { HostAllocatorService } from '../services/host-allocator.service';

/**
 * Factory to dynamically instantiate the SchedulingService
 * with its repository dependencies using the server Supabase client.
 */
export async function getSchedulingService(): Promise<SchedulingService> {
  const timeSlotRepository = new TimeSlotRepository(supabaseAdmin);
  const sessionRepository = new SessionRepository(supabaseAdmin);
  const participantRepository = new ParticipantRepository(supabaseAdmin);
  const googleCalendarService = new GoogleCalendarService();
  const hostAllocator = new HostAllocatorService(supabaseAdmin, googleCalendarService);

  return new SchedulingService(
    timeSlotRepository,
    sessionRepository,
    participantRepository,
    googleCalendarService,
    hostAllocator,
  );
}

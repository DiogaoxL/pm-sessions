import { createServerClient } from '@/shared/lib/supabase/server';
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
  const supabase = await createServerClient();

  const timeSlotRepository = new TimeSlotRepository(supabase);
  const sessionRepository = new SessionRepository(supabase);
  const participantRepository = new ParticipantRepository(supabase);
  const googleCalendarService = new GoogleCalendarService();
  const hostAllocator = new HostAllocatorService(supabase);

  return new SchedulingService(
    timeSlotRepository,
    sessionRepository,
    participantRepository,
    googleCalendarService,
    hostAllocator,
  );
}

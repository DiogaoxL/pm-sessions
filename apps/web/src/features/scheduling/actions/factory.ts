import { createServerClient } from '@/shared/lib/supabase/server';
import { SchedulingService } from '../services/scheduling.service';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { SessionRepository } from '../repositories/session.repository';
import { ParticipantRepository } from '../repositories/participant.repository';

/**
 * Factory to dynamically instantiate the SchedulingService
 * with its repository dependencies using the server Supabase client.
 */
export async function getSchedulingService(): Promise<SchedulingService> {
  const supabase = await createServerClient();

  const timeSlotRepository = new TimeSlotRepository(supabase);
  const sessionRepository = new SessionRepository(supabase);
  const participantRepository = new ParticipantRepository(supabase);

  return new SchedulingService(timeSlotRepository, sessionRepository, participantRepository);
}

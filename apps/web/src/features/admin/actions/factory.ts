import { supabaseAdmin } from '@/shared/lib/supabase/admin';
import { TimeSlotRepository } from '../../scheduling/repositories/time-slot.repository';
import { SessionRepository } from '../../scheduling/repositories/session.repository';
import { ParticipantRepository } from '../../scheduling/repositories/participant.repository';
import { AdminTimeSlotService } from '../services/admin-time-slot.service';
import { AdminParticipantService } from '../services/admin-participant.service';
import { AdminDashboardRepository } from '../repositories/admin-dashboard.repository';
import { GoogleCalendarService } from '../../scheduling/services/google-calendar.service';
import { HostAllocatorService } from '../../scheduling/services/host-allocator.service';

/**
 * Factory que instancia os serviços administrativos com suas dependências.
 */
export async function getAdminServices() {
  const timeSlotRepository = new TimeSlotRepository(supabaseAdmin);
  const sessionRepository = new SessionRepository(supabaseAdmin);
  const participantRepository = new ParticipantRepository(supabaseAdmin);
  const adminDashboardRepository = new AdminDashboardRepository(supabaseAdmin);
  const googleCalendarService = new GoogleCalendarService();
  const hostAllocator = new HostAllocatorService(supabaseAdmin, googleCalendarService);

  const adminTimeSlotService = new AdminTimeSlotService(
    timeSlotRepository,
    sessionRepository,
    hostAllocator,
    googleCalendarService,
  );
  const adminParticipantService = new AdminParticipantService(
    sessionRepository,
    participantRepository,
  );

  return {
    adminTimeSlotService,
    adminParticipantService,
    adminDashboardRepository,
    sessionRepository,
    participantRepository,
    googleCalendarService,
  };
}

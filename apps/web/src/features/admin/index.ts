// Admin Feature — Public Exports
// Services
export {
  AdminTimeSlotService,
  AdminSlotAlreadyHasParticipantsError,
} from './services/admin-time-slot.service';
export {
  AdminParticipantService,
  ParticipantNotFoundError,
  SessionNotFoundError,
  SessionFullError,
  SessionFinishedError,
  ParticipantAlreadyInSessionError,
  CapacityBelowCurrentParticipantsError,
} from './services/admin-participant.service';

// Repositories
export { AdminDashboardRepository } from './repositories/admin-dashboard.repository';

// Types
export type {
  AdminDashboardStats,
  SessionWithParticipants,
  TimeSlotWithSessions,
} from './repositories/admin-dashboard.repository';

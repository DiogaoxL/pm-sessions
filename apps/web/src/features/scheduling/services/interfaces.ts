import { Participant, TimeSlot, Session } from '../repositories/interfaces';

export interface ISchedulingService {
  getAvailableSlots(): Promise<TimeSlot[]>;
  scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant>;
  getOpenSessionsBySlot(timeSlotId: string): Promise<Session[]>;
  cancelSession(participantId: string): Promise<void>;
}

import { Participant, TimeSlot, Session } from '../repositories/interfaces';

export interface ISchedulingService {
  getAvailableSlots(): Promise<TimeSlot[]>;
  reserveSeat(sessionId: string): Promise<boolean>;
  scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant>;
  getOpenSessionsBySlot(timeSlotId: string): Promise<Session[]>;
}

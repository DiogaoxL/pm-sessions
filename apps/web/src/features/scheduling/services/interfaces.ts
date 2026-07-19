import { Participant, TimeSlot } from '../repositories/interfaces';

export interface ISchedulingService {
  getAvailableSlots(): Promise<TimeSlot[]>;
  reserveSeat(sessionId: string): Promise<boolean>;
  registerParticipant(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant>;
  scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant>;
}

import {
  ITimeSlotRepository,
  ISessionRepository,
  IParticipantRepository,
  Participant,
  TimeSlot,
} from '../repositories/interfaces';
import { ISchedulingService } from './interfaces';

export class SchedulingService implements ISchedulingService {
  constructor(
    private timeSlotRepository: ITimeSlotRepository,
    private sessionRepository: ISessionRepository,
    private participantRepository: IParticipantRepository,
  ) {}

  async getAvailableSlots(): Promise<TimeSlot[]> {
    return this.timeSlotRepository.selectAvailableSlots();
  }

  async reserveSeat(sessionId: string): Promise<boolean> {
    return this.sessionRepository.tryReserveSeat(sessionId);
  }

  async registerParticipant(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    throw new Error('Method not implemented.');
  }

  async scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    throw new Error('Method not implemented.');
  }
}

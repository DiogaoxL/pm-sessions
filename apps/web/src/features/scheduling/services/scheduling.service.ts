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
    throw new Error('Method not implemented.');
  }

  async reserveSeat(sessionId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
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

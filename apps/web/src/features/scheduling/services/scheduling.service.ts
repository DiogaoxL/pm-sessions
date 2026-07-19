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

  private async registerParticipant(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    const exists = await this.participantRepository.existsConfirmedParticipant(email, timeSlotId);
    if (exists) {
      throw new Error('Duplicated participant registration for this time slot');
    }

    try {
      return await this.participantRepository.insertParticipant({
        email,
        name,
        session_id: sessionId,
        status: 'CONFIRMED',
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        (('code' in error && error.code === '23505') ||
          ('message' in error &&
            typeof error.message === 'string' &&
            (error.message.includes('unique constraint') ||
              error.message.includes('duplicate key'))))
      ) {
        throw new Error('Duplicated participant registration for this time slot');
      }
      throw error;
    }
  }

  async scheduleSession(
    email: string,
    name: string,
    sessionId: string,
    timeSlotId: string,
  ): Promise<Participant> {
    const seatReserved = await this.reserveSeat(sessionId);
    if (!seatReserved) {
      throw new Error('No seats available for this session');
    }

    try {
      return await this.registerParticipant(email, name, sessionId, timeSlotId);
    } catch (error) {
      await this.sessionRepository.decrementParticipants(sessionId);
      throw error;
    }
  }
}

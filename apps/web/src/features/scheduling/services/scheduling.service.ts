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
    _email: string,
    _name: string,
    _sessionId: string,
    _timeSlotId: string,
  ): Promise<Participant> {
    throw new Error('Method not implemented.');
  }
}

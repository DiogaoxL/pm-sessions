'use server';

import { z } from 'zod';
import { scheduleSessionSchema } from './schemas';
import { getSchedulingService } from './factory';
import { Participant } from '../repositories/interfaces';

export type ScheduleSessionResponse =
  | {
      success: true;
      data: Participant;
    }
  | {
      success: false;
      error: string;
      validationErrors?: z.inferFlattenedErrors<typeof scheduleSessionSchema>;
    };

/**
 * Server Action to handle candidate public scheduling form submission.
 */
export async function scheduleSessionAction(inputData: unknown): Promise<ScheduleSessionResponse> {
  // 1. Validate inputs using Zod Schema
  const result = scheduleSessionSchema.safeParse(inputData);

  if (!result.success) {
    return {
      success: false,
      error: 'Dados inválidos',
      validationErrors: result.error.flatten(),
    };
  }

  const { email, name, sessionId, timeSlotId } = result.data;

  try {
    // 2. Instantiate scheduling service via Factory
    const schedulingService = await getSchedulingService();

    // 3. Invoke public schedule session orchestrator service
    const participant = await schedulingService.scheduleSession(email, name, sessionId, timeSlotId);

    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';

    // 4. Map known business domain errors to user-friendly messages
    if (errorMessage.includes('No seats available')) {
      return {
        success: false,
        error: 'Esta sessão já não possui vagas disponíveis.',
      };
    }

    if (errorMessage.includes('Duplicated participant')) {
      return {
        success: false,
        error: 'Você já está cadastrado para este horário.',
      };
    }

    // 5. Hide unexpected database or technical errors behind a generic error
    console.error('Unexpected error in scheduleSessionAction:', error);
    return {
      success: false,
      error: 'Ocorreu um erro ao processar o seu agendamento. Tente novamente mais tarde.',
    };
  }
}

'use server';

import { z } from 'zod';
import { scheduleSessionSchema } from './schemas';
import { getSchedulingService } from './factory';
import { Participant } from '../repositories/interfaces';
import { revalidatePath } from 'next/cache';

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
  console.log('[TRACE 1] scheduleSessionAction — ENTROU. Payload:', JSON.stringify(inputData));

  // 1. Validate inputs using Zod Schema
  const result = scheduleSessionSchema.safeParse(inputData);

  if (!result.success) {
    console.log('[TRACE 1] VALIDATION FAILED:', result.error.flatten());
    return {
      success: false,
      error: 'Dados inválidos',
      validationErrors: result.error.flatten(),
    };
  }

  const { email, name, sessionId, timeSlotId } = result.data;
  console.log('[TRACE 1] SAIU validação OK. sessionId:', sessionId, 'timeSlotId:', timeSlotId);

  // Development bypass logic for visual testing
  if (process.env.NODE_ENV === 'development' && sessionId === 'mock-session-1') {
    if (email === 'error@example.com') {
      return {
        success: false,
        error: 'Esta sessão já não possui vagas disponíveis.',
      };
    }
    if (email === 'duplicate@example.com') {
      return {
        success: false,
        error: 'Você já está cadastrado para este horário.',
      };
    }

    return {
      success: true,
      data: {
        id: 'mock-participant-1',
        name,
        email,
        phone: result.data.phone || null,
        session_id: sessionId,
        status: 'CONFIRMED',
        allocated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  try {
    console.log('[TRACE 2] getSchedulingService — ENTROU');
    const schedulingService = await getSchedulingService();
    console.log('[TRACE 2] getSchedulingService — SAIU OK');

    console.log('[TRACE 3] scheduleSession — ENTROU. args:', {
      email,
      name,
      sessionId,
      timeSlotId,
    });
    const participant = await schedulingService.scheduleSession(email, name, sessionId, timeSlotId);
    console.log('[TRACE 3] scheduleSession — SAIU OK. participant:', JSON.stringify(participant));

    revalidatePath('/scheduling');

    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    console.error('[TRACE ERROR] scheduleSessionAction CAPTUROU EXCEÇÃO:', {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: (error as any)?.details,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hint: (error as any)?.hint,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: (error as any)?.code,
    });

    const errorMessage = error instanceof Error ? error.message : '';

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

    return {
      success: false,
      error: 'Ocorreu um erro ao processar o seu agendamento. Tente novamente mais tarde.',
    };
  }
}

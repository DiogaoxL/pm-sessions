'use server';

import { getAdminServices } from './factory';
import { revalidatePath } from 'next/cache';
import {
  ParticipantNotFoundError,
  SessionNotFoundError,
  SessionFullError,
  SessionFinishedError,
  ParticipantAlreadyInSessionError,
  CapacityBelowCurrentParticipantsError,
} from '../services/admin-participant.service';

// --- Helpers ---

function mapDomainError(error: unknown): string {
  if (error instanceof ParticipantNotFoundError) {
    return 'Participante não encontrado ou não está confirmado.';
  }
  if (error instanceof SessionNotFoundError) {
    return 'Sessão não encontrada.';
  }
  if (error instanceof SessionFullError) {
    return 'A sessão de destino está com capacidade esgotada.';
  }
  if (error instanceof SessionFinishedError) {
    return 'Não é possível mover participante para uma sessão encerrada.';
  }
  if (error instanceof ParticipantAlreadyInSessionError) {
    return 'O participante já está alocado na sessão de destino.';
  }
  if (error instanceof CapacityBelowCurrentParticipantsError) {
    return 'A nova capacidade não pode ser inferior ao número de participantes ativos.';
  }
  return 'Ocorreu um erro inesperado.';
}

// --- Remove Participant Action (Task 04 + Task 05) ---

/**
 * Remove (cancela) um participante administrativamente.
 * Após a remoção local, sincroniza a lista de convidados no Google Calendar.
 * Em caso de falha no Google Calendar, faz rollback da remoção local.
 */
export async function removeParticipantAction(participantId: string) {
  const {
    adminParticipantService,
    sessionRepository,
    participantRepository,
    googleCalendarService,
  } = await getAdminServices();

  // 1. Busca estado atual antes de remover (para rollback)
  const participantBefore = await participantRepository.findParticipantById(participantId);
  if (!participantBefore || participantBefore.status !== 'CONFIRMED') {
    return {
      success: false,
      error: 'Participante não encontrado ou não está confirmado.',
    } as const;
  }

  try {
    // 2. Remove localmente (CANCELLED + decrement)
    const removed = await adminParticipantService.removeParticipant(participantId);

    // 3. Sincroniza Google Calendar (Task 05)
    const session = await sessionRepository.findSessionById(removed.session_id);
    if (session?.calendar_event_id) {
      try {
        const remaining = await participantRepository.getParticipantsBySession(removed.session_id);
        const emails = remaining.map((p) => p.email);

        if (emails.length === 0) {
          // Se não restam participantes, remove o evento do calendário e limpa a sessão no banco
          await googleCalendarService.deleteEvent(session.calendar_event_id);
          await sessionRepository.updateSessionCalendar(session.id, null, null);
        } else {
          // Caso contrário, sincroniza a nova lista de e-mails
          const participantsLines = remaining.map((p) => `${p.name} — ${p.email}`).join('\n');
          const eventDescription = [
            'Participantes:',
            participantsLines,
            '',
            'Sessão:',
            `${remaining.length}/${session.capacity} participantes`,
          ].join('\n');

          await googleCalendarService.syncAttendees(
            session.calendar_event_id,
            emails,
            eventDescription,
          );
        }
      } catch (calendarError) {
        // Rollback: restaura estado do participante e incrementa sessão
        console.error(
          '[admin] removeParticipantAction — Google Calendar sync failed, rolling back',
          {
            session_id: removed.session_id,
            participant_id: participantId,
            organizer_email: session.organizer_email,
            error: calendarError,
          },
        );

        await sessionRepository.allocateParticipant(
          session.time_slot_id,
          removed.email,
          removed.name,
          removed.phone || null,
          session.organizer_email,
        );

        return {
          success: false,
          error: 'Falha ao sincronizar com o Google Calendar. A remoção foi revertida.',
        } as const;
      }
    }

    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: removed } as const;
  } catch (error) {
    return { success: false, error: mapDomainError(error) } as const;
  }
}

// --- Move Participant Action (Task 04 + Task 05) ---

/**
 * Move um participante para outra sessão.
 * Após a movimentação local, sincroniza:
 *   - Remove o participante do evento da sessão de origem.
 *   - Adiciona ao evento da sessão de destino.
 * Em caso de falha no Google Calendar, faz rollback da movimentação local.
 */
export async function moveParticipantAction(participantId: string, targetSessionId: string) {
  const {
    adminParticipantService,
    participantRepository,
    sessionRepository,
    googleCalendarService,
  } = await getAdminServices();

  try {
    // 1. Move localmente (Task 04)
    const result = await adminParticipantService.moveParticipant(participantId, targetSessionId);
    const { participant, sourceSession, targetSession } = result;

    // 2. Sincroniza Google Calendar da sessão de origem (Task 05)
    if (sourceSession.calendar_event_id) {
      try {
        const sourceParticipants = await participantRepository.getParticipantsBySession(
          sourceSession.id,
        );
        const sourceEmails = sourceParticipants.map((p) => p.email);

        if (sourceEmails.length === 0) {
          await googleCalendarService.deleteEvent(sourceSession.calendar_event_id);
          await sessionRepository.updateSessionCalendar(sourceSession.id, null, null);
        } else {
          const sourceLines = sourceParticipants.map((p) => `${p.name} — ${p.email}`).join('\n');
          const sourceDesc = [
            'Participantes:',
            sourceLines,
            '',
            'Sessão:',
            `${sourceParticipants.length}/${sourceSession.capacity} participantes`,
          ].join('\n');
          await googleCalendarService.syncAttendees(
            sourceSession.calendar_event_id,
            sourceEmails,
            sourceDesc,
          );
        }
      } catch (calendarError) {
        console.error('[admin] moveParticipantAction — Source Calendar sync failed, rolling back', {
          session_id: sourceSession.id,
          participant_id: participantId,
          organizer_email: sourceSession.organizer_email,
          error: calendarError,
        });
        // Rollback: move participant back
        await adminParticipantService.moveParticipant(participantId, sourceSession.id);
        return {
          success: false,
          error:
            'Falha ao sincronizar com o Google Calendar (origem). A movimentação foi revertida.',
        } as const;
      }
    }

    // 3. Sincroniza Google Calendar da sessão de destino (Task 05)
    if (targetSession.calendar_event_id) {
      try {
        const targetParticipants = await participantRepository.getParticipantsBySession(
          targetSession.id,
        );
        const targetEmails = targetParticipants.map((p) => p.email);

        const targetLines = targetParticipants.map((p) => `${p.name} — ${p.email}`).join('\n');
        const targetDesc = [
          'Participantes:',
          targetLines,
          '',
          'Sessão:',
          `${targetParticipants.length}/${targetSession.capacity} participantes`,
        ].join('\n');
        await googleCalendarService.syncAttendees(
          targetSession.calendar_event_id,
          targetEmails,
          targetDesc,
        );
      } catch (calendarError) {
        console.error('[admin] moveParticipantAction — Target Calendar sync failed, rolling back', {
          session_id: targetSession.id,
          participant_id: participantId,
          organizer_email: targetSession.organizer_email,
          error: calendarError,
        });
        // Rollback: move participant back to source
        await adminParticipantService.moveParticipant(participantId, sourceSession.id);
        return {
          success: false,
          error:
            'Falha ao sincronizar com o Google Calendar (destino). A movimentação foi revertida.',
        } as const;
      }
    }

    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: participant } as const;
  } catch (error) {
    return { success: false, error: mapDomainError(error) } as const;
  }
}

export async function updateSessionCapacityAction(sessionId: string, newCapacity: number) {
  const {
    adminParticipantService,
    participantRepository,
    sessionRepository,
    googleCalendarService,
  } = await getAdminServices();

  const originalSession = await sessionRepository.findSessionById(sessionId);
  if (!originalSession) {
    return { success: false, error: 'Sessão não encontrada' } as const;
  }

  try {
    const session = await adminParticipantService.updateSessionCapacity(sessionId, newCapacity);

    if (session.calendar_event_id) {
      try {
        const participants = await participantRepository.getParticipantsBySession(sessionId);
        const emails = participants.map((p) => p.email);
        const participantsLines = participants.map((p) => `${p.name} — ${p.email}`).join('\n');

        const eventDescription = [
          'Participantes:',
          participantsLines,
          '',
          'Sessão:',
          `${participants.length}/${newCapacity} participantes`,
        ].join('\n');

        await googleCalendarService.syncAttendees(
          session.calendar_event_id,
          emails,
          eventDescription,
        );
      } catch (calendarError) {
        console.error(
          '[admin] updateSessionCapacityAction — Google Calendar sync failed, rolling back capacity update',
          calendarError,
        );
        // Rollback capacity update
        await adminParticipantService.updateSessionCapacity(sessionId, originalSession.capacity);
        return {
          success: false,
          error:
            'Falha ao sincronizar a capacidade com o Google Calendar. A alteração foi revertida.',
        } as const;
      }
    }

    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: session } as const;
  } catch (error) {
    return { success: false, error: mapDomainError(error) } as const;
  }
}

export async function createSessionAction(
  timeSlotId: string,
  organizerEmail: string,
  capacity: number,
  title?: string,
) {
  try {
    const { sessionRepository } = await getAdminServices();
    const session = await sessionRepository.createSession(
      timeSlotId,
      organizerEmail,
      capacity,
      title,
    );
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: session } as const;
  } catch (error) {
    console.error('[admin] createSessionAction error:', error);
    return { success: false, error: 'Falha ao criar sessão manualmente.' } as const;
  }
}

'use server';

import { getAdminServices } from './factory';
import { TimeSlotInsert, TimeSlotUpdate } from '../../scheduling/repositories/interfaces';
import { AdminSlotAlreadyHasParticipantsError } from '../services/admin-time-slot.service';
import { revalidatePath } from 'next/cache';

// --- Time Slot Actions ---

export async function listAllSlotsAction() {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    const slots = await adminTimeSlotService.listAllSlots();
    return { success: true, data: slots } as const;
  } catch (error) {
    console.error('[admin] listAllSlotsAction error:', error);
    return { success: false, error: 'Falha ao buscar os time slots.' } as const;
  }
}

export async function createSlotAction(
  data: Omit<TimeSlotInsert, 'id' | 'created_at' | 'updated_at'>,
  title?: string,
  hostEmail?: string,
) {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    const slot = await adminTimeSlotService.createSlot(data, title, hostEmail);
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: slot } as const;
  } catch (error) {
    console.error('[admin] createSlotAction error:', error);
    return { success: false, error: 'Falha ao criar o time slot.' } as const;
  }
}

export async function updateSlotAction(id: string, data: TimeSlotUpdate) {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    const slot = await adminTimeSlotService.updateSlot(id, data);
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: slot } as const;
  } catch (error) {
    if (error instanceof AdminSlotAlreadyHasParticipantsError) {
      return {
        success: false,
        error: 'Não é possível editar um slot com participantes ativos.',
      } as const;
    }
    console.error('[admin] updateSlotAction error:', error);
    return { success: false, error: 'Falha ao atualizar o time slot.' } as const;
  }
}

export async function closeSlotAction(id: string) {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    const slot = await adminTimeSlotService.closeSlot(id);
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true, data: slot } as const;
  } catch (error) {
    if (error instanceof AdminSlotAlreadyHasParticipantsError) {
      return {
        success: false,
        error: 'Não é possível fechar um slot com participantes ativos.',
      } as const;
    }
    console.error('[admin] closeSlotAction error:', error);
    return { success: false, error: 'Falha ao encerrar o time slot.' } as const;
  }
}

export async function deleteSlotAction(id: string, deleteCalendarEvents: boolean = false) {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    await adminTimeSlotService.deleteSlot(id, deleteCalendarEvents);
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true } as const;
  } catch (error: unknown) {
    if (error instanceof AdminSlotAlreadyHasParticipantsError) {
      return {
        success: false,
        error: 'Não é possível excluir um slot com participantes ativos.',
      } as const;
    }
    console.error('[admin] deleteSlotAction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha ao excluir o time slot.',
    } as const;
  }
}

export async function syncSlotCalendarEventsAction(
  id: string,
  date: string,
  startTime: string,
  endTime: string,
) {
  try {
    const { adminTimeSlotService } = await getAdminServices();
    await adminTimeSlotService.syncSlotCalendarEvents(id, date, startTime, endTime);
    revalidatePath('/scheduling');
    revalidatePath('/admin/dashboard');
    return { success: true } as const;
  } catch (error) {
    console.error('[admin] syncSlotCalendarEventsAction error:', error);
    return { success: false, error: 'Falha ao sincronizar o calendário.' } as const;
  }
}

// --- Dashboard Actions ---

export async function getDashboardStatsAction() {
  try {
    const { adminDashboardRepository } = await getAdminServices();
    const stats = await adminDashboardRepository.getDashboardStats();
    return { success: true, data: stats } as const;
  } catch (error) {
    console.error('[admin] getDashboardStatsAction error:', error);
    return { success: false, error: 'Falha ao buscar métricas do dashboard.' } as const;
  }
}

export async function getTimeSlotsWithSessionsAction() {
  try {
    const { adminDashboardRepository } = await getAdminServices();
    const data = await adminDashboardRepository.getTimeSlotsWithSessions();
    return { success: true, data } as const;
  } catch (error) {
    console.error('[admin] getTimeSlotsWithSessionsAction error:', error);
    return { success: false, error: 'Falha ao buscar slots com sessões.' } as const;
  }
}

import { z } from 'zod';

export const scheduleSessionSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .trim(),
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' })
    .trim(),
  sessionId: z.string().min(1, { message: 'Session ID é obrigatório' }).trim(),
  timeSlotId: z.string().min(1, { message: 'Time Slot ID é obrigatório' }).trim(),
  phone: z.string().trim().optional().nullable(),
});

export type ScheduleSessionInput = z.infer<typeof scheduleSessionSchema>;

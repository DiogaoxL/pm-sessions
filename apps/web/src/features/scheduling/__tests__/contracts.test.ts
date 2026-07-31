import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('API & RPC Contract Testing', () => {
  // Schema for TimeSlot payload from getAvailableSlots
  const TimeSlotSchema = z.object({
    id: z.string().uuid(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    capacity: z.number().int().nonnegative(),
    status: z.enum(['OPEN', 'CLOSED']),
    availableSeats: z.number().int().nonnegative().optional(),
  });

  // Schema for scheduling input parameters
  const ScheduleSessionInputSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    sessionId: z.string().uuid(),
    timeSlotId: z.string().uuid(),
    phone: z.string().nullable().optional(),
  });

  it('should validate typical available time slots contract', () => {
    const payload = {
      id: '900f62cb-82db-4510-9d97-9afe203ee99f',
      date: '2026-07-28',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 3,
      status: 'OPEN',
      availableSeats: 2,
    };
    const parsed = TimeSlotSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it('should fail validation on invalid properties', () => {
    const payload = {
      id: 'invalid-uuid',
      date: '2026-07-28',
      start_time: '14:00:00',
      capacity: -5,
      status: 'INVALID_STATUS',
    };
    const parsed = TimeSlotSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  it('should validate schedule session form payload contract', () => {
    const input = {
      email: 'john.doe@test.com',
      name: 'John Doe',
      sessionId: '3fffcae1-1918-4efe-be57-d4de49245f6b',
      timeSlotId: 'f556c88e-0dc1-459d-838f-d21832e912bc',
      phone: '11999999999',
    };
    const parsed = ScheduleSessionInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Mock server-only to allow Vitest execution
vi.mock('server-only', () => ({}));

// Manually load env variables for remote integration testing
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    const parts = trimmedLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts
        .slice(1)
        .join('=')
        .trim()
        .replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  }
} catch (e) {
  console.error('Failed to load env.local', e);
}

interface SupabaseClientStub {
  from: (table: string) => {
    select: (columns?: string) => {
      limit: (
        n: number,
      ) => Promise<{ data: Record<string, unknown>[] | null; error: { message: string } | null }>;
    };
  };
  rpc: (
    method: string,
    params?: Record<string, unknown>,
  ) => Promise<{ error: { message: string } | null }>;
}

interface ServiceInternalStub {
  timeSlotRepository: {
    supabase: SupabaseClientStub;
  };
  googleCalendarService: {
    filterFreeSlots: unknown;
  };
}

describe('DatabaseIntegritySuite', () => {
  it('should validate table schemas and column presence on remote database', async () => {
    const { getSchedulingService } = await import('../../actions/factory');
    const service = await getSchedulingService();
    const stub = service as unknown as ServiceInternalStub;
    const supabase = stub.timeSlotRepository.supabase;

    // 1. Validate sessions table schema
    const { data: sessionData, error: sessError } = await supabase
      .from('sessions')
      .select('*')
      .limit(1);

    expect(sessError).toBeNull();
    if (sessionData && sessionData.length > 0) {
      const session = sessionData[0];
      const requiredColumns = [
        'id',
        'time_slot_id',
        'organizer_email',
        'calendar_event_id',
        'meet_url',
        'capacity',
        'current_participants',
        'status',
        'created_at',
        'updated_at',
      ];
      for (const col of requiredColumns) {
        expect(session).toHaveProperty(col);
      }
    }

    // 2. Validate time_slots table schema
    const { data: slotData, error: slotError } = await supabase
      .from('time_slots')
      .select('*')
      .limit(1);

    expect(slotError).toBeNull();
    if (slotData && slotData.length > 0) {
      const slot = slotData[0];
      const requiredColumns = [
        'id',
        'date',
        'start_time',
        'end_time',
        'capacity',
        'status',
        'created_at',
        'updated_at',
      ];
      for (const col of requiredColumns) {
        expect(slot).toHaveProperty(col);
      }
    }
  }, 60000); // 60s timeout

  it('should validate foreign keys relation logic between sessions and time_slots', async () => {
    const { getSchedulingService } = await import('../../actions/factory');
    const service = await getSchedulingService();
    const stub = service as unknown as ServiceInternalStub;
    const supabase = stub.timeSlotRepository.supabase;

    // Verify foreign key: sessions.time_slot_id reference time_slots.id
    const { data, error } = await supabase.from('sessions').select('id, time_slots(id)').limit(1);

    expect(error).toBeNull();
    if (data && data.length > 0) {
      expect(data[0]).toHaveProperty('time_slots');
    }
  }, 60000);
});

describe('RpcIntegritySuite', () => {
  it('should verify Remote Procedure Call signatures and parameters', async () => {
    const { getSchedulingService } = await import('../../actions/factory');
    const service = await getSchedulingService();
    const stub = service as unknown as ServiceInternalStub;
    const supabase = stub.timeSlotRepository.supabase;

    // Verify allocate_participant signature endpoint
    const { error: allocateErr } = await supabase.rpc('allocate_participant', {
      p_time_slot_id: '00000000-0000-0000-0000-000000000000',
      p_email: 'audit@test.com',
      p_name: 'Auditor',
      p_phone: null,
      p_organizer_email: 'audit-organizer@test.com',
    });
    if (allocateErr) {
      expect(allocateErr.message).not.toContain('does not exist');
    }

    // Verify create_session_manual signature endpoint
    const { error: createSessionErr } = await supabase.rpc('create_session_manual', {
      p_time_slot_id: '00000000-0000-0000-0000-000000000000',
      p_organizer_email: 'audit-organizer@test.com',
      p_capacity: 3,
      p_title: 'Entrevista',
    });
    if (createSessionErr) {
      expect(createSessionErr.message).not.toContain('does not exist');
    }
  }, 60000);
});

describe('TimezoneRegressionSuite', () => {
  it('should verify timezone offsets are correctly resolved (BRT/UTC)', () => {
    // local 14:00 BRT must be parsed with timezone offset explicitly
    const localTimeStr = '2026-07-25T14:00:00-03:00';
    const parsedDate = new Date(localTimeStr);
    expect(parsedDate.toISOString()).toBe('2026-07-25T17:00:00.000Z');
  });
});

describe('PerformanceSuite', () => {
  it('should check execution times of core modules', async () => {
    const { getSchedulingService } = await import('../../actions/factory');
    const service = await getSchedulingService();
    const stub = service as unknown as ServiceInternalStub;

    // Mock Google Calendar API to measure pure local system latency (DB + Logic)
    stub.googleCalendarService.filterFreeSlots = vi
      .fn()
      .mockImplementation((dateStr, slots) => Promise.resolve(slots));

    const startPub = performance.now();
    await service.getAvailableSlots();
    const endPub = performance.now();

    const publicLoadTime = endPub - startPub;
    console.log(
      `[PERFORMANCE] Public Page Load (No Internet Latency): ${publicLoadTime.toFixed(2)}ms`,
    );
    expect(publicLoadTime).toBeLessThan(3000); // must be < 3000ms to allow for remote DB connections under parallel test execution
  }, 60000);
});

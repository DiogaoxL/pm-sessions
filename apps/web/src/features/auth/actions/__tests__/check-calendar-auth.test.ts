import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkCalendarAuthAction } from '../check-calendar-auth';
import { GoogleCalendarService } from '@/features/scheduling/services/google-calendar.service';

vi.mock('@/features/scheduling/services/google-calendar.service', () => {
  return {
    GoogleCalendarService: class {
      checkAvailability() {
        return Promise.resolve([]);
      }
    },
  };
});

describe('checkCalendarAuthAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna success: true quando a verificação do calendário responde com sucesso', async () => {
    const spy = vi
      .spyOn(GoogleCalendarService.prototype, 'checkAvailability')
      .mockResolvedValue([]);

    const result = await checkCalendarAuthAction();

    expect(result.success).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('retorna success: false e erro revoked quando a API falha com invalid_grant', async () => {
    const spy = vi
      .spyOn(GoogleCalendarService.prototype, 'checkAvailability')
      .mockRejectedValue(new Error('Google API Error: invalid_grant'));

    const result = await checkCalendarAuthAction();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('revoked');
    }
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('retorna success: false e erro revoked quando a API falha com erro de credencial', async () => {
    const spy = vi
      .spyOn(GoogleCalendarService.prototype, 'checkAvailability')
      .mockRejectedValue(new Error('No API credentials found'));

    const result = await checkCalendarAuthAction();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('revoked');
    }
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('retorna success: false e erro generic quando a API falha com outro tipo de erro', async () => {
    const spy = vi
      .spyOn(GoogleCalendarService.prototype, 'checkAvailability')
      .mockRejectedValue(new Error('Network connection timeout'));

    const result = await checkCalendarAuthAction();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('error');
    }
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

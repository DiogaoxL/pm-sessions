// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import { AvailableSlotsContainer } from '../available-slots-container';
import { getAvailableSlotsAction } from '../../actions/get-available-slots';
import { TimeSlot } from '../../repositories/interfaces';

vi.mock('../../actions/get-available-slots', () => ({
  getAvailableSlotsAction: vi.fn(),
}));

const mockSlots: TimeSlot[] = [
  {
    id: 'slot-1',
    date: '2026-07-20',
    start_time: '10:00:00',
    end_time: '11:00:00',
    capacity: 2,
    status: 'OPEN',
    created_at: '',
    updated_at: '',
  },
];

describe('AvailableSlotsContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve renderizar o esqueleto de carregamento inicialmente', async () => {
    // delay resolving the action to inspect loading state
    vi.mocked(getAvailableSlotsAction).mockReturnValue(new Promise(() => {}));

    const { container } = render(<AvailableSlotsContainer />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('deve renderizar listagem de slots apos sucesso na action', async () => {
    vi.mocked(getAvailableSlotsAction).mockResolvedValue({
      success: true,
      data: mockSlots,
    });

    render(<AvailableSlotsContainer />);

    await waitFor(() => {
      expect(screen.getByText(/20 de julho/i)).toBeInTheDocument();
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    });
  });

  test('deve renderizar banner de erro se a action falhar', async () => {
    vi.mocked(getAvailableSlotsAction).mockResolvedValue({
      success: false,
      error: 'Erro no banco de dados',
    });

    render(<AvailableSlotsContainer />);

    await waitFor(() => {
      expect(screen.getByText('Não foi possível carregar os horários')).toBeInTheDocument();
      expect(screen.getByText('Erro no banco de dados')).toBeInTheDocument();
    });
  });
});

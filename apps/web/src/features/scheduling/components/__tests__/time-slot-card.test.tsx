// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe } from 'vitest';
import { TimeSlotCard } from '../time-slot-card';
import { TimeSlot } from '../../repositories/interfaces';

const mockSlot: TimeSlot = {
  id: 'slot-1',
  date: '2026-07-20',
  start_time: '10:00:00',
  end_time: '11:00:00',
  capacity: 3,
  status: 'OPEN',
  created_at: '2026-07-19T00:00:00Z',
  updated_at: '2026-07-19T00:00:00Z',
};

describe('TimeSlotCard', () => {
  test('deve renderizar os horarios, capacidade e status disponivel', () => {
    render(<TimeSlotCard slot={mockSlot} />);

    expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText('3 vagas')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('deve renderizar estado indisponivel/esgotado quando status nao for OPEN', () => {
    const closedSlot: TimeSlot = { ...mockSlot, status: 'CLOSED', capacity: 0 };
    render(<TimeSlotCard slot={closedSlot} />);

    expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText('Esgotado')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('deve refletir selecao visual com aria-pressed e classes corretas', () => {
    render(<TimeSlotCard slot={mockSlot} selected={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('bg-blue-50');
  });

  test('deve disparar callback onClick no clique se estiver disponivel', () => {
    const onClick = vi.fn();
    render(<TimeSlotCard slot={mockSlot} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('nao deve disparar callback onClick quando estiver indisponivel', () => {
    const onClick = vi.fn();
    const closedSlot: TimeSlot = { ...mockSlot, status: 'CLOSED' };
    render(<TimeSlotCard slot={closedSlot} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

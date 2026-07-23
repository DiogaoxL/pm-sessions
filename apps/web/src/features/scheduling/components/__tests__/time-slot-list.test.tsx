// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe } from 'vitest';
import { TimeSlotList } from '../time-slot-list';
import { TimeSlot } from '../../repositories/interfaces';

const mockSlots: TimeSlot[] = [
  {
    id: 'slot-1',
    date: '2026-07-22',
    start_time: '14:00:00',
    end_time: '15:00:00',
    capacity: 2,
    status: 'OPEN',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'slot-2',
    date: '2026-07-20',
    start_time: '11:00:00',
    end_time: '12:00:00',
    capacity: 3,
    status: 'OPEN',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'slot-3',
    date: '2026-07-20',
    start_time: '09:00:00',
    end_time: '10:00:00',
    capacity: 1,
    status: 'OPEN',
    created_at: '',
    updated_at: '',
  },
];

describe('TimeSlotList', () => {
  test('deve agrupar e ordenar os slots cronologicamente por dia e horario', () => {
    render(<TimeSlotList slots={mockSlots} />);

    // Check that headers are rendered.
    // "2026-07-20" formats to monday, 20 of july
    // "2026-07-22" formats to wednesday, 22 of july
    expect(screen.getByText(/20 de julho/i)).toBeInTheDocument();
    expect(screen.getByText(/22 de julho/i)).toBeInTheDocument();

    // Check order of buttons/slots.
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    // slot-3 should be first (09:00 on 20/07)
    expect(buttons[0]).toHaveTextContent('09:00 - 10:00');
    // slot-2 should be second (11:00 on 20/07)
    expect(buttons[1]).toHaveTextContent('11:00 - 12:00');
    // slot-1 should be third (14:00 on 22/07)
    expect(buttons[2]).toHaveTextContent('14:00 - 15:00');
  });

  test('deve exibir feedback de empty state se a lista estiver vazia', () => {
    render(<TimeSlotList slots={[]} />);

    expect(screen.getByText('Nenhum horário disponível')).toBeInTheDocument();
  });

  test('deve chamar callback onSelect com os dados corretos ao clicar em um card', () => {
    const onSelect = vi.fn();
    render(<TimeSlotList slots={mockSlots} onSelect={onSelect} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Click on 09:00 slot (slot-3)

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockSlots[2]);
  });
});

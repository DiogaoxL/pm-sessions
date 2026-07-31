// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TimeSlotCard } from '../components/time-slot-card';
import { TimeSlot } from '../repositories/interfaces';

describe('UI Component Snapshot Testing', () => {
  it('should match snapshot of TimeSlotCard when status is OPEN', () => {
    const slot: TimeSlot = {
      id: 'slot-1',
      date: '2026-08-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 3,
      status: 'OPEN',
      availableSeats: 2,
      created_at: '2026-07-28T00:00:00Z',
      updated_at: '2026-07-28T00:00:00Z',
    };

    const { container } = render(<TimeSlotCard slot={slot} selected={false} onClick={() => {}} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot of TimeSlotCard when status is CLOSED/full', () => {
    const slot: TimeSlot = {
      id: 'slot-2',
      date: '2026-08-15',
      start_time: '14:00:00',
      end_time: '15:00:00',
      capacity: 3,
      status: 'CLOSED',
      availableSeats: 0,
      created_at: '2026-07-28T00:00:00Z',
      updated_at: '2026-07-28T00:00:00Z',
    };

    const { container } = render(<TimeSlotCard slot={slot} selected={false} onClick={() => {}} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

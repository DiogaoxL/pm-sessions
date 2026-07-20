// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { SchedulingSkeleton } from '../scheduling-skeleton';

describe('SchedulingSkeleton', () => {
  test('deve renderizar a estrutura de loading com placeholders e animacao de pulso', () => {
    const { container } = render(<SchedulingSkeleton />);

    // Check that we have elements with animate-pulse
    const pulseElements = container.getElementsByClassName('animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);

    // Verify it is hidden from assistive technologies but present in DOM
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });
});

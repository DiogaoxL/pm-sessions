// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import { SchedulingForm } from '../scheduling-form';
import { scheduleSessionAction, ScheduleSessionResponse } from '../../actions/schedule-session';

vi.mock('../../actions/schedule-session', () => ({
  scheduleSessionAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe('SchedulingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve renderizar campos e botoes corretamente com acessibilidade', () => {
    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
  });

  test('deve permitir digitacao e atualizar campos', async () => {
    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);
    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/e-mail/i);

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  test('deve chamar onSuccess com dados corretos apos submissao com sucesso', async () => {
    const onSuccess = vi.fn();
    vi.mocked(scheduleSessionAction).mockResolvedValue({
      success: true,
      data: {
        id: 'participant-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        session_id: 'session-1',
        status: 'CONFIRMED',
        allocated_at: '',
        created_at: '',
        updated_at: '',
      },
    });

    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(scheduleSessionAction).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'participant-1',
          name: 'John Doe',
        }),
      );
      expect(screen.getByText('Agendamento Confirmado!')).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, el) =>
            el?.tagName.toLowerCase() === 'p' &&
            el.textContent?.includes('Nome:') === true &&
            el.textContent?.includes('John Doe') === true,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, el) =>
            el?.tagName.toLowerCase() === 'p' &&
            el.textContent?.includes('E-mail:') === true &&
            el.textContent?.includes('john@example.com') === true,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
      expect(screen.queryByLabelText(/nome completo/i)).not.toBeInTheDocument();
    });
  });

  test('deve renderizar erro global em banner em caso de falha de negocio', async () => {
    vi.mocked(scheduleSessionAction).mockResolvedValue({
      success: false,
      error: 'Vagas esgotadas para este horário.',
    });

    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(screen.getByText('Vagas esgotadas para este horário.')).toBeInTheDocument();
    });
  });

  test('deve renderizar erros de campos especificos em caso de erros de validacao', async () => {
    vi.mocked(scheduleSessionAction).mockResolvedValue({
      success: false,
      error: 'Dados inválidos',
      validationErrors: {
        fieldErrors: {
          name: ['Nome deve ter pelo menos 3 caracteres'],
          email: ['E-mail inválido'],
        },
        formErrors: [],
      },
    });

    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'Jo');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'invalid-email@example.com');
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 3 caracteres')).toBeInTheDocument();
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    });
  });

  test('deve desabilitar botoes/inputs e mostrar text loading durante envio', async () => {
    let resolveAction!: (value: ScheduleSessionResponse) => void;
    const promise = new Promise<ScheduleSessionResponse>((resolve) => {
      resolveAction = resolve;
    });
    vi.mocked(scheduleSessionAction).mockReturnValue(promise);

    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'john@example.com');

    // Click submit
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    });

    // Inputs and submit buttons should be disabled, button should display "Agendando..."
    expect(screen.getByLabelText(/nome completo/i)).toBeDisabled();
    expect(screen.getByLabelText(/e-mail/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /agendando.../i })).toBeDisabled();

    // Resolve action
    await act(async () => {
      resolveAction({
        success: true,
        data: {
          id: '',
          name: '',
          email: '',
          phone: null,
          session_id: '',
          status: 'CONFIRMED',
          allocated_at: '',
          created_at: '',
          updated_at: '',
        },
      });
    });

    // Wait for the success state to be rendered, ensuring no pending state updates leak
    await waitFor(() => {
      expect(screen.getByText('Agendamento Confirmado!')).toBeInTheDocument();
    });
  });

  test('deve exibir erro generico e chamar onError quando a action lanca uma excecao inesperada', async () => {
    const onError = vi.fn();
    vi.mocked(scheduleSessionAction).mockRejectedValue(new Error('Unexpected failure'));

    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" onError={onError} />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Ocorreu um erro inesperado ao realizar o agendamento.'),
      ).toBeInTheDocument();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Ocorreu um erro inesperado ao realizar o agendamento.');
    });

    // Formulário deve voltar ao estado normal após o erro
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeEnabled();
    expect(screen.getByLabelText(/nome completo/i)).toBeEnabled();
  });

  test('nao deve renderizar botao Cancelar quando onCancel nao for informado', () => {
    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" />);

    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });

  test('deve renderizar botao Cancelar e disparar callback ao clicar', async () => {
    const onCancel = vi.fn();
    render(<SchedulingForm sessionId="session-1" timeSlotId="slot-1" onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

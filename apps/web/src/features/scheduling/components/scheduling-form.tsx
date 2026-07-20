import React, { useState, useTransition } from 'react';
import { Participant } from '../repositories/interfaces';
import { scheduleSessionAction } from '../actions';
import { cn } from '@/lib/utils';

interface SchedulingFormProps {
  sessionId: string;
  timeSlotId: string;
  onSuccess?: (participant: Participant) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

export function SchedulingForm({
  sessionId,
  timeSlotId,
  onSuccess,
  onError,
  onCancel,
}: SchedulingFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    // Reset error states before new submission
    setFieldErrors({});
    setGlobalError(null);

    startTransition(async () => {
      try {
        const result = await scheduleSessionAction({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() ? phone.trim() : null,
          sessionId,
          timeSlotId,
        });

        if (result.success) {
          setIsSuccess(true);
          if (onSuccess) {
            onSuccess(result.data);
          }
        } else {
          // Map validation fieldErrors if present
          if (result.validationErrors?.fieldErrors) {
            const mappedErrors: Record<string, string> = {};
            Object.entries(result.validationErrors.fieldErrors).forEach(([key, val]) => {
              if (Array.isArray(val) && val.length > 0) {
                mappedErrors[key] = val[0];
              }
            });
            setFieldErrors(mappedErrors);
          } else {
            setGlobalError(result.error);
          }

          if (onError) {
            onError(result.error);
          }
        }
      } catch {
        const fallbackMsg = 'Ocorreu um erro inesperado ao realizar o agendamento.';
        setGlobalError(fallbackMsg);
        if (onError) {
          onError(fallbackMsg);
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-white p-6 rounded-2xl border border-green-200 shadow-sm text-center space-y-4">
        <div className="size-12 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
          <svg
            className="size-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">Agendamento Confirmado!</h3>
          <p className="text-xs text-gray-500">Seu horário foi reservado com sucesso.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Voltar
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* Global Business Error Banner */}
      {globalError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm"
        >
          <p className="font-semibold">Não foi possível completar o agendamento</p>
          <p className="mt-1 text-red-700">{globalError}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isPending}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          autoComplete="name"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.name && (
          <p id="name-error" className="text-xs text-red-600 mt-1 font-medium">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
          autoComplete="email"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-xs text-red-600 mt-1 font-medium">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefone <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          disabled={isPending}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.phone
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.phone && (
          <p id="phone-error" className="text-xs text-red-600 mt-1 font-medium">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Agendando...' : 'Confirmar'}
        </button>
      </div>
    </form>
  );
}

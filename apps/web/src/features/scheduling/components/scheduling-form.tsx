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
          }

          setGlobalError(result.error);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* Global Business Error Banner */}
      {globalError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm">
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
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.name}</p>
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
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
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
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400',
            fieldErrors.phone
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        {fieldErrors.phone && (
          <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
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

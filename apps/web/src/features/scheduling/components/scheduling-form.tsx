import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Participant } from '../repositories/interfaces';
import { scheduleSessionAction } from '../actions/schedule-session';
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
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [participantData, setParticipantData] = useState<Participant | null>(null);
  const [isPending, startTransition] = useTransition();

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) {
      return numbers;
    }
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    // Reset error states before new submission
    setFieldErrors({});
    setGlobalError(null);

    // Client-side validations
    const errors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = 'Nome completo é obrigatório';
    } else if (trimmedName.length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!trimmedEmail) {
      errors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(trimmedEmail)) {
      errors.email = 'E-mail inválido';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Strip visual mask for database persistence (only numbers)
    const cleanPhone = phone.replace(/\D/g, '');

    startTransition(async () => {
      try {
        const result = await scheduleSessionAction({
          name: trimmedName,
          email: trimmedEmail,
          phone: cleanPhone ? cleanPhone : null,
          sessionId,
          timeSlotId,
        });

        if (result.success) {
          setParticipantData(result.data);
          setIsSuccess(true);
          router.refresh();
          if (onSuccess) {
            onSuccess(result.data);
          }
        } else {
          if (result.error === 'SESSION_FULL') {
            setGlobalError('Vagas esgotadas para este horário.');
            router.refresh();
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

  const handleReset = () => {
    setIsSuccess(false);
    setParticipantData(null);
    setName('');
    setEmail('');
    setPhone('');
    setFieldErrors({});
    setGlobalError(null);
    if (onCancel) {
      onCancel();
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-[#162133] p-4 rounded-2xl border border-emerald-500/20 shadow-2xl text-center space-y-4 animate-in fade-in duration-300">
        <div className="size-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <svg
            className="size-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-0.5">
          <h3
            tabIndex={-1}
            id="success-title"
            className="text-base font-bold text-white outline-none"
          >
            Agendamento Confirmado!
          </h3>
          <p className="text-xs text-[#AEB8C5]">Seu horário foi reservado com sucesso.</p>
        </div>

        {participantData && (
          <div className="bg-[#0F2849]/30 rounded-xl p-3 text-left border border-[#2B3A55] space-y-2.5">
            <div className="text-[10px] text-[#AEB8C5] uppercase font-bold tracking-wider pb-0.5 border-b border-[#2B3A55]/50">
              Dados da Inscrição
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="text-white font-medium">
                <span className="text-[#AEB8C5] font-normal">Nome:</span> {participantData.name}
              </p>
              <p className="text-white font-medium">
                <span className="text-[#AEB8C5] font-normal">E-mail:</span> {participantData.email}
              </p>
              {participantData.organizer_email && (
                <p className="text-white font-medium">
                  <span className="text-[#AEB8C5] font-normal">Organizador:</span>{' '}
                  {participantData.organizer_email}
                </p>
              )}
              <p className="text-white font-medium">
                <span className="text-[#AEB8C5] font-normal">Status:</span>{' '}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-950/40 text-green-400 border border-green-500/20">
                  Confirmada
                </span>
              </p>
              {participantData.calendar_event_id && (
                <div className="pt-1.5 border-t border-[#2B3A55]/30 space-y-1 text-[10px] text-emerald-400 font-medium text-left">
                  <p className="flex items-center gap-1">
                    <span className="text-[9px]">✔</span> Convite enviado para seu email
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-[9px]">✔</span> Link do Google Meet enviado junto ao
                    convite
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/10 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="w-full space-y-5 bg-[#162133] p-6 rounded-3xl border border-[#2B3A55] shadow-xl"
    >
      {/* Global Business Error Banner */}
      {globalError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 text-sm"
        >
          <p className="font-semibold">Não foi possível completar o agendamento</p>
          <p className="mt-1 text-red-400">{globalError}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-[#AEB8C5]">
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
            'w-full px-3.5 py-2 border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 disabled:bg-neutral-800 disabled:text-neutral-500 bg-[#0F2849]',
            fieldErrors.name
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[#2B3A55] focus:border-blue-500 focus:ring-blue-500/20',
          )}
        />
        {fieldErrors.name && (
          <p id="name-error" aria-live="polite" className="text-xs text-red-400 mt-1 font-medium">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-[#AEB8C5]">
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
            'w-full px-3.5 py-2 border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 disabled:bg-neutral-800 disabled:text-neutral-500 bg-[#0F2849]',
            fieldErrors.email
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[#2B3A55] focus:border-blue-500 focus:ring-blue-500/20',
          )}
        />
        {fieldErrors.email && (
          <p id="email-error" aria-live="polite" className="text-xs text-red-400 mt-1 font-medium">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-[#AEB8C5]">
          Telefone <span className="text-neutral-500 text-xs font-normal">(Opcional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          disabled={isPending}
          value={phone}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            setPhone(formatted);
          }}
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          className={cn(
            'w-full px-3.5 py-2 border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 disabled:bg-neutral-800 disabled:text-neutral-500 bg-[#0F2849]',
            fieldErrors.phone
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[#2B3A55] focus:border-blue-500 focus:ring-blue-500/20',
          )}
        />
        {fieldErrors.phone && (
          <p id="phone-error" aria-live="polite" className="text-xs text-red-400 mt-1 font-medium">
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
            className="px-4 py-2 border border-[#2B3A55] text-neutral-300 text-sm font-medium rounded-lg bg-transparent hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && (
            <span className="size-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
          )}
          <span>{isPending ? 'Agendando...' : 'Confirmar'}</span>
        </button>
      </div>
    </form>
  );
}

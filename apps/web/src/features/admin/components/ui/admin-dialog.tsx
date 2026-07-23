import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from './loading-button';

interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AdminDialog({ isOpen, onClose, title, children }: AdminDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 m-auto rounded-xl border border-neutral-800 bg-neutral-900 text-white p-6 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm max-w-md w-full focus:outline-none"
    >
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <h3 className="text-lg font-bold">{title}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="py-4">{children}</div>
    </dialog>,
    document.body,
  );
}

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmação',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  variant = 'default',
}: AdminConfirmDialogProps) {
  return (
    <AdminDialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-sm text-neutral-300">{description}</div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <LoadingButton
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </LoadingButton>
        </div>
      </div>
    </AdminDialog>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AdminCard({ children, className, onClick }: AdminCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:border-neutral-700 hover:bg-neutral-900',
        className,
      )}
    >
      {children}
    </div>
  );
}

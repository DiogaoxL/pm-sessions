import React from 'react';
import { cn } from '@/lib/utils';

interface AdminSectionProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminSection({ title, action, children, className }: AdminSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

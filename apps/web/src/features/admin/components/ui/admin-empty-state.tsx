import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40 p-6">
      {Icon && (
        <div className="size-16 rounded-2xl bg-neutral-900/60 flex items-center justify-center mb-4 border border-neutral-800">
          <Icon className="size-8 text-neutral-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-300">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

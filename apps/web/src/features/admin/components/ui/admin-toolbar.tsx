import React from 'react';

interface AdminToolbarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminToolbar({ title, description, action }: AdminToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="text-sm text-neutral-400">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

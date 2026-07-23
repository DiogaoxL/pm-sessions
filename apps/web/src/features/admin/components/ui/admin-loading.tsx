import React from 'react';
import { cn } from '@/lib/utils';

export function AdminSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-neutral-800', className)} />;
}

export function AdminLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="size-8 rounded-full border-4 border-neutral-800 border-t-emerald-500 animate-spin" />
    </div>
  );
}

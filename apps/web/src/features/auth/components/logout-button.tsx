'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '../actions/sign-out';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 hover:bg-neutral-800 hover:text-red-400 transition-colors"
    >
      {isPending ? (
        <span className="size-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <LogOut className="size-4" />
      )}
      <span>Sair</span>
    </Button>
  );
}

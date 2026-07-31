'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardRefresher() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}

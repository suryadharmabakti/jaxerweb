'use client';

import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-jax-bg flex">
      <Sidebar />
      <div className="flex-1 pl-72">
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

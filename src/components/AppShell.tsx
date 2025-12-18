'use client';

import { type ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-jax-bg">
      <Sidebar open={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-72' : 'pl-20'}`}
      >
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

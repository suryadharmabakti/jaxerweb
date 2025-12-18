'use client';

import { type ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-jax-bg">
      <Sidebar open={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'pl-72' : 'pl-0'
        }`}
      >
        {!isSidebarOpen && (
          <div className="fixed left-6 top-6 z-30">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg bg-white p-2 text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

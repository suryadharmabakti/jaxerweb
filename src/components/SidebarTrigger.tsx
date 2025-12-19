'use client';

import { useSidebar } from '@/components/AppShell';

export default function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
      title="Toggle Sidebar"
    >
      <img src="/siderbar.svg" alt="Toggle Sidebar" className="h-6 w-6" />
    </button>
  );
}

// ===== src/components/ClientLayout.tsx =====
"use client";

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  const isLogin = pathname === '/login' || pathname.startsWith('/login/');
  const loadProfileFromStorage = useStore((s) => s.loadProfileFromStorage);

  useEffect(() => {
    // load persisted profile (if any) once on client mount
    loadProfileFromStorage();
  }, [loadProfileFromStorage]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {!isLogin && <Sidebar />}
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
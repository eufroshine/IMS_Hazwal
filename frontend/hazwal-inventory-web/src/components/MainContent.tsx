// ===== src/components/MainContent.tsx =====
'use client';

import PageTransition from './PageTransition';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out bg-zinc-800">
      <div className="px-8 py-10 lg:px-12 lg:py-12 2xl:px-16 2xl:py-14 max-w-7xl mx-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </main>
  );
}
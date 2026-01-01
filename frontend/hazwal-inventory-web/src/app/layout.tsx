// ===== src/app/layout.tsx =====
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hazwal Inventory Management',
  description: 'Sistem Manajemen Inventori PT Hazwal Perdana Mandiri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Toaster position="top-right" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

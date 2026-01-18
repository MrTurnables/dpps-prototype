import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'DPPS - Duplicate Payment Prevention System',
  description: 'Enterprise-grade duplicate payment prevention and recovery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}

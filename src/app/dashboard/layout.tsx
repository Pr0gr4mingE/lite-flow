import { AppShell } from '@/core/app-shell';
import { Toaster } from 'react-hot-toast'; // 1. Importação da biblioteca

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {/* 2. O Toaster fica encapsulado dentro do shell, pronto para disparar alertas nas telas filhas */}
      <Toaster position="bottom-right" reverseOrder={false} />
      {children}
    </AppShell>
  );
}
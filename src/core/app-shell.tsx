import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900">
      {/* Menu Lateral Fixo */}
      <Sidebar />

      {/* Lado Direito: Header + Conteúdo + Footer */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        
        {/* Área Central onde as páginas (como o Kanban) serão renderizadas */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
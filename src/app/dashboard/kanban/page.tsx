import { KanbanBoard } from '@/components/features/pipeline/kanban-board';
import { jsonDb } from '@/infrastructure/database/json-client';

export default async function KanbanPage() {
  // Lê os dados do arquivo JSON no servidor antes de renderizar a tela
  const banco = await jsonDb.ler();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quadro Kanban</h1>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <KanbanBoard colunasIniciais={banco.colunas} />
      </div>
    </div>
  );
}
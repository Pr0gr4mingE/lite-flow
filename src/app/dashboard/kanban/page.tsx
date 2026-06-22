import { KanbanBoard } from '@/components/features/pipeline/kanban-board';
import { jsonDb } from '@/infrastructure/database/json-client';
import { BotaoNovaNegociacao } from '@/components/features/pipeline/botao-nova-negociacao';

export default async function KanbanPage() {
  // Lê os dados do arquivo JSON no servidor
  const banco = await jsonDb.ler();

  return (
    <div className="h-full flex flex-col">
      {/* CABEÇALHO */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quadro Kanban</h1>
        </div>
        
        {/* Renderiza o botão que controla o Modal de Criação */}
        <BotaoNovaNegociacao />
      </div>

      {/* ÁREA DO BOARD */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <KanbanBoard colunasIniciais={banco.colunas} />
      </div>
    </div>
  );
}
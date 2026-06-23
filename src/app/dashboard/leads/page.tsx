import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { LeadsClient } from "@/components/features/leads/leads-client";

export default async function LeadsPage() {
  const banco = await jsonDb.ler();
  
  // Procura a coluna que contenha "Prospecção" no título (ignorando maiúsculas/minúsculas)
  const colunaProspeccao = banco.colunas.find(
    (c: KanbanColumnProps) => c.titulo.toLowerCase().includes("prospecção")
  );

  // Se a coluna existir, pegamos os cards. Se não, array vazio.
  const leadsIniciais = colunaProspeccao ? colunaProspeccao.cards : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads em Prospecção</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seus clientes potenciais e agende reuniões de qualificação.
        </p>
      </div>

      {/* Injeta os dados no Client Component que construímos */}
      <LeadsClient leadsIniciais={leadsIniciais} />
    </div>
  );
}
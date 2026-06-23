import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props"; // <-- Adicionei a importação do card
import { ClientesClient } from "@/components/features/clientes/clientes-client";
import { ClienteProps } from "@/hooks/clientes/use-clientes";

export default async function ClientesPage() {
  const banco = await jsonDb.ler();

  const colunaFechamento = banco.colunas.find(
    (c: KanbanColumnProps) => c.titulo.toLowerCase().includes("fechamento")
  );

  const clientesBrutos = colunaFechamento ? colunaFechamento.cards : [];
  
  // Trocamos o 'any' por 'KanbanCardProps' para manter a tipagem estrita e o TypeScript feliz
  const clientesIniciais: ClienteProps[] = clientesBrutos.map((card: KanbanCardProps) => ({
    ...card,
    statusNegociacao: 'pendente', 
    tarefas: [], 
  }));

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-500 mt-1">
          Carteira de clientes ativos e histórico de negociações pós-reunião.
        </p>
      </div>

      <ClientesClient clientesIniciais={clientesIniciais} />
    </div>
  );
}
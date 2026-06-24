import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { ClientesClient } from "@/components/features/clientes/clientes-client";
import { ClienteProps, StatusNegociacao, TarefaCliente } from "@/hooks/clientes/use-clientes";

// Estendemos a interface para o TypeScript não reclamar ao ler o banco
interface CardComCRM extends KanbanCardProps {
  statusNegociacao?: StatusNegociacao;
  tarefas?: TarefaCliente[];
}

export default async function ClientesPage() {
  const banco = await jsonDb.ler();

  const colunaFechamento = banco.colunas.find(
    (c: KanbanColumnProps) => c.titulo.toLowerCase().includes("fechamento")
  );

  const clientesBrutos = colunaFechamento ? colunaFechamento.cards : [];
  
  const clientesIniciais: ClienteProps[] = clientesBrutos.map((cardBase: KanbanCardProps) => {
    const card = cardBase as CardComCRM;
    
    return {
      ...card,
      // A CORREÇÃO ESTÁ AQUI: 
      // Lê o statusNegociacao do banco. Se for null/undefined, vira 'pendente'
      statusNegociacao: card.statusNegociacao || 'pendente', 
      
      // Mesma coisa para as tarefas
      tarefas: card.tarefas || [], 
    };
  });

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
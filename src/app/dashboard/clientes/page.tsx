import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps} from "@/shared/types/ui/kanban-card.props"
import { ClientesClient } from "@/components/features/clientes/clientes-client";
import { ClienteProps, StatusNegociacao, TarefaCliente } from "@/hooks/clientes/use-clientes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==========================================
// 1. TIPAGENS (Resolvendo o problema do 'any' e do .quadros)
// ==========================================
interface QuadroProps {
  id: string;
  titulo: string;
  donoId: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[];
}

interface BancoDeDadosProps {
  quadros: QuadroProps[];
}

interface CardComCRM extends KanbanCardProps {
  statusNegociacao?: StatusNegociacao;
  tarefas?: TarefaCliente[];
}

export default async function ClientesPage() {
  // Controle de Acesso
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  // 2. Lemos o banco usando o Double Cast para o TypeScript reconhecer o .quadros
  const banco = (await jsonDb.ler()) as unknown as BancoDeDadosProps;
  
  // 3. Localiza o quadro do utilizador sem usar 'any'
  const quadros = banco.quadros || [];
  const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

  if (!quadroDoUsuario) {
    redirect("/login"); // Se o usuário logado não tiver quadro, joga pro login por segurança
  }

  // Procura a coluna de fechamento do utilizador
  const colunaFechamento = quadroDoUsuario.colunas.find(
    (c: KanbanColumnProps) => c.titulo.toLowerCase().includes("fechamento")
  );

  const clientesBrutos = colunaFechamento ? colunaFechamento.cards : [];
  
  const clientesIniciais: ClienteProps[] = clientesBrutos.map((cardBase: KanbanCardProps) => {
    const card = cardBase as CardComCRM;
    return {
      ...card,
      statusNegociacao: card.statusNegociacao || 'pendente', 
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